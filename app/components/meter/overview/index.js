import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Groups from 'groups';
import Meters from 'meters';
import Breadcrumbs from 'components/breadcrumbs';

import './style.scss';

export class MeterOverview extends Component {
  static propTypes = {
    group: React.PropTypes.object.isRequired,
    meter: React.PropTypes.object.isRequired,
    loading: React.PropTypes.bool.isRequired,
    loadGroup: React.PropTypes.func.isRequired,
    loadMeter: React.PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { loadMeter, loadGroup, group, match: { params: { meterId, groupId } } } = this.props;
    loadMeter(meterId);
    if (!group.id) loadGroup(groupId);
  }

  render() {
    const { loading, group, meter } = this.props;

    if (meter.status === 404) return (<div>Meter not found</div>);

    if (loading || !group.id || !meter.id) return (<div>Loading...</div>);

    const breadcrumbs = [
      { id: group.id, link: `/localpools/${group.id}/system`, title: group.attributes.name },
      { id: meter.id, title: meter.attributes.manufacturerProductSerialnumber },
    ];

    return (
      <div>
        <Helmet title="Meter" />
        <Breadcrumbs breadcrumbs={ breadcrumbs }/>
        <div className="row meter-overview top-content">
          <div className="col-12">
            <div className="title">{ meter.attributes.manufacturerProductSerialnumber }</div>
          </div>
          <div className="col-6 left-col"></div>
          <div className="col-6 right-col"></div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    group: state.groups.group,
    meter: state.meters.meter,
    loading: state.groups.loadingGroup || state.meters.loadingMeter,
  };
}

export default connect(mapStateToProps, {
  loadGroup: Groups.actions.loadGroup,
  loadMeter: Meters.actions.loadMeter,
})(MeterOverview);
