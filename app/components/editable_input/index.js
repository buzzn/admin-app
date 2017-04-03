import React from 'react';

const EditableInput = ({ editMode, input, meta: { touched, error } }) => {
  if (editMode) {
    return (
      <div className={ `form-group ${(touched && error) && 'has-danger'}` }>
        <input className={ `form-control ${(touched && error) && 'form-control-danger'}` } {...input} type="text" />
        { touched && error && <div className="form-control-feedback">{ error }</div> }
      </div>
    );
  }
  return <span>{ input.value }</span>;
};

EditableInput.propTypes = {
  editMode: React.PropTypes.bool.isRequired,
  input: React.PropTypes.object.isRequired,
  meta: React.PropTypes.object.isRequired,
};

export default EditableInput;
