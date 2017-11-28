// @flow
import * as React from 'react';
import ReactTable from 'react-table';
import moment from 'moment';
import { tableParts as TableParts } from 'react_table_config';

type Props = {
  readings: Array<Object>,
};

const ReadingsList = ({ readings }: Props) => {
  const data = readings.map(r => ({
    ...r,
    date: moment(r.date).format('DD.MM.YYYY'),
  }));

  const columns = [
    {
      Header: 'Date',
      accessor: 'date',
      filterMethod: TableParts.filters.filterByValue,
      sortMethod: TableParts.sort.sortByValue,
    },
    {
      Header: 'Value',
      accessor: 'value',
      filterMethod: TableParts.filters.filterByValue,
      sortMethod: TableParts.sort.sortByValue,
    },
    {
      Header: 'Reason',
      accessor: 'reason',
      filterMethod: TableParts.filters.filterByValue,
      sortMethod: TableParts.sort.sortByValue,
    },
    {
      Header: 'Reading by',
      accessor: 'source',
      filterMethod: TableParts.filters.filterByValue,
      sortMethod: TableParts.sort.sortByValue,
    },
  ];

  return (
    <div className="p-0" style={{ marginBottom: '2rem' }} key={ 2 }>
      <h5>Readings</h5>
      <ReactTable {...{ data, columns }} />
    </div>
  );
}

export default ReadingsList;
