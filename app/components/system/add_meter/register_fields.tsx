import * as React from 'react';
import { Col, Row } from 'reactstrap';
import Select from 'react-select';
import get from 'lodash/get';
import { FormattedMessage } from 'react-intl';
import { mainStyle } from 'components/react_select_styles';
import TwoColField from 'components/two_col_field';
import EditableInput from 'components/editable_input';
import EditableSelect from 'components/editable_select';
import EditableCheckbox from 'components/editable_checkbox';
import { numberNormalizer } from 'validation_normalizers';

import { InputRow, PadRow } from './style';

interface Props {
  preset: { [key: string]: any };
  addSelectedRegister: () => void;
  deleteSelectedRegister: (number) => void;
  deleteAllRegisters: () => void;
  fields: any;
  editMode: boolean;
  validationRules: { [key: string]: any };
  setSelectedRegister: (number, any) => void;
  selectedRegisters: Array<{ [key: string]: any }>;
  marketLocations: Array<{ [key: string]: any }>;
}

class EditableInputArray extends React.Component<Props> {
  componentDidUpdate(prevProps) {
    if (prevProps.preset.label !== this.props.preset.label) {
      this.deleteAllFields();
      for (let i = 0; i < this.props.preset.registersNum; i++) {
        this.addField();
      }
    }
  }

  addField = () => {
    const { addSelectedRegister, fields } = this.props;
    addSelectedRegister();
    fields.push();
  };

  deleteField = (i) => {
    const { deleteSelectedRegister, fields } = this.props;
    deleteSelectedRegister(i);
    fields.remove(i);
  };

  deleteAllFields = () => {
    const { deleteAllRegisters, fields } = this.props;
    deleteAllRegisters();
    fields.removeAll();
  };

  render() {
    const {
      fields,
      editMode,
      validationRules,
      setSelectedRegister,
      selectedRegisters,
      marketLocations,
      preset,
    } = this.props;

    if (!fields.length) {
      this.addField();
    }

    const prefix = 'admin';
    const malos: Array<{ value: null | string; label: string }> = [{ value: null, label: 'Create new' }].concat(
      marketLocations.map(m => ({ value: m.id, label: `${m.name} ${m.kind}` })),
    );

    const FormattedMalo = ({ maloId }) => {
      const malo = marketLocations.find(m => m.id === maloId);
      if (!malo) return <React.Fragment />;
      return (
        <Row>
          <Col xs={12}>
            {malo.name} {malo.register.meter.productSerialnumber} {malo.kind}
          </Col>
        </Row>
      );
    };

    return (
      <React.Fragment>
        <Row>
          <Col xs={12}>
            <p className="h5 grey-underline header text-uppercase" style={{ paddingTop: '2rem' }}>
              <FormattedMessage id="admin.meters.registers" />
            </p>
          </Col>
        </Row>
        {fields.map((field, i) => (
          <InputRow className="fieldgroup" key={i}>
            {editMode
              && !preset.lockRegisters && (
                <React.Fragment>
                  <i
                    className="fa fa-plus-circle add"
                    onClick={() => {
                      this.addField();
                    }}
                  />
                  {i > 0 && (
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
              <Select
                options={malos}
                onChange={value => setSelectedRegister(i, value)}
                styles={mainStyle}
                value={selectedRegisters[i]}
              />
              <br />
              {get(selectedRegisters[i], 'value') ? (
                <React.Fragment>
                  <FormattedMalo maloId={selectedRegisters[i].value} />
                </React.Fragment>
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
                  <TwoColField
                    {...{
                      prefix,
                      name: `${field}.marketLocationId`,
                      editMode,
                      validationRules,
                      component: EditableInput,
                    }}
                  />
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
