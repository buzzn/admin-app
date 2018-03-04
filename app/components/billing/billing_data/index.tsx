import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import BillingCycles from 'billing_cycles';
import PageTitle from 'components/page_title';
import { CenterContent } from 'components/style';
import Loading from 'components/loading';

const d3 = require('d3');

const moment = extendMoment(Moment);

class BillingData extends React.Component {
  componentDidMount() {
    const { billingCycleId, groupId, loadBillingCycle } = this.props;
    loadBillingCycle({ billingCycleId, groupId });
  }

  render() {
    const { billingCycle, billingCycleBricks, breadcrumbs, url, loading } = this.props;

    if (loading || billingCycle._status === null) return <Loading minHeight={40} />;
    if (billingCycle._status && billingCycle._status !== 200) return <Redirect to={url} />;

    const cycleBegin = new Date(billingCycle.beginDate);
    const cycleEnd = new Date(billingCycle.lastDate);
    const cycleMonths = Array.from(moment.range(cycleBegin, cycleEnd).by('month'));
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
          <div style={{ width: '100%', height: '57px', display: 'flex' }}>
            <div style={{ width: '20%' }}>MaLo title</div>
            <div style={{ display: 'flex', flexDirection: 'column', width: '80%' }}>
              <div style={{ height: '50%' }}>
                {moment(cycleBegin).format('DD.MM.YYYY')} - {moment(cycleEnd).format('DD.MM.YYYY')}
              </div>
              <div
                style={{
                  display: 'flex',
                  height: '50%',
                  backgroundSize: '8.333% 100%',
                  backgroundImage: `repeating-linear-gradient(
                  to right,
                  #e0e0e0,
                  #e0e0e0 1px,
                  transparent 1px,
                  transparent 100%
                )`,
                }}
              >
                <div style={{ width: '25%' }}>{labels[0]}</div>
                <div style={{ width: '25%' }}>{labels[1]}</div>
                <div style={{ width: '25%' }}>{labels[2]}</div>
                <div style={{ width: '25%' }}>
                  {labels[3]} {labels[4]}
                </div>
              </div>
            </div>
          </div>
          {billingCycleBricks.array.map(m => (
            <div style={{ width: '100%', height: '57px', display: 'flex' }}>
              <div style={{ width: '20%' }}>{m.name}</div>
              <div
                style={{
                  display: 'flex',
                  width: '80%',
                  height: '100%',
                  backgroundSize: '8.333% 100%',
                  backgroundImage: `repeating-linear-gradient(
                  to right,
                  #e0e0e0,
                  #e0e0e0 1px,
                  transparent 1px,
                  transparent 100%
                )`,
                }}
              >
                {m.bricks.array.map((b, i) => {
                  const beginDate = new Date(b.beginDate);
                  const endDate = new Date(b.endDate);
                  const fixedBeginDate = beginDate < cycleBegin ? cycleBegin : beginDate;
                  const fixedEndDate = endDate < cycleEnd ? cycleEnd : endDate;
                  const bricks = [];
                  if (i === 0 && fixedBeginDate > cycleBegin) bricks.push(<div key={0} style={{ backgroundColor: 'transparent', width: `${brickScale(fixedBeginDate)}%`, height: '80%' }} />);
                  const brickStyle = { backgroundColor: b.status === 'open' ? 'rgba(0,188,212,0.25)' : 'rgba(175,175,175,0.5)', width: `${brickScale(fixedEndDate) - brickScale(fixedBeginDate)}%`, height: '80%', borderLeft: '2px solid black', borderRight: '2px solid black' };
                  if (b.contractType === 'gap') brickStyle.backgroundImage = `repeating-linear-gradient(45deg, transparent, transparent 14px, rgba(175,175,175,0.75) 4px, rgba(175,175,175,0.75) 18px)`;
                  bricks.push(<div key={1} style={brickStyle} />);
                  return bricks;
          })}
              </div>
            </div>
          ))}
        </CenterContent>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    billingCycle: state.billingCycles.billingCycle,
    billingCycleBricks: state.billingCycles.billingCycleBricks,
    loading: state.billingCycles.loadingBillingCycle,
  };
}

export default connect(mapStateToProps, {
  loadBillingCycle: BillingCycles.actions.loadBillingCycle,
  setBillingCycle: BillingCycles.actions.setBillingCycle,
})(BillingData);
