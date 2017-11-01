// @flow
import * as React from 'react';
import ReactTable from 'react-table';
import { tableParts as TableParts } from 'react_table_config';
import ReadingsList from '../readings_list';

type Props = {
  registers: Array<Object>,
  readings?: Array<Object>,
  loadRegisterReadings?: Function,
  subComponent?: boolean,
  url: string,
};

const RegistersList = ({ registers, subComponent, url, readings, loadRegisterReadings }: Props) => {
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
      Cell: row => <TableParts.components.dropDownCell row={ row } menuItems={ [
        { action: 'linkRegister', title: 'View register' },
        { action: 'linkReadings', title: 'View readings' },
        { action: () => { console.log('add reading'); }, title: 'Add reading' },
      ] }/>,
    },
  ];

  const components = [];
  type TableProps = { data: Array<Object>, columns: Array<Object>, SubComponent?: Function, freezeWhenExpanded: boolean };
  const tableProps: TableProps = { data, columns, freezeWhenExpanded: true };

  if (!subComponent) {
    components.push(<p key={ 1 } className="h4">Registers:</p>);
    if (readings && loadRegisterReadings) {
      // Flowtype feature/bug. See https://flow.org/en/docs/lang/refinements/
      const r = readings;
      const lr = loadRegisterReadings;
      tableProps.SubComponent = (row) => {
        return <ReadingsList readings={ r } subComponent loadRegisterReadings={ () => lr(row.original.id) }/>;
      };
    }
  }

  components.push(<div className={ subComponent ? 'p-4 sub-component' : 'p-0' } key={ 2 }>
      <ReactTable {...tableProps} />
    </div>);

  return components;
};

export default RegistersList;
