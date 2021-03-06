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
  overrideData,
  input,
  meta: { active, touched, error, dirty },
}) => {
  const fieldProps = { type: 'text' };
  if (field.type === 'integer' || field.type === 'number') {
    fieldProps.type = 'number';
    if (!isNaN(Number(field.minimum))) fieldProps.min = field.minimum;
    if (!isNaN(Number(field.maximum))) fieldProps.max = field.maximum;
  }

  if (editMode) {
    return (
      <FormGroup
        className={`editable-input ${touched && error && 'has-danger'}`}
      >
        {!overrideData ? (
          <input
            className={`form-control ${touched &&
              error &&
              'form-control-danger'} ${dirty && 'dirty'}`}
            id={input.name}
            {...input}
            {...fieldProps}
          />
        ) : (
          <input
            className="form-control"
            value={overrideData[input.name.split('.').pop()] || ''}
            {...fieldProps}
            disabled
          />
        )}
        {withLabel && (
          <label
            className={`${
              input.value || active || overrideData ? 'top' : 'center'
            }`}
            htmlFor={input.name}
          >
            <FormattedMessage
              id={`${prefix}.${name || input.name.split('.').pop()}`}
            />
          </label>
        )}
        {touched && !!error && (
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
