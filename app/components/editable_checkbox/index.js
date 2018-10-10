import React from 'react';
import { FormattedMessage } from 'react-intl';

const EditableCheckbox = ({ prefix, name, withLabel, editMode, input, meta: { touched, error } }) => (
  <div
    className={`editable-checkbox form-check custom-control custom-checkbox ${touched
      && error
      && 'has-danger'} ${!withLabel && 'position-static'}`}
  >
    <input
      className="custom-control-input"
      id={input.name}
      {...input}
      disabled={!editMode}
      defaultChecked={input.value}
      onBlur={({ target }) => input.onBlur(target.value.length > 0 ? target.value : 'false')}
      type="checkbox"
    />
    {withLabel && (
      <label className="custom-control-label" for={input.name}>
        <FormattedMessage id={`${prefix}.${name || input.name.split('.').pop()}`} />
      </label>
    )}
    {touched && error && <div className="invalid-feedback">{error}</div>}
  </div>
);

export default EditableCheckbox;
