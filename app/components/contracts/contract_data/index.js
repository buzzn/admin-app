import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { reduxForm } from 'redux-form';
import EditableInput from 'components/editable_input';
import EditableSelect from 'components/editable_select';
import TwoColField from 'components/two_col_field';
import EditableDate from 'components/editable_date';

class ContractData extends React.Component {
  state = { editMode: false };

  handleEditSwitch(event) {
    event.preventDefault();

    const { updateContract, reset, validationRules } = this.props;
    if (!updateContract || Object.keys(validationRules).length === 0) {
      this.setState({ editMode: false });
    }
    this.setState({ editMode: !this.state.editMode });
    reset();
    return false;
  }

  render() {
    const { contract, updateContract, handleSubmit, pristine, submitting, validationRules } = this.props;

    const submit = values =>
      new Promise((resolve, reject) => {
        updateContract({
          contractId: contract.id,
          params: values,
          resolve,
          reject,
        });
      }).then(() => this.setState({ editMode: false }));

    const prefix = 'admin.contracts';

    return (
      <form onSubmit={handleSubmit(submit)}>
        <div className="row">
          <div className="col-12">
            <h5>
              <FormattedMessage id={`${prefix}.headerContractData`} />
            </h5>
            <TwoColField
              prefix={prefix}
              name="contractNumber"
              editMode={this.state.editMode}
              validationRules={validationRules}
              component={EditableInput}
            />
            <TwoColField
              prefix={prefix}
              name="status"
              editMode={this.state.editMode}
              validationRules={validationRules}
              component={EditableInput}
            />
            <TwoColField
              prefix={prefix}
              name="beginDate"
              editMode={this.state.editMode}
              validationRules={validationRules}
              component={EditableDate}
            />
            <TwoColField
              prefix={prefix}
              name="endDate"
              editMode={this.state.editMode}
              validationRules={validationRules}
              component={EditableDate}
            />
            <TwoColField
              prefix={prefix}
              name="signingDate"
              editMode={this.state.editMode}
              validationRules={validationRules}
              component={EditableDate}
            />
            <div className="row">
              <div className="col-6">Signing user will be here</div>
              <div className="col-6">{contract.signingUser}</div>
            </div>
            <TwoColField
              prefix={prefix}
              name="cancelationDate"
              editMode={this.state.editMode}
              validationRules={validationRules}
              component={EditableDate}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            {updateContract &&
              Object.keys(validationRules).length !== 0 && (
                <div className="edit-buttons" style={{ float: 'right' }}>
                  {this.state.editMode ? (
                    <span>
                      <button type="submit" className="btn btn-primary" disabled={pristine || submitting}>
                        Submit
                      </button>
                      <button
                        type="button"
                        className="btn btn-link"
                        disabled={submitting}
                        onClick={this.handleEditSwitch.bind(this)}
                      >
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <button className="btn btn-primary" onClick={this.handleEditSwitch.bind(this)}>
                      Edit
                    </button>
                  )}
                </div>
              )}
          </div>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'contractUpdateForm',
  enableReinitialize: true,
})(ContractData);
