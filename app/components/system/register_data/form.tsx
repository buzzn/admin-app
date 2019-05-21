import * as React from 'react';
// import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { reduxForm } from 'redux-form';
import Alert from 'react-s-alert';
import withEditOverlay from 'components/with_edit_overlay';
import FormPanel from 'components/form_panel';
import { FormTitle } from 'components/style';
import EditableInput from 'components/editable_input';
import EditableSelect from 'components/editable_select';
import EditableCheckbox from 'components/editable_checkbox';
import TwoColView from 'components/two_col_view';
import TwoColField from 'components/two_col_field';
import { numberNormalizer } from 'validation_normalizers';

interface Props {
  register: any;
  meter: any;
  url: string;
  editMode: boolean;
  switchEditMode: () => void;
  updateRegisterMeta: Function;
  handleSubmit: Function;
  pristine: boolean;
  reset: Function;
  submitting: boolean;
  groupId: string;
  validationRules: any;
}

class RegisterData extends React.Component<Props> {
  render() {
    const {
      register,
      meter,
      // url,
      editMode,
      switchEditMode,
      updateRegisterMeta,
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
      // FIXME: refactor this asap
      updateRegisterMeta({
        registerId: register.registerMeta.id,
        meterId: meter.id,
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
              <FormattedMessage id={`${prefix}.headerRegisterDetails`} />
              {!editMode && register.updatable && <i className="buzzn-pencil" onClick={switchEditMode} />}
            </FormTitle>
            <TwoColView {...{ prefix, field: 'obis' }}>
              {register.obis}
            </TwoColView>
            <TwoColField
              {...{
                prefix,
                name: 'label',
                editMode,
                validationRules,
                component: EditableSelect,
              }}
            />
            <TwoColView {...{ prefix, field: 'direction' }}>
              {register.direction}
            </TwoColView>
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
            <TwoColView {...{ prefix: 'admin.meters', field: 'productSerialnumber' }}>
              {meter.productSerialnumber}
            </TwoColView>
            <TwoColView {...{ prefix, field: 'shareGroup' }}>{register.shareWithGroup ? 'Yes' : 'No'}</TwoColView>
            <TwoColView {...{ prefix, field: 'sharePublicly' }}>{register.sharePublicly ? 'Yes' : 'No'}</TwoColView>
            <p className="h5 grey-underline header" style={{ marginTop: '2rem' }}>
              <FormattedMessage id="admin.registers.headerEdifactInformation" />
            </p>
            <TwoColView {...{ prefix, field: 'postDecimalPosition' }}>{register.postDecimalPosition}</TwoColView>
            <TwoColView {...{ prefix, field: 'preDecimalPosition' }}>{register.preDecimalPosition}</TwoColView>
            <TwoColView {...{ prefix, field: 'lowLoadAbility' }}>{register.lowLoadAbility ? 'Yes' : 'No'}</TwoColView>
          </FormPanel>
        </form>
      </div>
    );
  }
}

export default withEditOverlay(reduxForm({ form: 'registerUpdateForm', enableReinitialize: true })(RegisterData));
