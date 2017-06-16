import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import Contracts from 'contracts';

import './style.scss';

export class Powertakers extends Component {
  static propTypes = {
    loadGroupPowertakers: PropTypes.func.isRequired,
    groupId: PropTypes.string.isRequired,
    powertakers: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    powertakers: [],
  };

  componentWillMount() {
    const { loadGroupPowertakers, groupId } = this.props;
    loadGroupPowertakers(groupId);
  }

  render() {
    const { powertakers, groupId, loading } = this.props;

    if (loading) return (<div>Loading...</div>);

    const data = powertakers.map(p => ({
      ...p,
      name: p.type === 'user' ? { value: `${p.firstName} ${p.lastName}`, image: p.image } : { value: p.name },
      location: 'Location',
      link: `/localpools/${groupId}/powertakers/${p.type}/${p.id}`,
    }));

    const columns = [
      {
        Header: 'Name',
        accessor: 'name',
        filterMethod: (filter, row, column) => {
          const id = filter.pivotId || filter.id;
          return row[id] !== undefined ? String(row[id].value).toLowerCase().startsWith(filter.value) : true;
        },
        sortMethod: (a, b) => {
          a = a.value;
          b = b.value;
          // force null and undefined to the bottom
          a = (a === null || a === undefined) ? -Infinity : a;
          b = (b === null || b === undefined) ? -Infinity : b;
          // force any string values to lowercase
          a = a === 'string' ? a.toLowerCase() : a;
          b = b === 'string' ? b.toLowerCase() : b;
          // Return either 1 or -1 to indicate a sort priority
          if (a > b) {
            return 1;
          }
          if (a < b) {
            return -1;
          }
          // returning 0, undefined or any falsey value will use subsequent sorts or the index as a tiebreaker
          return 0;
        },
        Cell: ({ value }) => <span>{ value.image && <img src={ value.image } className="table-avatar" /> }{ value.value }</span>,
      },
      {
        Header: 'Location',
        accessor: 'location',
      },
      {
        Header: '',
        accessor: 'link',
        sortable: false,
        filterable: false,
        Cell: ({ value }) => <Link to={ value }
                               className="btn btn-outline-secondary"
                               style={{ float: 'right', marginRight: '15px' }}>
                                 View
                            </Link>,
      },
    ];

    const tableProps = {
      data,
      columns,
      filterable: true,
      showPagination: false,
      minRows: 0,
      defaultPageSize: 100000,
      defaultFilterMethod: (filter, row, column) => {
        const id = filter.pivotId || filter.id;
        return row[id] !== undefined ? String(row[id]).toLowerCase().startsWith(filter.value) : true;
      },
    };

    return (
      <div className="row">
        <div className="col-12">
          <h5>Powertakers</h5>
          <p>{ powertakers.length } powertakers</p>
        </div>
        <div className="col-12 no-padding">
          <ReactTable { ...tableProps } />
        </div>
        <div className="col-12 no-padding">
          <table className="table">
            <thead className="thead-default">
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              { powertakers.map(powertaker => (
                  <tr key={ powertaker.id }>
                    {
                      powertaker.type === 'user' ?
                        <td>
                          <img src={ powertaker.image } className="table-avatar"/>
                          { `${powertaker.firstName} ${powertaker.lastName}` }
                        </td> :
                        <td>
                          { powertaker.name }
                        </td>
                    }
                    <td>Location</td>
                    <td>
                      <Link
                        to={ `/localpools/${groupId}/powertakers/${powertaker.type}/${powertaker.id}` }
                        className="btn btn-outline-secondary"
                        style={{ float: 'right', marginRight: '15px' }}>
                        View
                      </Link>
                    </td>
                  </tr>
                ),
              ) }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    powertakers: state.contracts.groupPowertakers,
    loading: state.contracts.loadingGroupPowertakers,
  };
}

export default connect(mapStateToProps, { loadGroupPowertakers: Contracts.actions.loadGroupPowertakers })(Powertakers);
