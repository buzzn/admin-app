// @flow
import * as React from 'react';
import ReactTable from 'react-table';
import { injectIntl } from 'react-intl';
import type { intlShape } from 'react-intl';
import { tableParts as TableParts } from 'react_table_config';

type Props = {
  contracts: Array<Object>,
  loading: boolean,
  url: string,
  intl: intlShape,
};

const ContractsList = ({ contracts, loading, url, intl }: Props) => {
  const data = contracts.filter(c => !!c.id).map(c => ({
    ...c,
    type: intl.formatMessage({ id: `admin.contracts.${c.type}` }),
    status: c.status,
    since: c.signingDate,
    number: c.fullContractNumber,
    link: `${url}/${c.id}`,
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
      accessor: '',
      sortable: false,
      filterable: false,
      resizable: false,
      width: 100,
      className: 'dropdown-fix',
      Cell: row => <TableParts.components.dropDownCell row={ row } menuItems={ [
        { action: 'link', title: 'View contract' },
      ] }/>,
    },
  ];

  return (
    <div className="p-0">
      <ReactTable {...{ data, columns }} />
    </div>
  );
}

export default injectIntl(ContractsList);
