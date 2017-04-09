import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import pick from 'lodash/pick';
import EditableInput from 'components/editable_input';

class Bank extends Component {
  static propTypes = {
    bank: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    updateBankAccount: PropTypes.func,
  };

  static defaultProps = {
    bank: {},
  };

  state = {
    editMode: false,
  };

  handleEditSwitch(event) {
    event.preventDefault();

    const { updateBankAccount, reset } = this.props;
    if (!updateBankAccount) {
      this.setState({ editMode: false });
    }
    this.setState({ editMode: !this.state.editMode });
    reset();
    return false;
  }

  render() {
    const { loading, bank, updateBankAccount, handleSubmit, pristine, submitting } = this.props;

    if (loading) return (<div>Loading...</div>);

    if (!bank.id) return (<div></div>);

    const submit = (values) => {
      return new Promise((resolve, reject) => {
        updateBankAccount({ bankAccountId: bank.id, params: pick(values, ['iban']), resolve, reject });
      })
      .then(() => this.setState({ editMode: false }));
    };

    return (
      <form onSubmit={ handleSubmit(submit) }>
        <div className="row">
          <div className="col-6">
            <div className="row">
              <div className="col-6">Name:</div>
              <div className="col-6">
                { bank.attributes.bankName }
              </div>
            </div>
            <div className="row">
              <div className="col-6">BIC:</div>
              <div className="col-6">
                { bank.attributes.bic }
              </div>
            </div>
            <div className="row">
              <div className="col-6">IBAN:</div>
              <div className="col-6">
                <Field name="iban" editMode={ this.state.editMode } component={ EditableInput }/>
              </div>
            </div>
          </div>
          <div className="col-6">
            {
              updateBankAccount &&
              <div className="edit-buttons">
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

export default reduxForm({
  form: 'bankAccountUpdateForm',
  enableReinitialize: true,
})(Bank);
