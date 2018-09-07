import * as React from 'react';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { Row, Col } from 'reactstrap';
import { reduxForm } from 'redux-form';
import Alert from 'react-s-alert';
import PageTitle from 'components/page_title';
import { BreadcrumbsProps } from 'components/breadcrumbs';
import withEditOverlay from 'components/with_edit_overlay';
import FormPanel from 'components/form_panel';
import TwoColField from 'components/two_col_field';
import EditableInput from 'components/editable_input';
import EditableSelect from 'components/editable_select';
import EditableDate from 'components/editable_date';
import { dateNormalizer, numberNormalizer } from 'validation_normalizers';
import { CenterContent } from 'components/style';

interface Props {
  device: { _status: null | number; [key: string]: any };
  updateDevice: Function;
  groupId: string;
  validationRules: any;
}

const Device = ({
  device,
  handleSubmit,
  editMode,
  switchEditMode,
  pristine,
  reset,
  submitting,
  validationRules,
  updateDevice,
  groupId,
  breadcrumbs,
  intl,
}: Props & InjectedIntlProps & BreadcrumbsProps) => {
  const prefix = 'admin.devices';
  const submit = params => new Promise((resolve, reject) => {
    updateDevice({
      groupId,
      deviceId: device.id,
      resolve,
      reject,
      params,
    });
  }).then(() => {
    Alert.success('Saved!');
    switchEditMode();
  });

  return (
    <React.Fragment>
      <PageTitle
        {...{
          breadcrumbs: breadcrumbs.concat([
            { id: '-----', title: intl.formatMessage({ id: 'admin.breadcrumbs.device' }) },
          ]),
          title: intl.formatMessage({ id: 'admin.breadcrumbs.device' }),
        }}
      />
      <CenterContent>
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
            <Row>
              <Col xs="12">
                <h5 className="grey-underline mt-5 pb-2">
                  <FormattedMessage id={`${prefix}.headerDeviceDetails`} />
                  {!editMode
                    && device.updatable && (
                      <i
                        data-cy="group edit switch"
                        className="buzzn-pencil"
                        style={{ float: 'right' }}
                        onClick={switchEditMode}
                      />
                  )}
                </h5>
                <TwoColField
                  {...{
                    prefix,
                    name: 'primaryEnergy',
                    editMode,
                    validationRules,
                    component: EditableSelect,
                  }}
                />
                <TwoColField
                  {...{
                    prefix,
                    name: 'commissioning',
                    editMode,
                    validationRules,
                    component: EditableDate,
                    normalize: dateNormalizer('YYYY-MM-DD'),
                  }}
                />
                <TwoColField
                  {...{
                    prefix,
                    name: 'law',
                    editMode,
                    validationRules,
                    component: EditableSelect,
                  }}
                />
                <TwoColField
                  {...{
                    prefix,
                    name: 'manufacturer',
                    editMode,
                    validationRules,
                    component: EditableInput,
                  }}
                />
                <TwoColField
                  {...{
                    prefix,
                    name: 'model',
                    editMode,
                    validationRules,
                    component: EditableInput,
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
                    name: 'kwPeak',
                    editMode,
                    validationRules,
                    component: EditableInput,
                    normalize: numberNormalizer,
                  }}
                />
                <TwoColField
                  {...{
                    prefix,
                    name: 'kwhPerAnnum',
                    editMode,
                    validationRules,
                    component: EditableInput,
                    normalize: numberNormalizer,
                  }}
                />
              </Col>
            </Row>
          </FormPanel>
        </form>
      </CenterContent>
    </React.Fragment>
  );
};

export default injectIntl(withEditOverlay(reduxForm({ form: 'deviceUpdateForm', enableReinitialize: true })(Device)));
