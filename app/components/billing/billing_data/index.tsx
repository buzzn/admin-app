import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import Moment from 'moment';
import orderBy from 'lodash/orderBy';
import { extendMoment } from 'moment-range';
import BillingCycles from 'billing_cycles';
import PageTitle from 'components/page_title';
import { CenterContent } from 'components/style';
import Loading from 'components/loading';
import { BreadcrumbsProps } from 'components/breadcrumbs';
import { MaLoListHeader, MaLoRow, Brick, Legend } from './style';

const d3 = require('d3');

const moment = extendMoment(Moment);

class BillingData extends React.Component<ExtProps & StateProps & DispatchProps & BreadcrumbsProps, BillingDataState> {
  state = { maLoSortAsc: true };

  componentDidMount() {
    const { billingCycleId, groupId, loadBillingCycle } = this.props;
    loadBillingCycle({ billingCycleId, groupId });
  }

  switchMaLoSort = () => {
    this.setState({ maLoSortAsc: !this.state.maLoSortAsc });
  };

  render() {
    const { billingCycle, billingCycleBricks, breadcrumbs, url, loading } = this.props;
    const { maLoSortAsc } = this.state;

    if (loading || billingCycle._status === null) return <Loading minHeight={40} />;
    if (billingCycle._status && billingCycle._status !== 200) return <Redirect to={url} />;

    const cycleBegin = new Date(billingCycle.beginDate);
    const cycleEnd = new Date(billingCycle.lastDate);
    // FIXME: proper moment-range typings will be in 3.2.0 or 4.0.0
    const cycleMonths: Array<any> = Array.from(moment.range(cycleBegin, cycleEnd).by('month'));
    const labelFormat = cycleMonths.length > 12 ? 'MMM YY' : 'MMM';
    const labels = [
      cycleMonths[0].format(labelFormat),
      cycleMonths[Math.floor(cycleMonths.length / 4)].format(labelFormat),
      cycleMonths[Math.floor(cycleMonths.length / 4 * 2)].format(labelFormat),
      cycleMonths[Math.floor(cycleMonths.length / 4 * 3)].format(labelFormat),
      cycleMonths[cycleMonths.length - 1].format(labelFormat),
    ];
    const brickScale = d3
      .scaleTime()
      .domain([cycleBegin, cycleEnd])
      .range([0, 100]);

    return (
      <React.Fragment>
        <PageTitle
          {...{
            breadcrumbs: breadcrumbs.concat([
              // { id: 1, link: `/groups/${groupId}`, title: groupName },
              { id: '-----', title: billingCycle.name },
            ]),
            title: billingCycle.name,
          }}
        />
        <CenterContent>
          <MaLoListHeader>
            <div className="name">
              <div onClick={this.switchMaLoSort}>MaLo title</div>
            </div>
            <div className="labels">
              <div className="dates">
                <div className="begin">
                  {moment(cycleBegin).format('DD.MM.YYYY')} <i className="fa fa-calendar" />
                </div>
                <div className="end">
                  <i className="fa fa-calendar" /> {moment(cycleEnd).format('DD.MM.YYYY')}
                </div>
              </div>
              <div className="months">
                <div className="month">{labels[0]}</div>
                <div className="month">{labels[1]}</div>
                <div className="month">{labels[2]}</div>
                <div className="month">
                  <div>{labels[3]}</div>
                  <div>{labels[4]}</div>
                </div>
              </div>
            </div>
          </MaLoListHeader>
          {orderBy(billingCycleBricks.array, 'name', maLoSortAsc ? 'asc' : 'desc').map(m => (
            <MaLoRow key={m.id}>
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
                {m.bricks.array.map((b, i) => {
                  const beginDate = new Date(b.beginDate);
                  const endDate = new Date(b.endDate);
                  const fixedBeginDate = beginDate < cycleBegin ? cycleBegin : beginDate;
                  const fixedEndDate = endDate < cycleEnd ? cycleEnd : endDate;
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
                    />);
                  return bricks;
                })}
              </div>
            </MaLoRow>
          ))}
          <Legend>
            <div className="title">Legend</div>
            <div className="rw">
              <div />
              <div>ABG</div>
              <div>REC</div>
            </div>
            <div className="rw">
              <div>SN</div>
              <div>
                <Brick {...{ width: 80, status: 'closed' }} />
              </div>
              <div>
                <Brick {...{ width: 80, status: 'open' }} />
              </div>
            </div>
            <div className="rw">
              <div>LU</div>
              <div>
                <Brick {...{ width: 80, status: 'closed' }} />
              </div>
              <div>
                <Brick {...{ width: 80, status: 'open' }} />
              </div>
            </div>
            <div className="rw">
              <div>DR</div>
              <div>
                <Brick {...{ width: 80, status: 'closed', contractType: 'gap' }} />
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
  billingCycle: { _status: null | number; [key: string]: any };
  billingCycleBricks: { _status: null | number; array: Array<any> };
  loading: boolean;
}

interface DispatchProps {
  loadBillingCycle: Function;
  setBillingCycle: Function;
}

function mapStateToProps(state: StatePart) {
  return {
    billingCycle: state.billingCycles.billingCycle,
    billingCycleBricks: state.billingCycles.billingCycleBricks,
    loading: state.billingCycles.loadingBillingCycle,
  };
}

export default connect<StateProps, DispatchProps, ExtProps>(mapStateToProps, {
  loadBillingCycle: BillingCycles.actions.loadBillingCycle,
  setBillingCycle: BillingCycles.actions.setBillingCycle,
})(BillingData);
