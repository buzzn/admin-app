import * as React from 'react';
import { reduxForm } from 'redux-form';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import EditableInput from 'components/editable_input';
import EditableSelect from 'components/editable_select';
import TwoColField from 'components/two_col_field';

interface Props {
  dirty: boolean;
  handleSubmit: Function;
  validationRules: any;
}

interface State {
  editMode: boolean;
}

class NestedDetails extends React.Component<Props & InjectedIntlProps, State> {
  state = { editMode: false };

  switchEditMode = (event) => {
    const { dirty, intl } = this.props;
    const { editMode } = this.state;
    if (dirty && editMode && confirm(intl.formatMessage({ id: 'admin.messages.cancelDirtyForm' }))) {
      this.setState({ editMode: false });
    } else if (!dirty) {
      this.setState({ editMode: !editMode });
    } else {
      event.currentTarget.blur();
      event.preventDefault();
    }
  };

  render() {
    const { handleSubmit, validationRules } = this.props;
    const { editMode } = this.state;

    const prefix = 'admin.billings';

    return (
      <div>
        <i className="fa fa-2x fa-pencil" onClick={this.switchEditMode} />
        <form onSubmit={handleSubmit}>
          <TwoColField
            {...{
              prefix,
              name: 'invoiceNumber',
              editMode,
              validationRules,
              component: EditableInput,
            }}
          />
          <TwoColField
            {...{
              prefix,
              name: 'status',
              editMode,
              validationRules,
              component: EditableSelect,
            }}
          />
          {editMode && (
            <button className="btn btn-primary" type="submit">
              Save
            </button>
          )}
        </form>
      </div>
    );
  }
}

export default reduxForm({ enableReinitialize: true })(injectIntl(NestedDetails));
