import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import pick from 'lodash/pick';
import EditableInput from 'components/editable_input';
import EditableSelect from 'components/editable_select';
import TwoColField from 'components/two_col_field';

export class ContactInfo extends Component {
  static propTypes = {
    userMe: PropTypes.object.isRequired,
    updateUserMe: PropTypes.func,
    userMeValidationRules: PropTypes.object.isRequired,
  };

  state = {
    editMode: false,
  };

  handleEditSwitch(event) {
    event.preventDefault();

    const { updateUserMe, reset, userMeValidationRules } = this.props;
    if (!updateUserMe || Object.keys(userMeValidationRules).length === 0) {
      this.setState({ editMode: false });
    }
    this.setState({ editMode: !this.state.editMode });
    reset();
    return false;
  }

  render() {
    const { userMe, updateUserMe, handleSubmit, pristine, submitting, userMeValidationRules } = this.props;

    const submit = values => new Promise((resolve, reject) => {
      updateUserMe({
        params: {
          ...pick(values, ['prefix', 'title', 'firstName', 'lastName', 'phone']),
          updatedAt: userMe.updatedAt,
        },
        resolve,
        reject,
      });
    })
      .then(() => this.setState({ editMode: false }));

    const personPrefix = 'admin.persons';
    const addressPrefix = 'admin.addresses';

    return (
      <form onSubmit={ handleSubmit(submit) }>
        <div className="row">
          <div className="col-12">
            <TwoColField
              prefix={personPrefix}
              name="prefix"
              editMode={this.state.editMode}
              validationRules={userMeValidationRules}
              component={EditableSelect}
            />
            <TwoColField
              prefix={personPrefix}
              name="title"
              editMode={this.state.editMode}
              validationRules={userMeValidationRules}
              component={EditableSelect}
            />
            <TwoColField
              prefix={personPrefix}
              name="firstName"
              editMode={this.state.editMode}
              validationRules={userMeValidationRules}
              component={EditableInput}
            />
            <TwoColField
              prefix={personPrefix}
              name="lastName"
              editMode={this.state.editMode}
              validationRules={userMeValidationRules}
              component={EditableInput}
            />
            <TwoColField
              prefix={personPrefix}
              name="phone"
              editMode={this.state.editMode}
              validationRules={userMeValidationRules}
              component={EditableInput}
            />
            <div className="row" style={{ minHeight: '40px' }}>
              <div className="col-6">
                <FormattedMessage id={ `${addressPrefix}.street` } />:
              </div>
              <div className="col-6">
                { (userMe.address || {}).street }
              </div>
            </div>
            <div className="row" style={{ minHeight: '40px' }}>
              <div className="col-6">
                <FormattedMessage id={ `${addressPrefix}.zip` } />:
              </div>
              <div className="col-6">
                { (userMe.address || {}).zip }
              </div>
            </div>
            <div className="row" style={{ minHeight: '40px' }}>
              <div className="col-6">
                <FormattedMessage id={ `${addressPrefix}.city` } />:
              </div>
              <div className="col-6">
                { (userMe.address || {}).city }
              </div>
            </div>
            <div className="row" style={{ minHeight: '40px' }}>
              <div className="col-6">
                <FormattedMessage id={ `${addressPrefix}.country` } />:
              </div>
              <div className="col-6">
                { (userMe.address || {}).country }
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            {
              updateUserMe && userMe.updatable && Object.keys(userMeValidationRules).length !== 0 &&
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
  form: 'myProfileUpdateForm',
  enableReinitialize: true,
})(ContactInfo);
