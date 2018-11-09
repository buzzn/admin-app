import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { reduxForm } from 'redux-form';
import Alert from 'react-s-alert';
import withEditOverlay from 'components/with_edit_overlay';
import FormPanel from 'components/form_panel';
import { FormTitle } from 'components/style';
import EditableInput from 'components/editable_input';
import EditableSelect from 'components/editable_select';
import EditableCheckbox from 'components/editable_checkbox';
import TwoColField from 'components/two_col_field';
import { numberNormalizer } from 'validation_normalizers';

interface Props {
  marketLocation: any;
  url: string;
  editMode: boolean;
  switchEditMode: () => void;
  updateRegister: Function;
  handleSubmit: Function;
  pristine: boolean;
  reset: Function;
  submitting: boolean;
  groupId: string;
  validationRules: any;
}

class MarketLocationForm extends React.Component<Props> {
  render() {
    const {
      marketLocation,
      editMode,
      switchEditMode,
      updateRegister,
      handleSubmit,
      pristine,
      reset,
      submitting,
      groupId,
      validationRules,
    } = this.props;

    const prefix = 'admin.registers';

    const submit = values => new Promise((resolve, reject) => {
      const { contracts, ...params } = values;
      updateRegister({
        registerId: marketLocation.id,
        params,
        resolve,
        reject,
        groupId,
      });
    }).then(() => {
      Alert.success('Saved!');
      switchEditMode();
    });

    return (
      <div>
        <form onSubmit={handleSubmit(submit)}>
          <FormPanel
            {...{
              editMode,
              dirty: !pristine,
              onCancel: () => {
                reset();
                switchEditMode();
              },
              cancelDisabled: submitting,
              onSave: handleSubmit(submit),
              saveDisabled: pristine || submitting,
            }}
          >
            <FormTitle>
              <FormattedMessage id={`admin.marketLocations.headerMarketLocationDetails`} />
              {!editMode && marketLocation.updatable && <i className="buzzn-pencil" onClick={switchEditMode} />}
            </FormTitle>
            <TwoColField
              {...{
                prefix,
                name: 'label',
                editMode,
                validationRules,
                component: EditableSelect,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'name',
                editMode,
                validationRules,
                component: EditableInput,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'observerEnabled',
                editMode,
                validationRules,
                component: EditableCheckbox,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'observerMinThreshold',
                editMode,
                validationRules,
                component: EditableInput,
                normalize: numberNormalizer,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'observerMaxThreshold',
                editMode,
                validationRules,
                component: EditableInput,
                normalize: numberNormalizer,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'observerOfflineMonitoring',
                editMode,
                validationRules,
                component: EditableCheckbox,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'marketLocationId',
                editMode,
                validationRules,
                component: EditableInput,
              }}
            />
          </FormPanel>
        </form>
      </div>
    );
  }
}

export default withEditOverlay(reduxForm({ form: 'marketLocationUpdateForm', enableReinitialize: true })(MarketLocationForm));
