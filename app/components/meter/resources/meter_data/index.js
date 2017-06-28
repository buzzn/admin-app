import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { Field, reduxForm } from 'redux-form';
import pick from 'lodash/pick';
import range from 'lodash/range';
import reduce from 'lodash/reduce';
import Meters from 'meters';
import EditableInput from 'components/editable_input';
import EditableSelect from 'components/editable_select';

export class MeterData extends Component {
  static propTypes = {
    meter: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    loadMeter: PropTypes.func.isRequired,
    updateMeter: PropTypes.func,
  };

  state = {
    editMode: false,
  };

  handleEditSwitch(event) {
    event.preventDefault();

    const { updateMeter, reset } = this.props;
    if (!updateMeter) {
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
    const { loading, meter, updateMeter, handleSubmit, pristine, submitting, groupId, intl } = this.props;

    if (meter.status === 404) return (<div>Meter not found</div>);

    if (loading || !meter.id) return (<div>Loading...</div>);

    const submit = (values) => {
      return new Promise((resolve, reject) => {
        updateMeter({
          meterId: meter.id,
          params: pick(values, [
            'manufacturerProductSerialnumber',
            'manufacturerName',
            'manufacturerProductName',
            'ownership',
            'meteringType',
            'meterSize',
            // 'buildYear',
          ]),
          resolve,
          reject,
          groupId,
        });
      })
      .then(() => this.setState({ editMode: false }));
    };

    const meteringTypeRawOptions = [
      { value: 'analog_household_meter', label: 'Analog household meter' },
      { value: 'digital_household_meter', label: 'Digital household meter' },
      { value: 'smart_meter', label: 'Smart meter' },
      { value: 'load_meter', label: 'Load meter' },
      { value: 'analog_ac_meter', label: 'Analog AC meter' },
      { value: 'maximum_meter', label: 'Maximum meter' },
      { value: 'individual_adjustment', label: 'Individual adjustment' },
    ];

    const meteringTypeMessages = defineMessages(reduce(meteringTypeRawOptions, (s, v) => ({ ...s,
      [v.value]: {
        id: `admin.meters.${v.value}`,
      } }), {}));

    const meteringTypeOptions = meteringTypeRawOptions.map(m => ({ ...m, label: intl.formatMessage(meteringTypeMessages[m.value]) }));

    return (
      <form onSubmit={ handleSubmit(submit) }>
        <div className="row">
          <div className="col-6">
            <div className="row">
              <div className="col-6">
                <FormattedMessage
                  id="admin.meters.manufacturerProductSerialnumber"
                  description="Meter serial number"
                  defaultMessage="Serial number:" />
              </div>
              <div className="col-6">
                <Field name="manufacturerProductSerialnumber" editMode={ this.state.editMode } component={ EditableInput }/>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <FormattedMessage
                  id="admin.meters.manufacturerName"
                  description="Meter manufacturer"
                  defaultMessage="Manufacturer name:" />
              </div>
              <div className="col-6">
                <Field name="manufacturerName" editMode={ this.state.editMode } options={[
                  { value: 'easy_meter', label: 'Easy meter' },
                  { value: 'amperix', label: 'Amperix' },
                  { value: 'ferraris', label: 'Ferraris' },
                  { value: 'other', label: 'Other' },
                ]} component={ EditableSelect }/>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <FormattedMessage
                  id="admin.meters.manufacturerProductName"
                  description="Meter product name"
                  defaultMessage="Product name:" />
              </div>
              <div className="col-6">
                <Field name="manufacturerProductName" editMode={ this.state.editMode } component={ EditableInput }/>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <FormattedMessage
                  id="admin.meters.ownership"
                  description="Meter owner"
                  defaultMessage="Ownership:" />
              </div>
              <div className="col-6">
                <Field name="ownership" editMode={ this.state.editMode } options={[
                  { value: 'buzzn_systems', label: 'BUZZN systems' },
                  { value: 'foreign_ownership', label: 'Foreign' },
                  { value: 'customer', label: 'Customer' },
                  { value: 'leased', label: 'Leased' },
                  { value: 'bought', label: 'Bought' },
                ]} component={ EditableSelect }/>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <FormattedMessage
                  id="admin.meters.meteringType"
                  description="Meter type"
                  defaultMessage="Meter type:" />
              </div>
              <div className="col-6">
                <Field name="meteringType" editMode={ this.state.editMode } options={ meteringTypeOptions } component={ EditableSelect }/>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <FormattedMessage
                  id="admin.meters.meterSize"
                  description="Meter size"
                  defaultMessage="Meter size:" />
              </div>
              <div className="col-6">
                <Field name="meterSize" editMode={ this.state.editMode } options={[
                  { value: 'edl40', label: 'EDL 40' },
                  { value: 'edl21', label: 'EDL 21' },
                  { value: 'other_ehz', label: 'Other' },
                ]} component={ EditableSelect }/>
              </div>
            </div>
            <div className="row">
              <div className="col-6">Label:</div>
              <div className="col-6">
                { meter.directionLabel }
              </div>
            </div>
            {/*<div className="row">*/}
              {/*<div className="col-6">Manufactured in:</div>*/}
              {/*<div className="col-6">*/}
                {/*<Field*/}
                  {/*name="buildYear"*/}
                  {/*editMode={ this.state.editMode }*/}
                  {/*options={ range(1990, (new Date()).getFullYear() + 1).map(y => ({ value: y, label: y })) }*/}
                  {/*component={ EditableSelect }/>*/}
              {/*</div>*/}
            {/*</div>*/}
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
  };
}

export default connect(mapStateToProps, {
  loadMeter: Meters.actions.loadMeter,
  updateMeter: Meters.actions.updateMeter,
})(reduxForm({
  form: 'meterUpdateForm',
  enableReinitialize: true,
})(injectIntl(MeterData)));
