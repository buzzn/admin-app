import * as React from 'react';
import find from 'lodash/find';
import { injectIntl } from 'react-intl';
import { FormGroup } from 'components/style';

import './style.scss';

const EditableSelect = ({
  editMode,
  input,
  field,
  prefix,
  intl,
  defaultValue,
  listOverride,
  noValTranslations,
  noDefault,
  withValue,
  meta: { touched, error, dirty },
}) => {
  let list = [input.value];
  let options = [];
  if (listOverride) {
    options = listOverride.map(valueObj => ({
      value: valueObj.value,
      label: noValTranslations ? valueObj.label : intl.formatMessage({ id: `${prefix}.${valueObj.value}` }),
    }));
  } else {
    if (field && field.enum) list = field.enum;
    options = list.map(value => ({
      value,
      label: noValTranslations ? value : intl.formatMessage({ id: `${prefix}.${value}` }),
    }));
  }

  if (editMode) {
    return (
      <FormGroup className={`editable-select ${touched && error && 'has-danger'}`}>
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

  const label = (find(options, o => o.value === input.value) || {}).label;
  return <span>{withValue ? `${input.value} - ${label}` : label}</span>;
};

EditableSelect.defaultProps = { defaultValue: { value: '', label: '-----' } };

export default injectIntl(EditableSelect);
