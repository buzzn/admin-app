import * as React from 'react';
import { Col } from 'reactstrap';
import Select from 'react-select';
import get from 'lodash/get';
import { mainStyle } from 'components/react_select_styles';
import TwoColField from 'components/two_col_field';
import EditableInput from 'components/editable_input';
import EditableSelect from 'components/editable_select';
import EditableCheckbox from 'components/editable_checkbox';
import { numberNormalizer } from 'validation_normalizers';

import { InputRow } from './style';

const EditableInputArray = ({
  fields,
  editMode,
  validationRules,
  addSelectedRegister,
  deleteSelectedRegister,
  setSelectedRegister,
  selectedRegisters,
  marketLocations,
}) => {
  if (!fields.length) {
    addSelectedRegister();
    fields.push();
  }

  const prefix = 'admin';
  const malos: Array<{ value: null | string; label: string }> = [{ value: null, label: 'Create new' }].concat(
    marketLocations.map(m => ({ value: m.id, label: `${m.name} ${m.kind}` })),
  );

  return (
    <React.Fragment>
      {fields.map((field, i) => (
        <InputRow className="fieldgroup" key={i}>
          {editMode && (
            <React.Fragment>
              <i
                className="fa fa-plus-circle add"
                onClick={() => {
                  addSelectedRegister();
                  fields.push();
                }}
              />
              {i > 0 && (
                <i
                  className="fa fa-remove remove"
                  onClick={() => {
                    deleteSelectedRegister(i);
                    fields.remove(i);
                  }}
                />
              )}
            </React.Fragment>
          )}
          <Col xs={12}>
            <Select
              options={malos}
              onChange={value => setSelectedRegister(i, value)}
              styles={mainStyle}
              value={selectedRegisters[i]}
            />
            {get(selectedRegisters[i], 'value') ? (
              <React.Fragment>{selectedRegisters[i].label}</React.Fragment>
            ) : (
              <React.Fragment>
                <TwoColField
                  {...{
                    prefix,
                    name: `${field}.name`,
                    editMode,
                    validationRules,
                    component: EditableInput,
                  }}
                />
                <TwoColField
                  {...{
                    prefix,
                    valuesPrefix: `${prefix}.registers`,
                    name: `${field}.label`,
                    editMode,
                    validationRules,
                    component: EditableSelect,
                  }}
                />
                <TwoColField
                  {...{
                    prefix,
                    name: `${field}.observerEnabled`,
                    editMode,
                    validationRules,
                    component: EditableCheckbox,
                  }}
                />
                <TwoColField
                  {...{
                    prefix,
                    name: `${field}.observerMinThreshold`,
                    editMode,
                    validationRules,
                    component: EditableInput,
                    normalize: numberNormalizer,
                  }}
                />
                <TwoColField
                  {...{
                    prefix,
                    name: `${field}.observerMaxThreshold`,
                    editMode,
                    validationRules,
                    component: EditableInput,
                    normalize: numberNormalizer,
                  }}
                />
                <TwoColField
                  {...{
                    prefix,
                    name: `${field}.observerOfflineMonitoring`,
                    editMode,
                    validationRules,
                    component: EditableCheckbox,
                  }}
                />
              </React.Fragment>
            )}
          </Col>
        </InputRow>
      ))}
    </React.Fragment>
  );
};

export default EditableInputArray;
