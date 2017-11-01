// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { reduxForm } from 'redux-form';
import type { FormProps } from 'redux-form';
import EditableInput from 'new_components/editable_input';
import EditableSelect from 'new_components/editable_select';
import TwoColField from 'new_components/two_col_field';
import EditableCheckbox from 'components/editable_checkbox';

type Props = {
  updateRegister?: Function,
  validationRules: Object,
  register: Object,
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
      validationRules
    } = this.props;

    const submit = values => new Promise((resolve, reject) => {
      updateRegister({
        registerId: register.id,
        params: values,
        resolve,
        reject,
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
              name="preDecimalPosition"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              component={ EditableInput }
            />
            <TwoColField
              prefix={ prefix }
              name="postDecimalPosition"
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
              updateRegister && Object.keys(validationRules).length !== 0 && register.updatable &&
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
  form: 'registerUpdateForm',
  enableReinitialize: true,
})(MeterData);
