import * as React from 'react';
import find from 'lodash/find';
import { injectIntl, FormattedMessage } from 'react-intl';

import { FormGroup } from 'components/style';
import CustomSelect from './custom_select';
import HTMLSelect from './html_select';

import './style.scss';

const EditableSelect = ({
  customSelect,
  defaultValue,
  editMode,
  field,
  input,
  intl,
  listOverride,
  meta: { active, dirty, error, touched },
  name,
  noDefault,
  noValTranslations,
  overrideData,
  prefix,
  valuesPrefix,
  withLabel,
  withValue,
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
      label: noValTranslations ? value : intl.formatMessage({ id: `${valuesPrefix || prefix}.${value}` }),
    }));
  }
  const SelectComponent = customSelect ? CustomSelect : HTMLSelect;

  if (editMode) {
    return (
      <FormGroup className={`editable-select ${touched && error && 'has-danger'}`}>
        {!overrideData ? (
          <SelectComponent
            {...{
              touched,
              error,
              dirty,
              input,
              noDefault,
              defaultValue,
              options,
              withValue,
            }}
          />
        ) : (
          <input
            className="form-control"
            value={overrideData[input.name.split('.').pop()] || ''}
            type="text"
            disabled
          />
        )}
        {withLabel && (
          <label className={`${input.value || active || overrideData ? 'top' : 'center'}`} htmlFor={input.name}>
            <FormattedMessage id={`${prefix}.${name || input.name.split('.').pop()}`} />
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

  if (!input.value) return <span />;
  const { label } = find(options, o => o.value === input.value) || {};
  return <span>{withValue ? `${input.value} - ${label}` : label}</span>;
};

EditableSelect.defaultProps = { defaultValue: { value: '', label: '-----' } };

export default injectIntl(EditableSelect);
