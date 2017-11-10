// @flow
import * as React from 'react';
import includes from 'lodash/includes';
import ReactTable from 'react-table';
import { tableParts as TableParts } from 'react_table_config';
import ReadingsList from '../readings_list';

type Props = {
  registers: Array<Object>,
  subComponent?: boolean,
  url: string,
  meterId: string,
  setAddReading: Function,
  deleteReading?: Function,
};

const RegistersList = ({ registers, subComponent, url, meterId, setAddReading, deleteReading }: Props) => {
  if (subComponent && registers.length === 0) return false;

  const data = registers.map(r => ({
    ...r,
    linkRegister: `${url}/${r.id}`,
    linkReadings: `${url}/${r.id}/readings`,
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
      Cell: row => <TableParts.components.dropDownCell row={ row } menuItems={ (() => {
        const items = [
          { action: 'linkRegister', title: 'View register' },
          { action: 'linkReadings', title: 'View readings' },
        ];

        if (includes(row.original.createables, 'readings')) {
          items.push({ action: () => setAddReading({ meterId, registerId: row.original.id }), title: 'Add reading' });
        }

        return items;
      })() }/>,
    },
  ];

  const components = [];
  type TableProps = { data: Array<Object>, columns: Array<Object>, SubComponent?: Function };
  const tableProps: TableProps = { data, columns, collapseOnDataChange: false };

  if (!subComponent) {
    components.push(<p key={ 1 } className="h4">Registers:</p>);
    // Flowtype feature/bug. See https://flow.org/en/docs/lang/refinements/
    const dr = deleteReading;
    if (dr) {
      tableProps.SubComponent = (row) => {
        return <ReadingsList readings={ row.original.readings.array } deleteReading={ (readingId) => dr({ readingId, registerId: row.original.id }) } subComponent />;
      };
    }
  }

  components.push(<div className={ subComponent ? 'p-4 sub-component' : 'p-0' } key={ 2 }>
      <ReactTable {...tableProps} />
    </div>);

  return components;
};

export default RegistersList;
