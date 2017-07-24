import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Groups from 'groups';
import Contracts from 'contracts';
import Breadcrumbs from 'components/breadcrumbs';

import './style.scss';

export class PowertakerOverview extends Component {
  static propTypes = {
    groupPowertaker: PropTypes.object,
    group: PropTypes.object,
    loadingGroup: PropTypes.bool.isRequired,
    loadingGroupPowertaker: PropTypes.bool.isRequired,
    loadGroup: PropTypes.func.isRequired,
    loadGroupPowertaker: PropTypes.func.isRequired,
  };

  static defaultProps = {
    groupPowertaker: {},
    group: {},
  };

  componentWillMount() {
    const { loadingGroup, group, loadGroup, groupPowertaker, loadGroupPowertaker, match: { params: { groupId, powertakerId, powertakerType } } } = this.props;
    if (!loadingGroup && !group.id) loadGroup(groupId);
    if (groupPowertaker.id !== powertakerId) loadGroupPowertaker({ powertakerId, groupId, powertakerType });
  }

  render() {
    const {
      loadingGroup,
      loadingGroupPowertaker,
      group,
      groupPowertaker,
      match: { params: { powertakerId } },
    } = this.props;

    if (loadingGroupPowertaker || loadingGroup || !group.id) return (<div>Loading...</div>);

    const powertakerTitle = groupPowertaker.type === 'person' ? `${groupPowertaker.firstName} ${groupPowertaker.lastName}` : groupPowertaker.name;

    const breadcrumbs = [
      { id: group.id, link: `/localpools/${group.id}/powertakers`, title: group.name },
      { id: powertakerId, title: powertakerTitle },
    ];

    return (
      <div>
        <Helmet title="Powertaker" />
        <Breadcrumbs breadcrumbs={ breadcrumbs }/>
        <div className="row powertaker-overview top-content">
          <div className="col-12">
            <div className="title bg-wind-dark">
              { groupPowertaker.image && <img className="top-avatar" src={ groupPowertaker.image } /> }
              { powertakerTitle }
            </div>
          </div>
          <div className="col-6">
            <div className="row">
              <div className="col-12">Address here</div>
            </div>
            <div className="row">
              <div className="col-3"><b>Status:</b></div>
              <div className="col-9"></div>
            </div>
          </div>
          <div className="col-6">Bank</div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    group: state.groups.group,
    loadingGroup: state.groups.loadingGroup,
    groupPowertaker: state.contracts.groupPowertaker,
    loadingGroupPowertaker: state.contracts.loadingGroupPowertaker,
  };
}

export default connect(mapStateToProps, {
  loadGroup: Groups.actions.loadGroup,
  loadGroupPowertaker: Contracts.actions.loadGroupPowertaker,
})(PowertakerOverview);
