import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { UncontrolledTooltip } from 'reactstrap';
import Moment from 'moment';
import orderBy from 'lodash/orderBy';
import reduce from 'lodash/reduce';
import { extendMoment } from 'moment-range';
import Groups from 'groups';
import BillingCycles from 'billing_cycles';
import PageTitle from 'components/page_title';
import { CenterContent } from 'components/style';
import Loading from 'components/loading';
import { BreadcrumbsProps } from 'components/breadcrumbs';
import { MaLoListHeader, MaLoRow, Brick, Legend } from './style';

const d3 = require('d3');

const moment = extendMoment(Moment);

class BillingData extends React.Component<
  ExtProps & StateProps & DispatchProps & BreadcrumbsProps & InjectedIntlProps,
  BillingDataState
  > {
  state = { maLoSortAsc: true };

  componentDidMount() {
    const { billingCycleId, groupId, loadBillingCycle, loadGroup } = this.props;
    loadGroup(groupId);
    loadBillingCycle({ billingCycleId, groupId });
  }

  switchMaLoSort = () => {
    this.setState({ maLoSortAsc: !this.state.maLoSortAsc });
  };

  render() {
    const { billingCycle, billingCycleBricks, breadcrumbs, url, loading, groupId, groupName, intl } = this.props;
    const { maLoSortAsc } = this.state;

    if (loading || billingCycle._status === null) return <Loading minHeight={40} />;
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
        cycleMonths[Math.floor(cycleMonths.length / 4 * 2)].format(labelFormat),
        cycleMonths[Math.floor(cycleMonths.length / 4 * 3)].format(labelFormat),
        cycleMonths[cycleMonths.length - 1].format(labelFormat),
      ];
    }

    const brickScale = d3
      .scaleTime()
      .domain([cycleBegin, cycleEnd])
      .range([0, 100]);

    const ticks = [0].concat(d3
      .scaleTime()
      .domain([cycleBegin, cycleEnd])
      .ticks(d3.timeMonth)
      .map(t => brickScale(t)));

    return (
      <React.Fragment>
        <PageTitle
          {...{
            breadcrumbs: breadcrumbs.concat([
              { id: 1, link: `/groups/${groupId}`, title: groupName },
              { id: 2, link: url, title: intl.formatMessage({ id: 'admin.breadcumbs.billingCycles' }) },
              { id: '-----', title: billingCycle.name },
            ]),
            title: billingCycle.name,
            url,
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
                <div className="begin">
                  {moment(cycleBegin).format('DD.MM.YYYY')} <i className="fa fa-calendar" />
                </div>
                <div className="end">
                  <i className="fa fa-calendar" /> {moment(billingCycle.lastDate).format('DD.MM.YYYY')}
                </div>
              </div>
              <div className="months">
                {ticks.map(t => <div key={t} className="grid-line" style={{ left: `${t}%` }} />)}
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
          {orderBy(billingCycleBricks.array, 'name', maLoSortAsc ? 'asc' : 'desc').map(m => (
            <MaLoRow key={m.id} {...{ ticks }}>
              <div className="name">
                <div>
                  <Link
                    to={`${url
                      .split('/')
                      .slice(0, -1)
                      .join('/')}/system/market-locations/${m.id}`}
                  >
                    {m.name}
                  </Link>
                </div>
              </div>
              <div className="bricks">
                {ticks.map(t => <div key={t} className="grid-line" style={{ left: `${t}%` }} />)}
                {m.bricks.array.map((b, i) => {
                  const beginDate = new Date(b.beginDate);
                  const endDate = new Date(b.endDate);
                  const fixedBeginDate =
                    beginDate < cycleBegin ? cycleBegin : beginDate > cycleEnd ? cycleEnd : beginDate;
                  const fixedEndDate = endDate > cycleEnd ? cycleEnd : endDate;
                  const bricks: Array<JSX.Element> = [];
                  if (i === 0 && fixedBeginDate > cycleBegin) {
                    bricks.push(<Brick key={0} {...{ width: brickScale(fixedBeginDate), transparent: true }} />);
                  }
                  bricks.push(<Brick
                      key={b.beginDate}
                      {...{
                        width: brickScale(fixedEndDate) - brickScale(fixedBeginDate),
                        status: b.status,
                        contractType: b.contractType,
                      }}
                    >
                      <div className="brick-bg">
                        <div />
                        <div className="info">
                          <b>{!!b.priceCents && `${(b.priceCents / 100).toFixed(0)} €`}</b>&nbsp;&nbsp;{!!b.consumedEnergyKwh &&
                            `${b.consumedEnergyKwh} kWh`}
                        </div>
                        <div className="error">
                          {!!b.errors && (
                            <React.Fragment>
                              <i id={`err-tip-${m.id}-${i}`} className="fa fa-exclamation-triangle" />
                              <UncontrolledTooltip placement="bottom" target={`err-tip-${m.id}-${i}`} delay={200}>
                                {reduce(b.errors, (message, errArr) => `${message}${errArr.join(', ')}, `, '').slice(
                                  0,
                                  -2,
                                )}
                              </UncontrolledTooltip>
                            </React.Fragment>
                          )}
                        </div>
                      </div>
                    </Brick>);
                  return bricks;
                })}
              </div>
            </MaLoRow>
          ))}
          <Legend>
            <div className="title">
              <FormattedMessage id={`${prefix}.bricksLegendTitle`} />
            </div>
            <div className="rw">
              <div />
              <div className="label">
                <div>
                  <FormattedMessage id={`${prefix}.bricksLegendClosed`} />
                </div>
              </div>
              <div className="label">
                <div>
                  <FormattedMessage id={`${prefix}.bricksLegendOpen`} />
                </div>
              </div>
            </div>
            <div className="rw">
              <div className="label">
                <div>
                  <FormattedMessage id={`${prefix}.bricksLegendPT`} />
                </div>
              </div>
              <div>
                <Brick {...{ width: 80, contractType: 'power_taker', status: 'closed' }}>
                  <div className="brick-bg" />
                </Brick>
              </div>
              <div>
                <Brick {...{ width: 80, contractType: 'power_taker', status: 'open' }}>
                  <div className="brick-bg" />
                </Brick>
              </div>
            </div>
            <div className="rw">
              <div className="label">
                <div>
                  <FormattedMessage id={`${prefix}.bricksLegendGAP`} />
                </div>
              </div>
              <div>
                <Brick {...{ width: 80, contractType: 'gap', status: 'closed' }}>
                  <div className="brick-bg" />
                </Brick>
              </div>
              <div>
                <Brick {...{ width: 80, contractType: 'gap', status: 'open' }}>
                  <div className="brick-bg" />
                </Brick>
              </div>
            </div>
            <div className="rw">
              <div className="label">
                <div>
                  <FormattedMessage id={`${prefix}.bricksLegendTP`} />
                </div>
              </div>
              <div>
                <Brick {...{ width: 80, status: 'closed', contractType: 'third_party' }}>
                  <div className="brick-bg" />
                </Brick>
              </div>
              <div>-</div>
            </div>
          </Legend>
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
    billingCycleBricks: { _status: null | number; array: Array<any> };
  };
}

interface BillingDataState {
  maLoSortAsc: boolean;
}

interface ExtProps {
  url: string;
  billingCycleId: string;
  groupId: string;
}

interface StateProps {
  groupName: string;
  billingCycle: { _status: null | number; [key: string]: any };
  billingCycleBricks: { _status: null | number; array: Array<any> };
  loading: boolean;
}

interface DispatchProps {
  loadBillingCycle: Function;
  setBillingCycle: Function;
  loadGroup: Function;
}

function mapStateToProps(state: StatePart) {
  return {
    groupName: state.groups.group.name,
    billingCycle: state.billingCycles.billingCycle,
    billingCycleBricks: state.billingCycles.billingCycleBricks,
    loading: state.billingCycles.loadingBillingCycle,
  };
}

export default connect<StateProps, DispatchProps, ExtProps>(mapStateToProps, {
  loadBillingCycle: BillingCycles.actions.loadBillingCycle,
  setBillingCycle: BillingCycles.actions.setBillingCycle,
  loadGroup: Groups.actions.loadGroup,
})(injectIntl(BillingData));
