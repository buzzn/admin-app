import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { UncontrolledTooltip } from 'reactstrap';
import Moment from 'moment';
import orderBy from 'lodash/orderBy';
import reduce from 'lodash/reduce';
import isEqual from 'lodash/isEqual';
import { extendMoment } from 'moment-range';
import Alert from 'react-s-alert';
import Groups from 'groups';
import Billings from 'billings';
import BillingCycles from 'billing_cycles';
import PageTitle from 'components/page_title';
import { CenterContent, FormGroup } from 'components/style';
import Loading from 'components/loading';
import { BreadcrumbsProps } from 'components/breadcrumbs';
import { getAllUrlParams } from '_util';
import BillingDetails from 'components/billing_details';
import { MaLoListHeader, MaLoRow, Bar, Legend, DetailsWrapper, MassChangeBlock } from './style';

const d3 = require('d3');

const moment = extendMoment(Moment);

const killPhrase = "I know what i'm doing, leave me alone!!!";

class BillingData extends React.Component<
  ExtProps & StateProps & DispatchProps & BreadcrumbsProps & InjectedIntlProps,
  BillingDataState
  > {
  state = {
    maLoSortAsc: true,
    maLoSelected: null,
    barSelected: null,
    contractSelected: null,
    hackLoading: false,
    killSwitch: false,
    killValidation: '',
    killErr: '',
    statuses: {},
  };

  componentDidMount() {
    const { billingCycleId, groupId, loadBillingCycle, loadGroup } = this.props;
    loadGroup(groupId);
    loadBillingCycle({ billingCycleId, groupId });
    const { malo, bar, contract }: any = getAllUrlParams();
    if (malo && bar & contract) this.setState({ maLoSelected: malo, barSelected: parseInt(bar), contractSelected: parseInt(contract) });
  }

  componentDidUpdate() {
    const { billingCycleBars } = this.props;
    const { statuses } = this.state;
    const newStatuses = billingCycleBars.array
      .flatMap(m => m.bars.array.filter(b => b.contractType !== 'contract_localpool_third_party').map(b => b.status))
      .reduce((res, status) => ({ ...res, [status]: res[status] ? res[status] + 1 : 1 }), {});
    if (!isEqual(newStatuses, statuses)) this.setState({ statuses: newStatuses });
  }

  componentWillUnmount() {
    this.props.setBillingCycle({ billingCycle: { _status: null }, billingCycleBars: { _status: null, array: [] } });
  }

  switchKill = () => {
    this.setState({ killSwitch: !this.state.killSwitch, killErr: '', killValidation: '' });
  };

  setKill = ({ target: { value } }) => {
    this.setState({ killValidation: value });
  };

  killEmAll = () => {
    if (this.state.killValidation !== killPhrase) {
      this.setState({ killErr: "You don't know what you're doing." });
      return;
    }
    if (confirm('R U sure????????') && confirm('100% sure?????') && confirm('Last warning')) {
      this.setState({ killSwitch: !this.state.killSwitch, killErr: '', killValidation: '' });
      this.hackStatus({ to: 'void', all: true });
    }
  };

  switchMaLoSort = () => {
    this.setState({ maLoSortAsc: !this.state.maLoSortAsc });
  };

  selectBar = (maLoId, barId, contractId) => {
    const { history } = this.props;
    const { maLoSelected, barSelected, contractSelected } = this.state;
    if (maLoId === maLoSelected && barId === barSelected && contractId === contractSelected) {
      this.setState({ maLoSelected: null, barSelected: null, contractSelected: null });
      history.replace({ pathname: history.location.pathname });
    } else {
      this.setState({ maLoSelected: maLoId, barSelected: barId, contractSelected: contractId });
      if (maLoId && barId && contractId) {
        history.replace({
          pathname: history.location.pathname,
          search: `?malo=${maLoId}&bar=${barId}&contract=${contractId}`,
        });
      } else {
        history.replace({ pathname: history.location.pathname });
      }
    }
  };

  scrollToRow = () => {
    const { maLoSelected } = this.state;
    const node = document.getElementById(`malo_row_${maLoSelected}`);
    if (!node) return;
    const { top } = node.getBoundingClientRect();
    if (top < 0) window.scrollBy({ top: top - 57, left: 0, behavior: 'smooth' });
  };

  hackStatus = async ({ from, to, all }: { from?: string; to: string; all?: boolean }) => {
    if (!confirm('R U Sure?????')) return;
    const { billingCycle, billingCycleBars, updateBilling, groupId, loadBillingCycle, billingCycleId } = this.props;
    const toUpdate = all
      ? billingCycle.billings.array
      : billingCycle.billings.array.filter(b => b.status === from && b.allowedActions.update.status[to] === true);
    const bars = billingCycleBars.array
      .flatMap(b => b.bars.array)
      .reduce((res, b) => ({ ...res, [b.billingId]: b.contractId }), {});
    if (!toUpdate.length) {
      Alert.error('Nothing to update');
      return;
    }
    this.setState({ hackLoading: true });
    // right now backend can only handle 1 pdf generation at a time :(
    for (let i = 0; i < toUpdate.length; i++) {
      try {
        await new Promise((resolve, reject) => {
          updateBilling({
            params: { status: to, updatedAt: toUpdate[i].updatedAt },
            resolve,
            reject,
            groupId,
            contractId: bars[toUpdate[i].id],
            billingId: toUpdate[i].id,
            noReload: true,
          });
        });
        Alert.success(`Billing ${toUpdate[i].fullInvoiceNumber} updated, ${toUpdate.length - i - 1} to go.`);
      } catch (e) {
        Alert.error(JSON.stringify(e));
      }
    }
    loadBillingCycle({ billingCycleId, groupId });
    this.setState({ hackLoading: false });
  };

  render() {
    const {
      billingCycle,
      billingCycleBars,
      breadcrumbs,
      url,
      loading,
      groupId,
      groupName,
      intl,
      history,
      getBillingCycleZip,
      billingCycleId,
    } = this.props;
    const {
      maLoSortAsc,
      maLoSelected,
      barSelected,
      contractSelected,
      hackLoading,
      killSwitch,
      killValidation,
      killErr,
      statuses,
    } = this.state;

    if (loading || billingCycle._status === null || hackLoading) return <Loading minHeight={40} />;
    if (billingCycle._status && billingCycle._status !== 200) return <Redirect to={url} />;

    const prefix = 'admin.billingCycles';
    const cycleBegin = new Date(billingCycle.beginDate);
    const cycleEnd = moment(billingCycle.lastDate)
      .add(1, 'day')
      .toDate();
    // FIXME: proper moment-range typings will be in 3.2.0 or 4.0.0
    const cycleMonths: Array<any> = Array.from(moment.range(cycleBegin, cycleEnd).by('month'));
    const labelFormat = 'MMM';
    let labels: Array<any> = [];
    if (cycleMonths.length < 8) {
      labels = cycleMonths.map(m => m.format(labelFormat));
    } else {
      labels = [
        cycleMonths[0].format(labelFormat),
        cycleMonths[Math.floor(cycleMonths.length / 4)].format(labelFormat),
        cycleMonths[Math.floor((cycleMonths.length / 4) * 2)].format(labelFormat),
        cycleMonths[Math.floor((cycleMonths.length / 4) * 3)].format(labelFormat),
        cycleMonths[cycleMonths.length - 1].format(labelFormat),
      ];
    }

    const barScale = d3
      .scaleTime()
      .domain([cycleBegin, cycleEnd])
      .range([0, 100]);

    const ticks = [0].concat(
      d3
        .scaleTime()
        .domain([cycleBegin, cycleEnd])
        .ticks(d3.timeMonth)
        .map(t => barScale(t)),
    );

    return (
      <React.Fragment>
        <PageTitle
          {...{
            breadcrumbs: breadcrumbs.concat([
              { id: 1, link: `/groups/${groupId}`, title: groupName },
              { id: 2, link: url, title: intl.formatMessage({ id: 'admin.breadcrumbs.billingCycles' }) },
              { id: '-----', title: billingCycle.name },
            ]),
            title: billingCycle.name,
          }}
        />
        <CenterContent>
          <MaLoListHeader {...{ ticks }}>
            <div className="name">
              <div onClick={this.switchMaLoSort}>
                <FormattedMessage id={`${prefix}.maloListTitle`} />
              </div>
            </div>
            <div className="labels">
              <div className="dates">
                <div className="begin">{moment(cycleBegin).format('DD.MM.YYYY')}</div>
                <div className="end">{moment(billingCycle.lastDate).format('DD.MM.YYYY')}</div>
              </div>
              <div className="months">
                {ticks.map(t => (
                  <div key={t} className="grid-line" style={{ left: `${t}%` }} />
                ))}
                {cycleMonths.length < 8
                  ? labels.map((l, i) => (
                      <div key={i} className="month" style={{ left: `${ticks[i]}%` }}>
                        {l}
                      </div>
                  ))
                  : labels.map((l, i) => (
                      <div
                        key={i}
                        className="month"
                        style={{ left: `${i === labels.length - 1 ? 'calc(100% - 26px)' : `${i * 25}%`}` }}
                      >
                        {l}
                      </div>
                  ))}
              </div>
            </div>
          </MaLoListHeader>
          {orderBy(billingCycleBars.array, 'name', maLoSortAsc ? 'asc' : 'desc').map(m => (
            <React.Fragment key={m.id}>
              <MaLoRow {...{ ticks }} id={`malo_row_${m.id}`}>
                <div className="name">
                  <div>
                    <Link
                      to={`${url
                        .split('/')
                        .slice(0, -1)
                        .join('/')}/market-locations/${m.id}`}
                    >
                      {m.name}
                    </Link>
                  </div>
                </div>
                <div className="bars">
                  {ticks.map(t => (
                    <div key={t} className="grid-line" style={{ left: `${t}%` }} />
                  ))}
                  {m.bars.array.map((b, i) => {
                    const beginDate = new Date(b.beginDate);
                    const endDate = b.endDate ? new Date(b.endDate) : cycleEnd;
                    const fixedBeginDate = beginDate < cycleBegin ? cycleBegin : beginDate > cycleEnd ? cycleEnd : beginDate;
                    const fixedEndDate = endDate > cycleEnd ? cycleEnd : endDate;
                    const width = barScale(fixedEndDate) - barScale(fixedBeginDate);
                    const narrow = width < 16;
                    // array is needed to have a transparent fake bar in some edge cases.
                    const bars: Array<JSX.Element> = [];
                    if (i === 0 && fixedBeginDate > cycleBegin) {
                      bars.push(<Bar key={0} {...{ width: barScale(fixedBeginDate), transparent: true }} />);
                    }
                    bars.push(
                      <Bar
                        key={b.billingId}
                        {...{
                          width,
                          status: b.status,
                          contractType: b.contractType,
                          narrow,
                        }}
                        onClick={() => {
                          if (b.contractType !== 'contract_localpool_third_party') this.selectBar(m.id, b.billingId, b.contractId);
                        }}
                      >
                        <div
                          className={`bar-bg ${maLoSelected === m.id && barSelected === b.billingId ? 'selected' : ''}`}
                        >
                          <div />
                          <div className="info">
                            {b.contractType !== 'contract_localpool_third_party' && (
                              <div className="price">
                                {!!b.totalAmountBeforeTaxes
                                  && `${intl.formatNumber((b.totalAmountBeforeTaxes / 100).toFixed(2), { minimumFractionDigits: 2 })}${narrow ? '' : '€'}`}
                              </div>
                            )}
                            <div className="energy">
                              {!!b.totalConsumedEnergyKwh
                                && `${intl.formatNumber(b.totalConsumedEnergyKwh)}${narrow ? '' : 'kWh'}`}
                            </div>
                          </div>
                          <div className="error">
                            {b.contractType !== 'contract_localpool_third_party'
                              && !!b.errors
                              && !!Object.keys(b.errors).length && (
                                <React.Fragment>
                                  <i id={`err-tip-${m.id}-${b.billingId}`} className="fa fa-exclamation-triangle" />
                                  <UncontrolledTooltip
                                    placement="bottom"
                                    target={`err-tip-${m.id}-${b.billingId}`}
                                    delay={200}
                                  >
                                    {reduce(
                                      b.errors,
                                      (message, errArr) => `${message}${errArr.join(', ')}, `,
                                      '',
                                    ).slice(0, -2)}
                                  </UncontrolledTooltip>
                                </React.Fragment>
                            )}
                          </div>
                        </div>
                      </Bar>,
                    );
                    return bars;
                  })}
                </div>
              </MaLoRow>
              {/* FIXME: temporary hack/fix: */}
              <div style={{ marginTop: '-10px', minHeight: '10px' }}>
                <DetailsWrapper
                  isOpened={!!maLoSelected && maLoSelected === m.id}
                  forceInitialAnimation={true}
                  onMeasure={({ height }) => {
                    if (height > 0) this.scrollToRow();
                  }}
                >
                  <BillingDetails
                    {...{
                      close: () => this.selectBar(null, null, null),
                      // @ts-ignore
                      billingId: barSelected ? barSelected.toString() : '',
                      // @ts-ignore
                      contractId: contractSelected ? contractSelected.toString() : '',
                      groupId,
                      history,
                    }}
                  />
                </DetailsWrapper>
              </div>
            </React.Fragment>
          ))}
          <Legend>
            <div className="title">
              <FormattedMessage id={`${prefix}.barsLegendTitle`} />
            </div>
            <div className="rw">
              <div />
              <div className="label">
                <div>
                  <FormattedMessage id={`${prefix}.barsLegendClosed`} />
                </div>
              </div>
              <div className="label">
                <div>
                  <FormattedMessage id={`${prefix}.barsLegendVoid`} />
                </div>
              </div>
              <div className="label">
                <div>
                  <FormattedMessage id={`${prefix}.barsLegendSettled`} />
                </div>
              </div>
              <div className="label">
                <div>
                  <FormattedMessage id={`${prefix}.barsLegendDelivered`} />
                </div>
              </div>
              <div className="label">
                <div>
                  <FormattedMessage id={`${prefix}.barsLegendQueued`} />
                </div>
              </div>
              <div className="label">
                <div>
                  <FormattedMessage id={`${prefix}.barsLegendDocumented`} />
                </div>
              </div>
              <div className="label">
                <div>
                  <FormattedMessage id={`${prefix}.barsLegendCalculated`} />
                </div>
              </div>
              <div className="label">
                <div>
                  <FormattedMessage id={`${prefix}.barsLegendOpen`} />
                </div>
              </div>
            </div>
            <div className="rw">
              <div className="label">
                <div>
                  <FormattedMessage id={`${prefix}.barsLegendPT`} />
                </div>
              </div>
              <div>
                <Bar {...{ width: 80, contractType: 'contract_localpool_power_taker', status: 'closed' }}>
                  <div className="bar-bg" />
                </Bar>
              </div>
              <div>
                <Bar {...{ width: 80, contractType: 'contract_localpool_power_taker', status: 'void' }}>
                  <div className="bar-bg" />
                </Bar>
              </div>
              <div>
                <Bar {...{ width: 80, contractType: 'contract_localpool_power_taker', status: 'settled' }}>
                  <div className="bar-bg" />
                </Bar>
              </div>
              <div>
                <Bar {...{ width: 80, contractType: 'contract_localpool_power_taker', status: 'delivered' }}>
                  <div className="bar-bg" />
                </Bar>
              </div>
              <div>
                <Bar {...{ width: 80, contractType: 'contract_localpool_power_taker', status: 'queued' }}>
                  <div className="bar-bg" />
                </Bar>
              </div>
              <div>
                <Bar {...{ width: 80, contractType: 'contract_localpool_power_taker', status: 'documented' }}>
                  <div className="bar-bg" />
                </Bar>
              </div>
              <div>
                <Bar {...{ width: 80, contractType: 'contract_localpool_power_taker', status: 'calculated' }}>
                  <div className="bar-bg" />
                </Bar>
              </div>
              <div>
                <Bar {...{ width: 80, contractType: 'contract_localpool_power_taker', status: 'open' }}>
                  <div className="bar-bg" />
                </Bar>
              </div>
            </div>
            <div className="rw">
              <div className="label">
                <div>
                  <FormattedMessage id={`${prefix}.barsLegendGAP`} />
                </div>
              </div>
              <div>
                <Bar {...{ width: 80, contractType: 'contract_localpool_gap', status: 'closed' }}>
                  <div className="bar-bg" />
                </Bar>
              </div>
              <div>
                <Bar {...{ width: 80, contractType: 'contract_localpool_gap', status: 'void' }}>
                  <div className="bar-bg" />
                </Bar>
              </div>
              <div>
                <Bar {...{ width: 80, contractType: 'contract_localpool_gap', status: 'settled' }}>
                  <div className="bar-bg" />
                </Bar>
              </div>
              <div>
                <Bar {...{ width: 80, contractType: 'contract_localpool_gap', status: 'delivered' }}>
                  <div className="bar-bg" />
                </Bar>
              </div>
              <div>
                <Bar {...{ width: 80, contractType: 'contract_localpool_gap', status: 'queued' }}>
                  <div className="bar-bg" />
                </Bar>
              </div>
              <div>
                <Bar {...{ width: 80, contractType: 'contract_localpool_gap', status: 'documented' }}>
                  <div className="bar-bg" />
                </Bar>
              </div>
              <div>
                <Bar {...{ width: 80, contractType: 'contract_localpool_gap', status: 'calculated' }}>
                  <div className="bar-bg" />
                </Bar>
              </div>
              <div>
                <Bar {...{ width: 80, contractType: 'contract_localpool_gap', status: 'open' }}>
                  <div className="bar-bg" />
                </Bar>
              </div>
            </div>
            <div className="rw">
              <div className="label">
                <div>
                  <FormattedMessage id={`${prefix}.barsLegendTP`} />
                </div>
              </div>
              <div>
                <Bar {...{ width: 80, status: 'closed', contractType: 'contract_localpool_third_party' }}>
                  <div className="bar-bg" />
                </Bar>
              </div>
              <div>-</div>
              <div>-</div>
              <div>-</div>
              <div>-</div>
              <div>-</div>
              <div>-</div>
              <div>-</div>
            </div>
          </Legend>
          {!!['open', 'calculated', 'documented'].find(s => !!Object.keys(statuses).find(k => k === s)) && (
            <MassChangeBlock>
              <h5>Change'em all:</h5>
              {!!statuses['open'] && (
                <button
                  className="btn btn-secondary"
                  onClick={() => this.hackStatus({ from: 'open', to: 'calculated' })}
                >
                  Open ➟ Calculated
                </button>
              )}
              {!!statuses['calculated'] && (
                <button
                  className="btn btn-secondary"
                  onClick={() => this.hackStatus({ from: 'calculated', to: 'documented' })}
                >
                  Calculated ➟ Documented
                </button>
              )}
              {!!statuses['documented'] && (
                <button
                  className="btn btn-secondary"
                  onClick={() => this.hackStatus({ from: 'documented', to: 'documented' })}
                >
                  Documented ➟ Documented
                </button>
              )}
              {!!statuses['documented'] && (
                <button
                  className="btn btn-secondary"
                  onClick={() => this.hackStatus({ from: 'documented', to: 'queued' })}
                >
                  Documented ➟ Queued
                </button>
              )}
            </MassChangeBlock>
          )}
          <MassChangeBlock>
            <h5>Load'em all:</h5>
            <button
              className="btn btn-secondary"
              onClick={() => getBillingCycleZip({
                groupId,
                billingCycleId,
                groupName,
                year: moment(billingCycle.lastDate).format('YYYY'),
              })
              }
            >
              Load all documents
            </button>
          </MassChangeBlock>
          {(Object.keys(statuses).length > 1
            || (Object.keys(statuses).length && Object.keys(statuses)[0] !== 'void')) && (
            <MassChangeBlock>
              <h5>Kill'em all:</h5>
              <button className="btn btn-danger" onClick={this.switchKill}>
                Void all
              </button>
              {killSwitch && (
                <div className="kill-block">
                  <FormGroup className="has-danger">
                    {!!killErr && <div className="inline-error">{killErr}</div>}
                    <input
                      type="text"
                      className="form-control form-control-danger"
                      placeholder={killPhrase}
                      value={killValidation}
                      onChange={this.setKill}
                    />
                  </FormGroup>
                  <button className="btn btn-outline-danger" onClick={this.killEmAll}>
                    VOID
                  </button>
                </div>
              )}
            </MassChangeBlock>
          )}
        </CenterContent>
      </React.Fragment>
    );
  }
}

