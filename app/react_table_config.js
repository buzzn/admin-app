// @flow
import * as React from 'react';
import { ReactTableDefaults } from 'react-table';
import { Link } from 'react-router-dom';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

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
  filterable: false,
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
    partyNameCell: ({ value }: { value: { image?: string, value: string } }): React.Node => (
      <span>
        { value.image && <img src={ value.image } className="table-avatar" /> }{ value.value }
      </span>
    ),
    linkCell: ({ value }: { value: string }): React.Node => (
      <Link to={ value }
            className="btn btn-outline-secondary"
            style={{ float: 'right', marginRight: '15px' }}>
        View
      </Link>
    ),
    iconCell: ({ icon }: { icon: string }): React.Node => (
      <span style={{ float: 'right', marginRight: '15px' }}>
        <i className={ `fa fa-${icon}` }/>
      </span>
    ),
    dropDownCell: ({ row, menuItems }:
                     { row: Object, menuItems: Array<({ divider: true } | { title: string, action: string | Function })>}): React.Node => (
      <UncontrolledDropdown>
        <DropdownToggle tag="i" className="fa fa-ellipsis-v"/>
        <DropdownMenu>
          {
            // Warning, to make this menu dynamic, you'll need to change key to something different.
            menuItems.map((m, i) => {
              if (m.divider) return <DropdownItem key={ i } divider />;
              if (typeof m.action === 'string') return <DropdownItem key={ i }><Link to={ row.original[m.action] }>{ m.title }</Link></DropdownItem>;
              return <DropdownItem key={ i } onClick={ m.action }>{ m.title }</DropdownItem>;
            })
          }
        </DropdownMenu>
      </UncontrolledDropdown>
    ),
    headerCell: ({ title }: { title: string }): React.Node => (
      <span>
        { title }{ ' ' }
        <span className="sort-icon-group">
          <i className="fa fa-sort-asc"/>
          <i className="fa fa-sort-desc"/>
        </span>
      </span>
    ),
  },
  filters: {
    filterByValue: (filter: Object, row: Object, column: Object): string | boolean => {
      const id = filter.pivotId || filter.id;
      return row[id] !== undefined ? String(row[id].value).toLowerCase().includes(filter.value) : true;
    },
  },
  sort: {
    sortByValue: (x: { value: any }, y: { value: any }): number => {
      let a = x.value;
      let b = y.value;
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
