import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { reduxForm } from 'redux-form';
import EditableInput from 'components/editable_input';
import EditableSelect from 'components/editable_select';
import TwoColField from 'components/two_col_field';
import EditableDate from 'components/editable_date';
import EditableCheckbox from 'components/editable_checkbox';

export class RegisterData extends Component {
  static propTypes = {
    register: PropTypes.object.isRequired,
    updateRegister: PropTypes.func,
    validationRules: PropTypes.object.isRequired,
    groupId: PropTypes.string.isRequired,
  };

  state = {
    editMode: false,
  };

  handleEditSwitch(event) {
    event.preventDefault();

    const { updateRegister, reset, validationRules } = this.props;
    if (!updateRegister || Object.keys(validationRules).length === 0) {
      this.setState({ editMode: false });
    }
    this.setState({ editMode: !this.state.editMode });
    reset();
    return false;
  }

  render() {
    const {
      register,
      updateRegister,
      handleSubmit,
      pristine,
      submitting,
      groupId,
      validationRules,
    } = this.props;

    if (register.status === 404) return (<div>Register not found</div>);

    const submit = values => new Promise((resolve, reject) => {
      updateRegister({
        registerId: register.id,
        params: values,
        resolve,
        reject,
        groupId,
      });
    })
    .then(() => this.setState({ editMode: false }));

    const prefix = 'admin.registers';

    return (
      <form onSubmit={ handleSubmit(submit) }>
        <div className="row">
          <div className="col-12">
            <h5><FormattedMessage id={ `${prefix}.headerRegisterData` }/></h5>
            <TwoColField
              prefix={ prefix }
              name="meteringPointId"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              component={ EditableInput }
            />
            <TwoColField
              prefix={ prefix }
              name="type"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              component={ EditableSelect }
            />
            <TwoColField
              prefix={ prefix }
              name="name"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              component={ EditableInput }
            />
            <TwoColField
              prefix={ prefix }
              name="label"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              component={ EditableSelect }
            />
            <TwoColField
              prefix={ prefix }
              name="direction"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              component={ EditableSelect }
            />
            <TwoColField
              prefix={ prefix }
              name="obis"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              component={ EditableInput }
            />
            <TwoColField
              prefix={ prefix }
              name="preDecimalPositions"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              component={ EditableInput }
            />
            <TwoColField
              prefix={ prefix }
              name="postDecimalPositions"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              component={ EditableInput }
            />
            <TwoColField
              prefix={ prefix }
              name="lowLoadAbility"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              component={ EditableCheckbox }
            />
            <h5><FormattedMessage id={ `${prefix}.headerObservation` }/></h5>
            <TwoColField
              prefix={ prefix }
              name="observerEnabled"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              component={ EditableCheckbox }
            />
            <TwoColField
              prefix={ prefix }
              name="observerMinThreshold"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              component={ EditableInput }
            />
            <TwoColField
              prefix={ prefix }
              name="observerMaxThreshold"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              component={ EditableInput }
            />
            <TwoColField
              prefix={ prefix }
              name="observerOfflineMonitoring"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              component={ EditableCheckbox }
            />
            <div className="row" style={{ height: '40px' }}>
              <div className="col-6">
                <FormattedMessage id={ `${prefix}.lastObserved` } />:
              </div>
              <div className="col-6">
                { register.lastObserved }
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            {
              updateRegister && Object.keys(validationRules).length !== 0 &&
              <div className="edit-buttons" style={{ float: 'right' }}>
                {
                  this.state.editMode ?
                    <span>
                      <button type="submit" className="btn btn-primary" disabled={pristine || submitting}>Submit</button>
                      <button type="button" className="btn btn-link" disabled={submitting} onClick={::this.handleEditSwitch}>Cancel</button>
                    </span> :
                    <button className="btn btn-primary" onClick={::this.handleEditSwitch}>Edit</button>
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
  form: 'registerUpdateForm',
  enableReinitialize: true,
})(RegisterData);
