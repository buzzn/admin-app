// @flow
import * as React from 'react';
import ReactTable from 'react-table';
import { tableParts as TableParts } from 'react_table_config';

import './style.scss';

type Props = {
  registers: Array<Object>,
  subComponent: boolean,
};

const RegistersList = ({ registers, subComponent }: Props) => {
  if (subComponent && registers.length === 0) return false;

  const columns = [
    {
      Header: () => <TableParts.components.headerCell title="Type"/>,
      accessor: 'type',
      minWidth: 200,
    },
    {
      Header: () => <TableParts.components.headerCell title="Obis"/>,
      accessor: 'obis',
      minWidth: 200,
    },
    {
      Header: () => <TableParts.components.headerCell title="Last Reading"/>,
      accessor: 'lastReading',
      minWidth: 200,
    },
    {
      Header: '',
      accessor: '',
      sortable: false,
      filterable: false,
      resizable: false,
      width: 100,
      Cell: () => <TableParts.components.iconCell icon="ellipsis-v"/>,
    },
  ];

  const components = [];

  if (!subComponent) {
    components.push(<p key={ 1 } className="h4">Registers:</p>);
  }

  components.push(<div className={ subComponent ? 'p-4 sub-component' : 'p-0' } key={ 2 }>
      <ReactTable {...{ data: registers, columns }} />
    </div>);

  return components;
};

export default RegistersList;
