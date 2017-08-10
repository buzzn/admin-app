import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { injectIntl, FormattedMessage } from 'react-intl';
import { tableParts } from 'react_table_config';
import Contracts from 'contracts';

export class ContractsList extends Component {
  static propTypes = {
    loadGroupContracts: PropTypes.func.isRequired,
    groupId: PropTypes.string.isRequired,
    contracts: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    contracts: [],
  };

  componentWillMount() {
    const { loadGroupContracts, groupId } = this.props;
    loadGroupContracts(groupId);
  }

  render() {
    const { contracts, loading, groupId, intl } = this.props;

    if (loading) return (<div>Loading...</div>);

    const data = contracts.filter(c => !!c.id).map(c => ({
      ...c,
      type: intl.formatMessage({ id: `admin.contracts.${c.type}` }),
      status: c.status,
      since: c.signingDate,
      number: c.fullContractNumber,
      link: `/localpools/${groupId}/contracts/${c.id}`,
    }));

    const columns = [
      {
        Header: intl.formatMessage({ id: 'admin.contracts.tableType' }),
        accessor: 'type',
        minWidth: 200,
      },
      {
        Header: intl.formatMessage({ id: 'admin.contracts.tableStatus' }),
        accessor: 'status',
        minWidth: 200,
      },
      {
        Header: intl.formatMessage({ id: 'admin.contracts.tableSince' }),
        accessor: 'since',
        minWidth: 100,
      },
      {
        Header: intl.formatMessage({ id: 'admin.contracts.tableNumber' }),
        accessor: 'number',
        minWidth: 200,
      },
      {
        Header: '',
        accessor: 'link',
        sortable: false,
        filterable: false,
        resizable: false,
        width: 100,
        Cell: tableParts.components.linkCell,
      },
    ];

    return (
      <div className="row">
        <div className="col-12">
          <h5><FormattedMessage id="admin.contracts.headerGroupContracts"/></h5>
          <FormattedMessage id="admin.contracts.descriptionGroupContracts"/>
        </div>
        <div className="col-12 no-padding">
          <ReactTable {...{ data, columns }} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    contracts: state.contracts.groupContracts,
    loading: state.contracts.loadingGroupContracts,
  };
}

export default connect(mapStateToProps, {
  loadGroupContracts: Contracts.actions.loadGroupContracts,
})(injectIntl(ContractsList));
