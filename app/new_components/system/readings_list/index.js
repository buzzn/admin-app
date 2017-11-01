// @flow
import * as React from 'react';
import ReactTable from 'react-table';
import moment from 'moment';
import { tableParts as TableParts } from 'react_table_config';

type Props = {
  readings: Array<Object>,
  subComponent?: boolean,
  loadRegisterReadings: Function,
};

class ReadingsList extends React.Component<Props> {
  componentWillMount() {
    this.props.loadRegisterReadings();
  }

  render() {
    const { readings, subComponent } = this.props;

    const data = readings.map(r => ({
      ...r,
      date: moment(r.date).format('DD.MM.YYYY'),
      deleteReading: () => { console.log('delete reading'); },
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
      {
        Header: '',
        accessor: 'link',
        sortable: false,
        filterable: false,
        resizable: false,
        width: 100,
        Cell: row => <TableParts.components.iconCell icon="cross" action={ row.original.deleteReading }/>,
      },
    ];

    const components = [];

    if (!subComponent) {
      components.push(<p key={ 1 } className="h4">Readings:</p>);
    }

    components.push(<div className={ subComponent ? 'p-4 sub-component' : 'p-0' } key={ 2 }>
      <ReactTable {...{ data, columns }} />
    </div>);

    return components;
  }
}

export default ReadingsList;
