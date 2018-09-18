import * as React from 'react';

const HTMLSelect = ({ touched, error, dirty, input, noDefault, defaultValue, options, withValue }) => (
  <select
    className={`custom-select form-control ${touched && error && 'form-control-danger'} ${dirty && 'dirty'}`}
    {...input}
  >
    {!noDefault && <option value={defaultValue.value}>{defaultValue.label}</option>}
    {options.map(o => (
      <option key={o.value} value={o.value}>
        {withValue ? `${o.value} - ${o.label}` : o.label}
      </option>
    ))}
  </select>
);

export default HTMLSelect;
