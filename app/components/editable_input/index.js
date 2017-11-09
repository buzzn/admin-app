// @flow
import * as React from 'react';
import type { FormProps } from 'redux-form';

import './style.scss';

type Props = {
  editMode: boolean,
} & FormProps;

const EditableInput = ({ editMode, input, meta: { touched, error } }: Props) => {
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

export default EditableInput;
