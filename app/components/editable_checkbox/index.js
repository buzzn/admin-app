import React from 'react';
import PropTypes from 'prop-types';

const EditableCheckbox = ({ editMode, input, meta: { touched, error } }) => {
  return (
    <div className={ `editable-checkbox form-check ${(touched && error) && 'has-danger'}` }>
      <label className="custom-control custom-checkbox">
        <input
          className="custom-control-input"
          {...input}
          disabled={ !editMode }
          defaultChecked={ input.value }
          onBlur={ ({ target }) => input.onBlur(target.value.length > 0 ? target.value : 'false') }
          type="checkbox" />
        <span className="custom-control-indicator"></span>
        <span className="custom-control-description">
          { touched && error && <div className="form-control-feedback">{ error }</div> }
        </span>
      </label>
    </div>
  );
};

EditableCheckbox.propTypes = {
  editMode: PropTypes.bool.isRequired,
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
};

export default EditableCheckbox;
