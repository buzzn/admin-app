import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import pick from 'lodash/pick';
import Meters from 'meters';
import EditableInput from 'components/editable_input';

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
    const { loading, meter, updateMeter, handleSubmit, pristine, submitting, groupId } = this.props;

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
            'type',
            'meterSize',
            'directionLabel',
          ]),
          resolve,
          reject,
          groupId,
        });
      })
      .then(() => this.setState({ editMode: false }));
    };

    return (
      <form onSubmit={ handleSubmit(submit) }>
        <div className="row">
          <div className="col-6">
            <div className="row">
              <div className="col-6">Meter number:</div>
              <div className="col-6">
                <Field name="manufacturerProductSerialnumber" editMode={ this.state.editMode } component={ EditableInput }/>
              </div>
            </div>
            <div className="row">
              <div className="col-6">Manufacturer:</div>
              <div className="col-6">
                <Field name="manufacturerName" editMode={ this.state.editMode } component={ EditableInput }/>
              </div>
            </div>
            <div className="row">
              <div className="col-6">Type:</div>
              <div className="col-6">
                <Field name="manufacturerProductName" editMode={ this.state.editMode } component={ EditableInput }/>
              </div>
            </div>
            <div className="row">
              <div className="col-6">Owner:</div>
              <div className="col-6">
                <Field name="ownership" editMode={ this.state.editMode } component={ EditableInput }/>
              </div>
            </div>
            <div className="row">
              <div className="col-6">Type:</div>
              <div className="col-6">
                <Field name="type" editMode={ this.state.editMode } component={ EditableInput }/>
              </div>
            </div>
            <div className="row">
              <div className="col-6">Size:</div>
              <div className="col-6">
                <Field name="meterSize" editMode={ this.state.editMode } component={ EditableInput }/>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="row">
              <div className="col-6">Metering point id:</div>
              <div className="col-6"></div>
            </div>
            <div className="row">
              <div className="col-6">Label:</div>
              <div className="col-6">
                <Field name="directionLabel" editMode={ this.state.editMode } component={ EditableInput }/>
              </div>
            </div>
            <div className="row">
              <div className="col-6">Energy:</div>
              <div className="col-6"></div>
            </div>
            <div className="row">
              <div className="col-6">Manufactured in:</div>
              <div className="col-6">{ meter.buildYear }</div>
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
  };
}

export default connect(mapStateToProps, {
  loadMeter: Meters.actions.loadMeter,
  updateMeter: Meters.actions.updateMeter,
})(reduxForm({
  form: 'meterUpdateForm',
  enableReinitialize: true,
})(MeterData));
