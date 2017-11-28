// @flow
import * as React from 'react';
import ReactTable from 'react-table';
import { tableParts as TableParts } from 'react_table_config';

type Props = {
  registers: Array<Object>,
  subComponent?: boolean,
  url: string,
};

const RegistersList = ({ registers, subComponent, url }: Props) => {
  if (subComponent && registers.length === 0) return false;

  const data = registers.map(r => ({
    ...r,
    linkRegister: `${url}/${r.id}`,
  }));

  const columns = [
    {
      Header: () => <TableParts.components.headerCell title="Type"/>,
      accessor: 'type',
    },
    {
      Header: () => <TableParts.components.headerCell title="Obis"/>,
      accessor: 'obis',
    },
    {
      Header: () => <TableParts.components.headerCell title="Name"/>,
      accessor: 'name',
    },
    {
      Header: () => <TableParts.components.headerCell title="Last Reading"/>,
      accessor: 'lastReading',
    },
    {
      Header: '',
      accessor: '',
      sortable: false,
      filterable: false,
      resizable: false,
      width: 100,
      className: 'dropdown-fix',
      Cell: row => <TableParts.components.dropDownCell row={ row } menuItems={ (() => ([{ action: 'linkRegister', title: 'View register' }]))() }/>,
    },
  ];

  const components = [];
  type TableProps = { data: Array<Object>, columns: Array<Object>, SubComponent?: Function };
  const tableProps: TableProps = { data, columns, collapseOnDataChange: false };

  return (
    <div className={ subComponent ? 'p-4 sub-component' : 'p-0' } key={ 2 }>
      <ReactTable {...tableProps} />
    </div>
  );
};

export default RegistersList;
