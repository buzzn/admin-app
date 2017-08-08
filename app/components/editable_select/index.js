import React from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import { injectIntl } from 'react-intl';

import './style.scss';

const EditableSelect = ({ editMode, input, field, prefix, intl, defaultValue, listOverride, noValTranslations, noDefault, meta: { touched, error } }) => {
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
      <div className={ `editable-select form-group ${(touched && error) && 'has-danger'}` }>
        <select className={ `custom-select form-control ${(touched && error) && 'form-control-danger'}` } { ...input }>
          { !noDefault && <option value={ defaultValue.value }>{ defaultValue.label }</option> }
          {
            options.map(o => (
              <option key={ o.value } value={ o.value }>{ o.label }</option>
            ))
          }
        </select>
        { touched && error && <div className="form-control-feedback">{ error }</div> }
      </div>
    );
  }

  const label = find(options, o => o.value === input.value);
  return <span>{ (label || {}).label }</span>;
};

EditableSelect.propTypes = {
  editMode: PropTypes.bool.isRequired,
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  field: PropTypes.object,
  defaultValue: PropTypes.object,
};

EditableSelect.defaultProps = {
  defaultValue: { value: '', label: '-----' },
};

export default injectIntl(EditableSelect);
