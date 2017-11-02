// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { reduxForm } from 'redux-form';
import type { FormProps } from 'redux-form';
import range from 'lodash/range';
import EditableInput from 'new_components/editable_input';
import EditableSelect from 'new_components/editable_select';
import TwoColField from 'new_components/two_col_field';
import EditableDate from 'new_components/editable_date';
import { dateNormalizer } from 'validation_normalizers';

type Props = {
  updateMeter?: Function,
  realValidationRules: Object,
  virtualValidationRules: Object,
  meter: Object,
} & FormProps;

type State = {
  editMode: boolean,
};

class MeterData extends React.Component<Props, State> {
  state = {
    editMode: false,
  };

  handleEditSwitch(event) {
    event.preventDefault();

    const { updateMeter, reset, realValidationRules, virtualValidationRules, meter } = this.props;
    if (!updateMeter || !meter.updatable ||
      (meter.type === 'meter_real' && Object.keys(realValidationRules).length === 0) ||
      (meter.type === 'meter_virtual' && Object.keys(virtualValidationRules).length === 0)) {
      this.setState({ editMode: false });
    }
    this.setState({ editMode: !this.state.editMode });
    reset();
    return false;
  }

  render() {
    const {
      meter,
      updateMeter,
      handleSubmit,
      pristine,
      submitting,
      realValidationRules,
      virtualValidationRules,
    } = this.props;

    const submit = (values) => {
      if (!updateMeter) return false;
      return new Promise((resolve, reject) => {
        updateMeter({
          meterId: meter.id,
          params: values,
          resolve,
          reject,
        });
      })
        .then(() => this.setState({ editMode: false }));
    };

    const prefix = 'admin.meters';

    return (
      <form onSubmit={ handleSubmit(submit) }>
        <div className="row">
          {
            meter.type === 'meter_real' ?
              <div className="col-12">
                <h5><FormattedMessage id={`${prefix}.headerMeterData`}/></h5>
                <TwoColField
                  prefix={prefix}
                  name="section"
                  editMode={this.state.editMode}
                  validationRules={realValidationRules}
                  component={EditableSelect}
                />
                <TwoColField
                  prefix={prefix}
                  name="ownership"
                  editMode={this.state.editMode}
                  validationRules={realValidationRules}
                  component={EditableSelect}
                />
                <TwoColField
                  prefix={prefix}
                  name="manufacturerName"
                  editMode={this.state.editMode}
                  validationRules={realValidationRules}
                  component={EditableSelect}
                />
                <TwoColField
                  prefix={prefix}
                  name="productName"
                  editMode={this.state.editMode}
                  validationRules={realValidationRules}
                  component={EditableInput}
                />
                <TwoColField
                  prefix={prefix}
                  name="productSerialnumber"
                  editMode={this.state.editMode}
                  validationRules={realValidationRules}
                  component={EditableInput}
                />
                <TwoColField
                  prefix={prefix}
                  name="buildYear"
                  editMode={this.state.editMode}
                  noValTranslations={true}
                  field={{ enum: range(1990, (new Date()).getFullYear() + 1).map(y => y) }}
                  validationRules={realValidationRules}
                  component={EditableSelect}
                />
                <TwoColField
                  prefix={prefix}
                  name="calibratedUntil"
                  editMode={this.state.editMode}
                  validationRules={realValidationRules}
                  normalize={dateNormalizer('YYYY-MM-DD')}
                  component={EditableDate}
                />
                <TwoColField
                  prefix={prefix}
                  name="sentDataDso"
                  editMode={this.state.editMode}
                  validationRules={realValidationRules}
                  normalize={dateNormalizer('YYYY-MM-DD')}
                  component={EditableDate}
                />
                <h5 style={{ marginTop: '16px' }}><FormattedMessage id={`${prefix}.headerClassification`}/></h5>
                <TwoColField
                  prefix={prefix}
                  name="edifactMeteringType"
                  editMode={this.state.editMode}
                  validationRules={realValidationRules}
                  component={EditableSelect}
                />
                <TwoColField
                  prefix={prefix}
                  name="directionNumber"
                  editMode={this.state.editMode}
                  validationRules={realValidationRules}
                  component={EditableSelect}
                />
                <TwoColField
                  prefix={prefix}
                  name="edifactTariff"
                  editMode={this.state.editMode}
                  validationRules={realValidationRules}
                  component={EditableSelect}
                />
                <TwoColField
                  prefix={prefix}
                  name="edifactMeterSize"
                  editMode={this.state.editMode}
                  validationRules={realValidationRules}
                  component={EditableSelect}
                />
                <TwoColField
                  prefix={prefix}
                  name="edifactMountingMethod"
                  editMode={this.state.editMode}
                  validationRules={realValidationRules}
                  component={EditableSelect}
                />
                <TwoColField
                  prefix={prefix}
                  name="edifactMeasurementMethod"
                  editMode={this.state.editMode}
                  validationRules={realValidationRules}
                  component={EditableSelect}
                />
                <TwoColField
                  prefix={prefix}
                  name="edifactVoltageLevel"
                  editMode={this.state.editMode}
                  validationRules={realValidationRules}
                  component={EditableSelect}
                />
                <TwoColField
                  prefix={prefix}
                  name="edifactCycleInterval"
                  editMode={this.state.editMode}
                  validationRules={realValidationRules}
                  component={EditableSelect}
                />
                <TwoColField
                  prefix={prefix}
                  name="edifactDataLogging"
                  editMode={this.state.editMode}
                  validationRules={realValidationRules}
                  component={EditableSelect}
                />
                <TwoColField
                  prefix={prefix}
                  name="converterConstant"
                  editMode={this.state.editMode}
                  validationRules={realValidationRules}
                  component={EditableInput}
                />
              </div> :
              <div className="col-12">
                <div className="row">
                  <div className="col-6"><FormattedMessage id={ `${prefix}.type` }/>:</div>
                  <div className="col-6">
                    <FormattedMessage id={ `${prefix}.${meter.type}` }/>
                  </div>
                </div>
                <TwoColField
                  prefix={prefix}
                  name="productSerialnumber"
                  editMode={this.state.editMode}
                  validationRules={virtualValidationRules}
                  component={EditableInput}
                />
                <TwoColField
                  prefix={prefix}
                  name="productName"
                  editMode={this.state.editMode}
                  validationRules={virtualValidationRules}
                  component={EditableInput}
                />
              </div>
          }
        </div>
        <div className="row">
          <div className="col-12">
            {
              updateMeter && meter.updatable &&
              ((Object.keys(realValidationRules).length !== 0 && meter.type === 'meter_real') ||
                (Object.keys(virtualValidationRules).length !== 0 && meter.type === 'meter_virtual')) &&
              <div className="edit-buttons" style={{ float: 'right' }}>
                {
                  this.state.editMode ?
                    <span>
                      <button type="submit" className="btn btn-primary" disabled={pristine || submitting}>Submit</button>
                      <button type="button" className="btn btn-link" disabled={submitting} onClick={ this.handleEditSwitch.bind(this) }>Cancel</button>
                    </span> :
                    <button className="btn btn-primary" onClick={ this.handleEditSwitch.bind(this) }>Edit</button>
                }
              </div>
            }
          </div>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'meterUpdateForm',
  enableReinitialize: true,
})(MeterData);
