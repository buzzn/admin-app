import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FormGroup } from 'components/style';

import './style.scss';

const EditableInput = ({
  withLabel,
  prefix,
  name,
  field,
  editMode,
  input,
  meta: { active, touched, error, dirty },
}) => {
  let type = 'text';
  if (field.type === 'integer') type = 'number';

  if (editMode) {
    return (
      <FormGroup className={`editable-input ${touched && error && 'has-danger'}`}>
        <input
          className={`form-control ${touched && error && 'form-control-danger'} ${dirty && 'dirty'}`}
          {...input}
          type={type}
        />
        {withLabel && (
          <label className={`${!!input.value || active ? 'top' : 'center'}`}>
            <FormattedMessage id={`${prefix}.${name}`} />
          </label>
        )}
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
