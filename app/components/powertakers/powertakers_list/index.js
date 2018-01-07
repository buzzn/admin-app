import * as React from 'react';
import ReactTable from 'react-table';
import { tableParts as TableParts } from 'react_table_config';

import DefaultPerson from 'images/default_person.jpg';

const PowertakersList = ({ powertakers, loading, url }) => {
  const data = powertakers.map(p => ({
    ...p,
    name:
      p.type === 'person'
        ? { value: `${p.firstName} ${p.lastName}`, image: p.image || DefaultPerson, type: 'avatar' }
        : { value: p.name, type: 'avatar' },
    location: 'Location',
    link: `${url}/${p.contractId}`,
  }));

  const columns = [
    {
      Header: () => <TableParts.components.headerCell title="Name" />,
      accessor: 'name',
      minWidth: 200,
      filterMethod: TableParts.filters.filterByValue,
      sortMethod: TableParts.sort.sortByValue,
      Cell: TableParts.components.iconNameCell,
    },
    {
      Header: () => <TableParts.components.headerCell title="Location" />,
      accessor: 'location',
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
      Cell: row => (
        <TableParts.components.dropDownCell row={row} menuItems={[{ action: 'link', title: 'View powertaker' }]} />
      ),
    },
  ];

  return (
    <div className="p-0" key={2}>
      <ReactTable {...{ data, columns }} />
    </div>
  );
};

export default PowertakersList;
