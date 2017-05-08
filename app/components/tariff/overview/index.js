import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import find from 'lodash/find';
import Helmet from 'react-helmet';
import Contracts from 'contracts';
import Groups from 'groups';
import Breadcrumbs from 'components/breadcrumbs';

import './style.scss';

export class TariffOverview extends Component {
  static propTypes = {
    contract: PropTypes.object.isRequired,
    group: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    loadContract: PropTypes.func.isRequired,
    loadGroup: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { loadContract, loadGroup, group, contract, match: { params: { contractId, groupId } } } = this.props;
    if (!contract.id) loadContract(contractId);
    if (!group.id) loadGroup(groupId);
  }

  render() {
    const { loading, group, contract, match: { params: { tariffId } } } = this.props;

    if (loading || !contract.id || !group.id) return (<div>Loading...</div>);
    if (!contract.relationships || !contract.relationships.tariffs) return (<div>Tariff not found</div>);

    const tariff = find(contract.relationships.tariffs.data, t => t.id === tariffId);
    if (!tariff) return (<div>Tariff not found</div>);

    const formatDate = (date) => {
      if (!date) return 'none';
      return moment(date).format('DD.MM.YYYY');
    };

    const contractShortName = (cont) => {
      switch (cont.type) {
        case 'contract_metering_point_operator':
          return `MPO ${cont.contractNumber}`;
        case 'contract_localpool_processing':
          return `LCPP ${cont.contractNumber}`;
        default:
          return `${cont.contractNumber}`;
      }
    };

    const breadcrumbs = [
      { id: group.id, link: `/localpools/${group.id}/contracts`, title: group.name },
      { id: contract.id, link: `/localpools/${group.id}/contracts/${contract.id}/tariffs`, title: contractShortName(contract) },
      { id: tariff.id, title: tariff.name },
    ];

    return (
      <div>
        <Helmet title="Tariff" />
        <Breadcrumbs breadcrumbs={ breadcrumbs }/>
        <div className="row tariff-overview top-content">
          <div className="col-12">
            <div className="title">
              { tariff.name }
            </div>
          </div>
          <div className="col-12 padding-top"><h5 className="label">Tariff Data</h5></div>
          <div className="col-6 padding-bottom">
            <div className="row">
              <div className="col-3"><span className="label">Name:</span></div>
              <div className="col-9">{ tariff.name }</div>
            </div>
            <div className="row">
              <div className="col-3"><span className="label">Begin:</span></div>
              <div className="col-9">{ formatDate(tariff.beginDate) }</div>
            </div>
            <div className="row">
              <div className="col-3"><span className="label">End:</span></div>
              <div className="col-9">{ formatDate(tariff.endDate) }</div>
            </div>
          </div>
          <div className="col-6 padding-bottom">
            <div className="row">
              <div className="col-5"><span className="label">Energy price (per kWh):</span></div>
              <div className="col-7">{ `${tariff.energypriceCentsPerKwh} cts` }</div>
            </div>
            <div className="row">
              <div className="col-5"><span className="label">Base price (per month)</span></div>
              <div className="col-7">{ `${tariff.basepriceCentsPerMonth / 100} €` }</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    contract: state.contracts.contract,
    group: state.groups.group,
    loading: state.contracts.loadingContract,
  };
}

export default connect(mapStateToProps, {
  loadContract: Contracts.actions.loadContract,
  loadGroup: Groups.actions.loadGroup,
})(TariffOverview);
