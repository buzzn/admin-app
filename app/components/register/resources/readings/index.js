import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import moment from 'moment';
import { tableParts } from 'react_table_config';
import AddReading from './add_reading';

class Readings extends Component {
  static propTypes = {
    readings: PropTypes.array.isRequired,
    url: PropTypes.string.isRequired,
    validationRules: PropTypes.object.isRequired,
    groupId: PropTypes.string.isRequired,
    meterId: PropTypes.string.isRequired,
    registerId: PropTypes.string.isRequired,
    addReading: PropTypes.func.isRequired,
  };

  state = {
    modal: false,
  };

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  render() {
    const { readings, url, validationRules, groupId, meterId, registerId, canAddReading, addReading } = this.props;

    const data = readings.map(r => ({
      ...r,
      date: moment(r.date).format('DD.MM.YYYY'),
      link: `${url}/readings/${r.id}`,
    }));

    const columns = [
      {
        Header: 'Date',
        accessor: 'date',
        minWidth: 200,
        filterMethod: tableParts.filters.filterByValue,
        sortMethod: tableParts.sort.sortByValue,
      },
      {
        Header: 'Value',
        accessor: 'value',
        minWidth: 200,
        filterMethod: tableParts.filters.filterByValue,
        sortMethod: tableParts.sort.sortByValue,
      },
      {
        Header: 'Reason',
        accessor: 'reason',
        minWidth: 200,
        filterMethod: tableParts.filters.filterByValue,
        sortMethod: tableParts.sort.sortByValue,
      },
      {
        Header: 'Reading by',
        accessor: 'source',
        minWidth: 200,
        filterMethod: tableParts.filters.filterByValue,
        sortMethod: tableParts.sort.sortByValue,
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
          <h5>Readings</h5>
          {
            !!canAddReading &&
            <div
              onClick={ ::this.toggle }
              style={{ position: 'absolute', right: '15px', top: 0, cursor: 'pointer' }}
              className="btn btn-info">Add</div>
          }
          List of all readings for a register.
        </div>
        <div className="col-12 no-padding">
          <ReactTable {...{ data, columns }} />
        </div>
        <AddReading {...{
          toggle: ::this.toggle,
          isOpen: this.state.modal,
          validationRules,
          groupId,
          meterId,
          registerId,
          addReading,
        }}/>
      </div>
    );
  }
}

export default Readings;
