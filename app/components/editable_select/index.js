import React from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';

import './style.scss';

const EditableSelect = ({ editMode, input, options, defaultValue, meta: { touched, error } }) => {
  if (editMode) {
    return (
      <div className={ `editable-select form-group ${(touched && error) && 'has-danger'}` }>
        <select className={ `custom-select form-control ${(touched && error) && 'form-control-danger'}` } { ...input }>
          <option value={ defaultValue.value }>{ defaultValue.label }</option>
          {
            options.map(o => (
              <option key={ o.value } value={ o.value }>{ o.label }</option>
            ))
          }
        </select>
        { touched && error && <div className="form-control-feedback">{ error }</div> }
      </div>
    );
  }

  const label = find(options, o => o.value === input.value);
  return <span>{ (label || {}).label }</span>;
};

EditableSelect.propTypes = {
  editMode: PropTypes.bool.isRequired,
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
  defaultValue: PropTypes.object,
};

EditableSelect.defaultProps = {
  defaultValue: { value: '', label: '-----' },
};

export default EditableSelect;
