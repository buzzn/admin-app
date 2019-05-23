import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { reduxForm } from 'redux-form';
import Select from 'react-select';
import Alert from 'react-s-alert';

import Loading from 'components/loading';
import withEditOverlay from 'components/with_edit_overlay';
import FormPanel from 'components/form_panel';
import { FormTitle } from 'components/style';
import { mainStyle } from 'components/react_select_styles';
import EditableInput from 'components/editable_input';
import EditableSelect from 'components/editable_select';
import EditableCheckbox from 'components/editable_checkbox';
import TwoColView from 'components/two_col_view';
import TwoColField from 'components/two_col_field';
import { numberNormalizer } from 'validation_normalizers';

interface Props {
  register: any;
  marketLocations: any;
  meter: any;
  url: string;
  editMode: boolean;
  switchEditMode: () => void;
  loadingMarketLocations: boolean;
  loadMeter: Function;
  loadMarketLocations: Function;
  updateRegister: Function;
  updateRegisterMeta: Function;
  handleSubmit: Function;
  pristine: boolean;
  reset: Function;
  submitting: boolean;
  groupId: string;
  validationRules: any;
}

const RegisterData: React.FC<Props> = ({
  loadingMarketLocations,
  marketLocations,
  register,
  meter,
  // url,
  editMode,
  switchEditMode,
  loadMeter,
  loadMarketLocations,
  updateRegister,
  updateRegisterMeta,
  handleSubmit,
  pristine,
  reset,
  submitting,
  groupId,
  validationRules,
}) => {
  const prefix = 'admin.registers';

  const [malo, setMalo] = useState({ value: '', label: '' });

  useEffect(() => {
    if (register.registerMeta) {
      setMalo({ value: register.registerMeta.id, label: register.registerMeta.name });
    } else {
      setMalo({ value: 'new', label: 'Create new MaLo' });
    }
  }, [register.updatedAt]);

  const switchEditModeWrap = () => {
    if (!editMode) {
      loadMarketLocations(groupId);
    }
    switchEditMode();
  };

  const submit = values => new Promise((resolve, reject) => {
    const { contracts, ...params } = JSON.parse(JSON.stringify(values));
    // FIXME: refactor this asap
    if (register.registerMeta && !['new', 'unassign'].includes(malo.value) && malo.value === register.registerMeta.id) {
      updateRegisterMeta({
        registerId: register.registerMeta.id,
        meterId: meter.id,
        params,
        resolve,
        reject,
        groupId,
      });
    } else {
      updateRegister({
        groupId,
        meterId: meter.id,
        registerId: register.id,
        params:
            malo.value === 'unassign'
              ? { updatedAt: register.updatedAt }
              : {
                meta: malo.value === 'new' ? { ...params } : { id: malo.value },
                updatedAt: register.updatedAt,
              },
        resolve,
        reject,
      });
    }
  })
    .then(() => {
      Alert.success('Saved!');
      switchEditModeWrap();
      loadMeter({ groupId, meterId: meter.id });
    })
    .catch((err) => {
      if (err.errors && err.errors.meta) Alert.error(JSON.stringify(err.errors.meta[0]));
    });

  const maloOptions = register.registerMeta
    ? [{ value: 'unassign', label: 'Unassign MaLo' }, { value: 'new', label: 'Create new MaLo' }]
    : [{ value: 'new', label: 'Create new MaLo' }];

  return (
    <div>
      <form onSubmit={handleSubmit(submit)}>
        <FormPanel
          {...{
            editMode,
            dirty: !pristine,
            onCancel: () => {
              reset();
              switchEditModeWrap();
            },
            cancelDisabled: submitting,
            onSave: handleSubmit(submit),
            // FIXME
            saveDisabled: submitting,
          }}
        >
          <FormTitle>
            <FormattedMessage id={`${prefix}.headerRegisterDetails`} />
            {!editMode && register.updatable && <i className="buzzn-pencil" onClick={switchEditModeWrap} />}
          </FormTitle>
          {editMode && (
            <React.Fragment>
              {loadingMarketLocations ? (
                <Loading minHeight={10} />
              ) : (
                <Select
                  {...{
                    options: maloOptions.concat(marketLocations.array.map(m => ({ value: m.id, label: m.name }))),
                    value: malo,
                    styles: mainStyle,
                    onChange: value => setMalo(value),
                  }}
                />
              )}
            </React.Fragment>
          )}
          <TwoColView {...{ prefix, field: 'obis' }}>{register.obis}</TwoColView>
          <TwoColField
            {...{
              prefix,
              name: 'label',
              editMode,
              validationRules,
              component: EditableSelect,
            }}
          />
          <TwoColView {...{ prefix, field: 'direction' }}>{register.direction}</TwoColView>
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
};

export default withEditOverlay(reduxForm({ form: 'registerUpdateForm', enableReinitialize: true })(RegisterData));
