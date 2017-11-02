import * as React from 'react';
import { reduxForm } from 'redux-form';
import type { FormProps } from 'redux-form';
import EditableSelect from 'components/editable_select';
import TwoColField from 'new_components/two_col_field';

type Props = {
  updateFormula: Function,
  formula: Object,
  registers: Array<Object>,
} & FormProps;

type State = {
  editMode: boolean,
};

class FormulaData extends React.Component<Props, State> {
  state = {
    editMode: false,
  };

  handleEditSwitch(event) {
    event.preventDefault();

    const { updateFormula, reset } = this.props;
    if (!updateFormula) {
      this.setState({ editMode: false });
    }
    this.setState({ editMode: !this.state.editMode });
    reset();
    return false;
  }

  render() {
    const { formula, registers, updateFormula, handleSubmit, pristine, submitting } = this.props;

    const submit = values => new Promise((resolve, reject) => {
      updateFormula({
        resolve,
        reject,
        formulaPartId: formula.id,
        params: { ...values, updatedAt: formula.updatedAt },
      });
    })
      .then(() => this.setState({ editMode: false }));

    const prefix = 'admin.formulas';
    const validationRules = {};

    return (
      <form onSubmit={ handleSubmit(submit) }>
        <div className="row p-4 sub-component">
          <div className="col-12">
            <TwoColField
              prefix={ prefix }
              name="operator"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              noValTranslations
              noDefault
              field={ { enum: ['+', '-'] } }
              component={ EditableSelect }
            />
            <TwoColField
              prefix={ prefix }
              name="registerId"
              editMode={ this.state.editMode }
              validationRules={ validationRules }
              noValTranslations
              noDefault
              listOverride={ registers.map(r => ({ value: r.id, label: r.name })) }
              component={ EditableSelect }
            />
          </div>
          <div className="col-12">
            {
              updateFormula &&
              <div className="edit-buttons" style={{ float: 'right', marginBottom: '10px' }}>
                {
                  this.state.editMode ?
                    <span>
                    <button type="submit" className="btn btn-primary" disabled={ pristine || submitting }>Submit</button>
                    <button type="button" className="btn btn-link" disabled={ submitting } onClick={ this.handleEditSwitch.bind(this) }>Cancel</button>
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
  enableReinitialize: true,
})(FormulaData);
