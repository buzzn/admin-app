import * as React from 'react';
import { Col, Row } from 'reactstrap';
import Select from 'react-select';
import get from 'lodash/get';
import pullAt from 'lodash/pullAt';
import { FormattedMessage } from 'react-intl';
import { mainStyle } from 'components/react_select_styles';
import FieldValidationWrapper from 'components/field_validation_wrapper';
import EditableInput from 'components/editable_input';
import EditableSelect from 'components/editable_select';
import EditableCheckbox from 'components/editable_checkbox';
import { numberNormalizer } from 'validation_normalizers';

import { InputRow } from 'components/style';
import { PadRow, RegisterFormWrapper } from './style';

interface Props {
  preset: { [key: string]: any };
  setSelectedRegisters: (any) => void;
  fields: any;
  editMode: boolean;
  formValues: any;
  validationRules: { [key: string]: any };
  marketLocations: Array<{ [key: string]: any }>;
}

class EditableInputArray extends React.Component<Props> {
  state: { selectedRegisters: any } = { selectedRegisters: [] };

  componentDidMount() {
    this.addField();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.preset.value !== this.props.preset.value) {
      this.deleteAllFields(this.props.preset.registersNum);
    }
  }

  setSelectedRegister = (idx, value) => {
    const { setSelectedRegisters } = this.props;
    const { selectedRegisters } = this.state;
    selectedRegisters[idx] = value;
    this.setState({ selectedRegisters });
    setSelectedRegisters(selectedRegisters);
  };

  addField = () => {
    const { fields, setSelectedRegisters } = this.props;
    const { selectedRegisters } = this.state;
    fields.push();
    selectedRegisters.push(null);
    this.setState({ selectedRegisters });
    setSelectedRegisters(selectedRegisters);
  };

  deleteField = (i) => {
    const { fields, setSelectedRegisters } = this.props;
    const { selectedRegisters } = this.state;
    fields.remove(i);
    pullAt(selectedRegisters, [i]);
    this.setState({ selectedRegisters });
    setSelectedRegisters(selectedRegisters);
  };

  deleteAllFields = (newNum) => {
    const { fields, setSelectedRegisters } = this.props;
    fields.removeAll();
    this.setState(
      () => ({ selectedRegisters: [] }),
      () => {
        for (let i = 0; i < newNum; i++) {
          this.addField();
        }
      },
    );
    setSelectedRegisters([]);
  };

  render() {
    const { fields, editMode, validationRules, formValues, marketLocations, preset } = this.props;
    const { selectedRegisters } = this.state;

    const prefix = 'admin.registers';
    const malos: Array<{ value: null | string; label: string }> = [{ value: null, label: 'Create new' }].concat(
      marketLocations.map(m => ({
        value: m.id,
        label: `${m.name} (${
          m.registers.array ? m.registers.array.map(r => r.meter.productSerialnumber).join(', ') : ''
        }) ${m.kind}`,
      })),
    );

    return (
      <React.Fragment>
        <Row>
          <Col xs={12}>
            <p className="h5 header text-uppercase" style={{ paddingTop: '2rem' }}>
              <FormattedMessage id="admin.meters.registers" />
            </p>
          </Col>
        </Row>
        {fields.map((field, i) => (
          <InputRow className="fieldgroup" key={i} noGutters>
            {editMode && !preset.lockRegisters && (
              <React.Fragment>
                <i
                  className="fa fa-plus-circle add cy-add-register"
                  onClick={() => {
                    this.addField();
                  }}
                />
                {fields.length > 1 && (
                  <i
                    className="fa fa-remove remove"
                    onClick={() => {
                      this.deleteField(i);
                    }}
                  />
                )}
              </React.Fragment>
            )}
            <Col xs={12}>
              <Row>
                <Col xs={3}>
                  <span className="h5">Register №{i + 1}:</span>
                </Col>
                <Col xs={2}>
                  <FieldValidationWrapper
                    {...{
                      prefix,
                      name: `${field}.emptyRegister`,
                      editMode,
                      withLabel: true,
                      validationRules: {},
                      component: EditableCheckbox,
                    }}
                  />
                </Col>
                {(!formValues.registers[i] || !formValues.registers[i].emptyRegister) && (
                  <Col xs={7}>
                    <Select
                      className={`cy-registers-${i}`}
                      classNamePrefix="cy"
                      options={malos}
                      onChange={value => this.setSelectedRegister(i, value)}
                      styles={mainStyle}
                      value={selectedRegisters[i]}
                    />
                  </Col>
                )}
              </Row>
              {(!formValues.registers[i] || !formValues.registers[i].emptyRegister) && (
                <React.Fragment>
                  {!get(selectedRegisters[i], 'value') && (
                    <RegisterFormWrapper>
                      <Row>
                        <Col xs={4} xl={3}>
                          <FieldValidationWrapper
                            {...{
                              prefix,
                              name: `${field}.name`,
                              editMode,
                              withLabel: true,
                              validationRules,
                              component: EditableInput,
                            }}
                          />
                        </Col>
                        <Col xs={4} xl={3}>
                          <FieldValidationWrapper
                            {...{
                              prefix,
                              name: `${field}.label`,
                              editMode,
                              withLabel: true,
                              validationRules,
                              component: EditableSelect,
                            }}
                          />
                        </Col>
                        <Col xs={4} xl={2}>
                          <FieldValidationWrapper
                            {...{
                              prefix,
                              name: `${field}.marketLocationId`,
                              editMode,
                              withLabel: true,
                              validationRules,
                              component: EditableInput,
                            }}
                          />
                        </Col>
                        <Col xs={3} xl={2}>
                          <FieldValidationWrapper
                            {...{
                              prefix,
                              name: `${field}.observerMinThreshold`,
                              editMode,
                              withLabel: true,
                              validationRules,
                              component: EditableInput,
                              normalize: numberNormalizer,
                            }}
                          />
                        </Col>
                        <Col xs={3} xl={2}>
                          <FieldValidationWrapper
                            {...{
                              prefix,
                              name: `${field}.observerMaxThreshold`,
                              editMode,
                              withLabel: true,
                              validationRules,
                              component: EditableInput,
                              normalize: numberNormalizer,
                            }}
                          />
                        </Col>
                        <Col xs={3}>
                          <FieldValidationWrapper
                            {...{
                              prefix,
                              name: `${field}.observerEnabled`,
                              editMode,
                              withLabel: true,
                              validationRules,
                              component: EditableCheckbox,
                            }}
                          />
                        </Col>
                        <Col xs={3}>
                          <FieldValidationWrapper
                            {...{
                              prefix,
                              name: `${field}.observerOfflineMonitoring`,
                              editMode,
                              withLabel: true,
                              validationRules,
                              component: EditableCheckbox,
                            }}
                          />
                        </Col>
                      </Row>
                    </RegisterFormWrapper>
                  )}
                </React.Fragment>
              )}
            </Col>
          </InputRow>
        ))}
        <PadRow />
      </React.Fragment>
    );
  }
}

export default EditableInputArray;