interface StatePart {
  groups: { group: any };
  billingCycles: {
    billingCycle: { _status: null | number; [key: string]: any };
    loadingBillingCycle: boolean;
    billingCycleBars: { _status: null | number; array: Array<any> };
  };
}

interface BillingDataState {
  maLoSortAsc: boolean;
  maLoSelected: null | string;
  barSelected: null | number;
  contractSelected: null | number;
  hackLoading: boolean;
  killSwitch: boolean;
  killValidation: string;
  killErr: string;
  statuses: { [key: string]: number };
}

interface ExtProps {
  url: string;
  billingCycleId: string;
  groupId: string;
  history: any;
}

interface StateProps {
  groupName: string;
  billingCycle: { _status: null | number; [key: string]: any };
  billingCycleBars: { _status: null | number; array: Array<any> };
  loading: boolean;
}

interface DispatchProps {
  loadBillingCycle: Function;
  setBillingCycle: Function;
  getBillingCycleZip: Function;
  loadGroup: Function;
  updateBilling: Function;
}

function mapStateToProps(state: StatePart) {
  return {
    groupName: state.groups.group.name,
    billingCycle: state.billingCycles.billingCycle,
    billingCycleBars: state.billingCycles.billingCycleBars,
    loading: state.billingCycles.loadingBillingCycle,
  };
}

export default connect<StateProps, DispatchProps, ExtProps>(
  mapStateToProps,
  {
    loadBillingCycle: BillingCycles.actions.loadBillingCycle,
    setBillingCycle: BillingCycles.actions.setBillingCycle,
    getBillingCycleZip: BillingCycles.actions.getBillingCycleZip,
    loadGroup: Groups.actions.loadGroup,
    updateBilling: Billings.actions.updateBilling,
  },
)(injectIntl(BillingData));
