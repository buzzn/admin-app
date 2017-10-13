// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { intlShape } from 'react-intl';
import { tableParts as TableParts } from 'react_table_config';
import Contracts from 'contracts';

type Props = {
  // TODO: replace with action
  loadGroupContracts: Function,
  contracts: Array<Object>,
  loading: boolean,
  match: { params: { groupId: string } },
  intl: intlShape,
};

export class ContractsList extends React.Component<Props> {
  static defaultProps = {
    contracts: [],
  };

  componentWillMount() {
    const { loadGroupContracts, match: { params: { groupId } } } = this.props;
    loadGroupContracts(groupId);
  }

  render() {
    const { contracts, loading, match: { params: { groupId } }, intl } = this.props;

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
        Header: () => <TableParts.components.headerCell title={ intl.formatMessage({ id: 'admin.contracts.tableType' }) }/>,
        accessor: 'type',
        minWidth: 200,
      },
      {
        Header: () => <TableParts.components.headerCell title={ intl.formatMessage({ id: 'admin.contracts.tableStatus' }) }/>,
        accessor: 'status',
        minWidth: 200,
      },
      {
        Header: () => <TableParts.components.headerCell title={ intl.formatMessage({ id: 'admin.contracts.tableSince' }) }/>,
        accessor: 'since',
        minWidth: 100,
      },
      {
        Header: () => <TableParts.components.headerCell title={ intl.formatMessage({ id: 'admin.contracts.tableNumber' }) }/>,
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
        Cell: () => <TableParts.components.iconCell icon="cog"/>,
      },
    ];

    return [
      <div key={ 1 }>
        <h5><FormattedMessage id="admin.contracts.headerGroupContracts"/></h5>
        <FormattedMessage id="admin.contracts.descriptionGroupContracts"/>
      </div>,
      <div className="p-0" key={ 2 }>
        <ReactTable {...{ data, columns }} />
      </div>,
    ];
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
