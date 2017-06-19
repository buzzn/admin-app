import React from 'react';
import { ReactTableDefaults } from 'react-table';
import { Link } from 'react-router-dom';

const FilterComponent = ({ filter, onChange }) => (
  <div className="input-group" style={{ height: '20px' }}>
    <input
      className="form-control"
      type='text'
      style={{
        width: '100%',
      }}
      value={filter ? filter.value : ''}
      onChange={event => onChange(event.target.value)}
    />
    <span className="input-group-addon"><i className="fa fa-search"/></span>
  </div>
);

Object.assign(ReactTableDefaults, {
  FilterComponent,
  filterable: true,
  showPagination: false,
  minRows: 0,
  defaultPageSize: 100000,
  defaultFilterMethod: (filter, row, column) => {
    const id = filter.pivotId || filter.id;
    return row[id] !== undefined ? String(row[id]).toLowerCase().includes(filter.value) : true;
  },
});

export const tableParts = {
  components: {
    partyNameCell: ({ value }) => <span>
                                  { value.image && <img src={ value.image } className="table-avatar" /> }{ value.value }
                                  </span>,
    linkCell: ({ value }) => <Link to={ value }
                                   className="btn btn-outline-secondary"
                                   style={{ float: 'right', marginRight: '15px' }}>
                              View
                            </Link>,
  },
  filters: {
    filterByValue: (filter, row, column) => {
      const id = filter.pivotId || filter.id;
      return row[id] !== undefined ? String(row[id].value).toLowerCase().includes(filter.value) : true;
    },
  },
  sort: {
    sortByValue: (a, b) => {
      a = a.value;
      b = b.value;
      // force null and undefined to the bottom
      a = (a === null || a === undefined) ? -Infinity : a;
      b = (b === null || b === undefined) ? -Infinity : b;
      // force any string values to lowercase
      a = (typeof a === 'string') ? a.toLowerCase() : a;
      b = (typeof b === 'string') ? b.toLowerCase() : b;
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
  },
};
