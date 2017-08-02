import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import Groups from 'groups';
import Contracts from 'contracts';
import Breadcrumbs from 'components/breadcrumbs';

import './style.scss';

export class PowertakerOverview extends Component {
  static propTypes = {
    contract: PropTypes.object,
    group: PropTypes.object,
    loadingGroup: PropTypes.bool.isRequired,
    loadingContract: PropTypes.bool.isRequired,
    loadGroup: PropTypes.func.isRequired,
    loadContract: PropTypes.func.isRequired,
  };

  static defaultProps = {
    contract: {},
    group: {},
  };

  componentWillMount() {
    const { loadingGroup, group, loadGroup, contract, loadContract, match: { params: { groupId, contractId } } } = this.props;
    if (!loadingGroup && !group.id) loadGroup(groupId);
    if (contract.id !== contractId) loadContract({ contractId, groupId });
  }

  render() {
    const {
      loadingGroup,
      loadingContract,
      group,
      contract,
      match: {
        params: { contractId },
        url,
      },
    } = this.props;

    if (loadingContract || loadingGroup || !group.id || !contract.id) return (<div>Loading...</div>);

    const { customer, payments, tariffs } = contract;
    const customerTitle = customer.type === 'person' ? `${customer.firstName} ${customer.lastName}` : customer.name;
    const payment = payments.array.sort((a, b) => (new Date(b.beginDate)).valueOf() - (new Date(a.beginDate)).valueOf())[0] || {};
    const tariff = tariffs.array.sort((a, b) => (new Date(b.beginDate)).valueOf() - (new Date(a.beginDate)).valueOf())[0] || {};

    const breadcrumbs = [
      { id: group.id, link: `/localpools/${group.id}/powertakers`, title: group.name },
      { id: contractId, title: customerTitle },
    ];

    return (
      <div>
        <Helmet title="Powertaker" />
        <Breadcrumbs breadcrumbs={ breadcrumbs }/>
        <div className="row powertaker-overview top-content">
          <div className="col-12">
            <div className="title bg-wind-dark">
              { customer.image && <img className="top-avatar" src={ customer.image } /> }
              { customerTitle }
            </div>
          </div>
          <div className="col-6">
            <div className="row">
              <div className="col-3"><FormattedMessage id="admin.contracts.register"/>:</div>
              <div className="col-9"></div>
            </div>
            <div className="row">
              <div className="col-3"><FormattedMessage id="admin.persons.phone"/>:</div>
              <div className="col-9">{ customer.phone }</div>
            </div>
            <div className="row">
              <div className="col-3"><FormattedMessage id="admin.persons.email"/>:</div>
              <div className="col-9">{ customer.email }</div>
            </div>
            <div className="row">
              <div className="col-3"><FormattedMessage id="admin.contracts.status"/>:</div>
              <div className="col-9">{ contract.status }</div>
            </div>
          </div>
          <div className="col-6">
            <div className="row">
              <div className="col-3"><FormattedMessage id="admin.tariffs.pricing"/>:</div>
              <div className="col-6"><Link to={ `${url}/tariffs/${tariff.id}` }>{ tariff.name }</Link></div>
            </div>
            <div className="row">
              <div className="col-3"><FormattedMessage id="admin.contracts.forecastWattHour"/>:</div>
              <div className="col-6"></div>
            </div>
            <div className="row">
              <div className="col-3"><FormattedMessage id="admin.payments.payment"/>:</div>
              <div className="col-6">{ `${payment.priceCents / 100}€ / ${payment.cycle}` }</div>
            </div>
            <div className="row">
              <div className="col-3"><FormattedMessage id="admin.contracts.beginDate"/>:</div>
              <div className="col-6">{ contract.beginDate }</div>
            </div>
            <div className="row">
              <div className="col-3"><FormattedMessage id="admin.persons.lastLogin"/>:</div>
              <div className="col-6">{ customer.lastLogin || 'Invite button here' }</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    group: state.groups.group,
    loadingGroup: state.groups.loadingGroup,
    contract: state.contracts.contract,
    loadingContract: state.contracts.loadingContract,
  };
}

export default connect(mapStateToProps, {
  loadGroup: Groups.actions.loadGroup,
  loadContract: Contracts.actions.loadContract,
})(PowertakerOverview);
