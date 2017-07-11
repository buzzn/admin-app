import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import pick from 'lodash/pick';
import range from 'lodash/range';
import Meters from 'meters';
import EditableInput from 'components/editable_input';
import EditableSelect from 'components/editable_select';
import TwoColField from 'components/two_col_field';
import EditableDate from 'components/editable_date';
import { dateNormalizer } from 'validation_normalizers';

export class MeterData extends Component {
  static propTypes = {
    meter: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    loadMeter: PropTypes.func.isRequired,
    updateMeter: PropTypes.func,
    validationRules: PropTypes.object.isRequired,
  };

  state = {
    editMode: false,
  };

  handleEditSwitch(event) {
    event.preventDefault();

    const { updateMeter, reset, validationRules } = this.props;
    if (!updateMeter || Object.keys(validationRules).length === 0) {
      this.setState({ editMode: false });
    }
    this.setState({ editMode: !this.state.editMode });
    reset();
    return false;
  }

  componentWillMount() {
    const { meter, loadMeter, loading, meterId, groupId } = this.props;
    if (!meter.id && !loading) loadMeter({ meterId, groupId });
  }

  render() {
    const {
      loading,
      meter,
      updateMeter,
      handleSubmit,
      pristine,
      submitting,
      groupId,
      validationRules,
    } = this.props;

    if (meter.status === 404) return (<div>Meter not found</div>);

    if (loading || !meter.id) return (<div>Loading...</div>);

    const submit = (values) => {
      return new Promise((resolve, reject) => {
        updateMeter({
          meterId: meter.id,
          params: values,
          // params: pick(values, [
          //   'productSerialnumber',
          //   'manufacturerName',
          //   'productName',
          //   'ownership',
          //   'edifactMeteringType',
          //   'edifactMeterSize',
          //   // 'buildYear',
          // ]),
          resolve,
          reject,
          groupId,
        });
      })
      .then(() => this.setState({ editMode: false }));
    };

    const prefix = 'admin.meters';

    return (
      <form onSubmit={ handleSubmit(submit) }>
        <div className="row">
          <div className="col-6">
            <h5><FormattedMessage id={ `${prefix}.headerMeterData` }/></h5>
            <TwoColField
              prefix={ prefix }
              name="section"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              component={ EditableSelect }
            />
            <TwoColField
              prefix={ prefix }
              name="ownership"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              component={ EditableSelect }
            />
            <TwoColField
              prefix={ prefix }
              name="manufacturerName"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              component={ EditableSelect }
            />
            <TwoColField
              prefix={ prefix }
              name="productName"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              component={ EditableInput }
            />
            <TwoColField
              prefix={ prefix }
              name="productSerialnumber"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              component={ EditableInput }
            />
            <TwoColField
              prefix={ prefix }
              name="buildYear"
              editMode={ this.state.editMode }
              noValTranslations={ true }
              field={ { enum: range(1990, (new Date()).getFullYear() + 1).map(y => y) } }
              validationRules={ validationRules }
              component={ EditableSelect }
            />
            <TwoColField
              prefix={ prefix }
              name="calibratedUntil"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              normalize={ dateNormalizer('DD-MM-YYYY') }
              component={ EditableDate }
            />
            <TwoColField
              prefix={ prefix }
              name="sentDataDso"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              normalize={ dateNormalizer('DD-MM-YYYY') }
              component={ EditableDate }
            />
            <h5><FormattedMessage id={ `${prefix}.headerClassification` }/></h5>
            <TwoColField
              prefix={ prefix }
              name="edifactMeteringType"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              component={ EditableSelect }
            />
            <TwoColField
              prefix={ prefix }
              name="directionNumber"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              component={ EditableSelect }
            />
            <TwoColField
              prefix={ prefix }
              name="edifactTariff"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              component={ EditableSelect }
            />
            <TwoColField
              prefix={ prefix }
              name="edifactMeterSize"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              component={ EditableSelect }
            />
            <TwoColField
              prefix={ prefix }
              name="edifactMountingMethod"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              component={ EditableSelect }
            />
            <TwoColField
              prefix={ prefix }
              name="edifactMeasurementMethod"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              component={ EditableSelect }
            />
            <TwoColField
              prefix={ prefix }
              name="edifactVoltageLevel"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              component={ EditableSelect }
            />
            <TwoColField
              prefix={ prefix }
              name="edifactCycleInterval"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              component={ EditableSelect }
            />
            <TwoColField
              prefix={ prefix }
              name="edifactDataLogging"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              component={ EditableSelect }
            />
            <TwoColField
              prefix={ prefix }
              name="converterConstant"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              component={ EditableInput }
            />
            <div className="row">
              <div className="col-6">Label:</div>
              <div className="col-6">
                { meter.directionNumber }
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            {
              updateMeter &&
              <div className="edit-buttons" style={{ float: 'right' }}>
                {
                  this.state.editMode ?
                    <span>
                      <button type="submit" disabled={pristine || submitting}>Submit</button>
                      <button type="button" disabled={submitting} onClick={::this.handleEditSwitch}>Cancel</button>
                    </span> :
                    <button onClick={::this.handleEditSwitch}>Edit</button>
                }
              </div>
            }
          </div>
        </div>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return {
    meter: state.meters.meter,
    loading: state.meters.loadingMeter,
    initialValues: state.meters.meter || {},
    validationRules: state.meters.validationRules,
  };
}

export default connect(mapStateToProps, {
  loadMeter: Meters.actions.loadMeter,
  updateMeter: Meters.actions.updateMeter,
})(reduxForm({
  form: 'meterUpdateForm',
  enableReinitialize: true,
})(MeterData));
