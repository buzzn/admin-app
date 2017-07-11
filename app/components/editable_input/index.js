import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const EditableInput = ({ editMode, input, meta: { touched, error } }) => {
  if (editMode) {
    return (
      <div className={ `editable-input form-group ${(touched && error) && 'has-danger'}` }>
        <input className={ `form-control ${(touched && error) && 'form-control-danger'}` } {...input} type="text" />
        { touched && error && <div className="form-control-feedback">{ error }</div> }
      </div>
    );
  }
  return <span>{ input.value }</span>;
};

EditableInput.propTypes = {
  editMode: PropTypes.bool.isRequired,
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
};

export default EditableInput;
