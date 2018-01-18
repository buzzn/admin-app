import * as React from 'react';
import { ReactTableDefaults } from 'react-table';
import { Link } from 'react-router-dom';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const FilterComponent = ({ filter, onChange }) => (
  <div className="input-group" style={{ height: '38px' }}>
    <input
      className="form-control"
      type="text"
      style={{ width: '100%', fontSize: '16px', borderRadius: 0 }}
      value={filter ? filter.value : ''}
      onChange={event => onChange(event.target.value)}
    />
    <span className="input-group-addon">
      <i className="fa fa-search" />
    </span>
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
    return row[id] !== undefined
      ? String(row[id])
        .toLowerCase()
        .includes(filter.value)
      : true;
  },
});

export const tableParts = {
  components: {
    iconNameCell: ({ value }) => (
      <span>
        {value.image && <img src={value.image} className={`table-icon-${value.type}`} />}
        {value.value}
      </span>
    ),
    linkCell: ({ value }) => (
      <Link to={value} className="btn btn-outline-secondary" style={{ float: 'right', marginRight: '15px' }}>
        View
      </Link>
    ),
    iconCell: ({ icon, action }) => (
      <span style={{ float: 'right', marginRight: '15px' }}>
        {typeof action === 'string' ? (
          <Link to={action}>
            <i className={`fa fa-${icon}`} />
          </Link>
        ) : (
          <i onClick={action} className={`fa fa-${icon}`} />
        )}
      </span>
    ),
    dropDownCell: ({ row, menuItems }) => (
      <UncontrolledDropdown>
        <DropdownToggle tag="i" className="fa fa-ellipsis-v" />
        <DropdownMenu>
          {// Warning, to make this menu dynamic, you'll need to change key to something different.
          menuItems.map((m, i) => {
            if (m.divider) return <DropdownItem key={i} divider />;
            if (typeof m.action === 'string') {
 return (
                <Link key={i} to={row.original[m.action]}>
                  <DropdownItem>{m.title}</DropdownItem>
                </Link>
              );
}
            return (
              <DropdownItem key={i} onClick={m.action}>
                {m.title}
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </UncontrolledDropdown>
    ),
    energyTypesCell: ({ value }) => (
      <span style={{ fontSize: '18px' }}>
        {value.includes('chp') && <i className="fa fa-fire" style={{ marginRight: '4px' }} />}
        {value.includes('pv') && <i className="fa fa-sun-o" style={{ marginRight: '4px' }} />}
        {value.includes('water') && <i className="fa fa-tint" style={{ marginRight: '4px' }} />}
        {value.includes('wind') && <i className="fa fa-modx" />}
      </span>
    ),
    incompleteCell: ({ value }) => {
      if (!value) return false;
      return <i className="fa fa-exclamation-triangle" style={{ color: '#f57c00' }} />;
    },
    headerCell: ({ title }) => (
      <span>
        {title}{' '}
        <span className="sort-icon-group">
          <i className="fa fa-sort-asc" />
          <i className="fa fa-sort-desc" />
        </span>
      </span>
    ),
    expander: ({ isExpanded, hide }) => {
      if (hide) return false;
      return <div className={`rt-expander ${isExpanded ? '-open' : ''}`}>&bull;</div>;
    },
  },
  filters: {
    filterByValue: (filter, row, column) => {
      const id = filter.pivotId || filter.id;
      return row[id] !== undefined
        ? String(row[id].value)
          .toLowerCase()
          .includes(filter.value)
        : true;
    },
  },
  sort: {
    sortByValue: (x, y) => {
      let a = x.value;
      let b = y.value;
      // force null and undefined to the bottom
      a = a === null || a === undefined ? -Infinity : a;
      b = b === null || b === undefined ? -Infinity : b;
      // force any string values to lowercase
      a = typeof a === 'string' ? a.toLowerCase() : a;
      b = typeof b === 'string' ? b.toLowerCase() : b;
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
