import * as React from 'react';
import { FormGroup } from 'components/style';

import './style.scss';

const EditableInput = ({ editMode, input, meta: { touched, error, dirty } }) => {
  if (editMode) {
    return (
      <FormGroup className={`editable-input ${touched && error && 'has-danger'}`}>
        <input
          className={`form-control ${touched && error && 'form-control-danger'} ${dirty && 'dirty'}`}
          {...input}
          type="text"
        />
        {touched &&
          !!error && (
            <React.Fragment>
              <div className="inline-error">{error}</div>
              <i className="error-icon buzzn-attention" />
            </React.Fragment>
          )}
      </FormGroup>
    );
  }
  return <span>{input.value}</span>;
};

export default EditableInput;
