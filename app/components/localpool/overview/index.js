import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Bubbles from '@buzzn/module_bubbles';
import Groups from 'groups';
import Contracts from 'contracts';
import BubblesLayout from './bubbles_layout';

import './style.scss';

export class LocalpoolOverview extends Component {
  static propTypes = {
    group: PropTypes.object.isRequired,
    contracts: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    loadGroup: PropTypes.func.isRequired,
    loadBubbles: PropTypes.func.isRequired,
    stopBubbles: PropTypes.func.isRequired,
    loadGroupContracts: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { loadGroup, loadGroupContracts, loadBubbles, match: { params: { groupId } } } = this.props;
    loadGroup(groupId);
    loadGroupContracts(groupId);
    loadBubbles(groupId);
  }

  componentWillReceiveProps(nextProps) {
    const { loadGroup, loadGroupContracts, loadBubbles, match: { params: { groupId } } } = this.props;
    const { match: { params: { groupId: newGroupId } } } = nextProps;
    if (groupId !== newGroupId) {
      loadGroup(newGroupId);
      loadGroupContracts(newGroupId);
      loadBubbles(newGroupId);
    }
  }

  componentWillUnmount() {
    this.props.stopBubbles();
  }

  render() {
    const { group, loading, contracts } = this.props;

    if (group.status === 404) return (<div>Group not found</div>);

    if (loading || !group.id) return (<div>Loading...</div>);

    const mpoContract = contracts.find(c => c.type === 'contract_metering_point_operator');

    return (
      <div>
        <Helmet title="Localpool" />
        <div className="overview-header">Localpool</div>
        <div className="row group-overview top-content">
          <div className="col-12"><div className="title bg-production-dark">{ group.name }</div></div>
          {
            mpoContract ?
              <div className="col-6 left-col">
                <div className="row">
                  <div className="col-12">{ !!mpoContract.customer.address && mpoContract.customer.address.street }</div>
                </div>
                <div className="row">
                  <div className="col-12">{ !!mpoContract.customer.address && `${mpoContract.customer.address.zip} ${mpoContract.customer.address.city}` }</div>
                </div>
                <div className="row">
                  <div className="col-3"><span className="label">Customer:</span></div>
                  <div className="col-9">{ mpoContract.customer.name }</div>
                </div>
                <div className="row">
                  <div className="col-3"><span className="label">Contact:</span></div>
                  <div className="col-9">{ `${mpoContract.customer.contact.firstName} ${mpoContract.customer.contact.lastName}` }</div>
                </div>
              </div> :
              <div className="col-6 left-col"></div>
          }
          <div className="col-6 right-col"><Bubbles.container Layout={ BubblesLayout } /></div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    group: state.groups.group,
    loading: state.groups.loadingGroup || state.contracts.loadingGroupContracts,
    contracts: state.contracts.groupContracts,
  };
}

export default connect(mapStateToProps, {
  loadGroup: Groups.actions.loadGroup,
  loadBubbles: Bubbles.actions.setGroupId,
  stopBubbles: Bubbles.actions.stopRequests,
  loadGroupContracts: Contracts.actions.loadGroupContracts,
})(LocalpoolOverview);
