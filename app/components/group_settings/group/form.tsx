import * as React from 'react';
import { reduxForm } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Col, Row } from 'reactstrap';
import Alert from 'react-s-alert';
import withEditOverlay from 'components/with_edit_overlay';
import FormPanel from 'components/form_panel';
import TwoColField from 'components/two_col_field';
import EditableInput from 'components/editable_input';
import EditableDate from 'components/editable_date';
import EditableCheckbox from 'components/editable_checkbox';
import { dateNormalizer, numberNormalizer } from 'validation_normalizers';
import { DeleteButton } from 'components/style';

interface Props {
  editMode: boolean;
  switchEditMode: () => void;
  reset: () => void;
  pristine: boolean;
  submitting: boolean;
  handleSubmit: Function;
  group: { [key: string]: any };
  deleteGroup: Function;
  updateGroup: Function;
  address: { [key: string]: any };
  transmissionSystemOperator: { [key: string]: any };
  distributionSystemOperator: { [key: string]: any };
  electricitySupplier: { [key: string]: any };
  validationRules: any;
}

const Form = ({
  handleSubmit,
  pristine,
  reset,
  submitting,
  validationRules,
  updateGroup,
  group,
  deleteGroup,
  transmissionSystemOperator,
  distributionSystemOperator,
  electricitySupplier,
  editMode,
  switchEditMode,
}: Props) => {
  const submitForm = values => new Promise((resolve, reject) => {
    const params = JSON.parse(JSON.stringify(values));
    delete params.allowedActions;
    delete params.createables;
    delete params.incompleteness;
    delete params.owner;
    delete params.tariffs;
    delete params.showContact;
    delete params.showEnergy;
    delete params.showObject;
    delete params.showProduction;
    delete params.showDisplayApp;
    params.fakeStats = JSON.stringify(params.fakeStats);
    updateGroup({
      groupId: group.id,
      params,
      resolve,
      reject,
    });
  }).then(() => {
    Alert.success('Saved!');
    switchEditMode();
  });

  const prefix = 'admin.groups';
  const addressPrefix = 'admin.addresses';

  return (
    <Col xs="12">
      <form onSubmit={handleSubmit(submitForm)}>
        <p className="h5 grey-underline header text-uppercase">
          <FormattedMessage id={`${prefix}.headerGroup`} />
          {!editMode && group.updatable && (
            <i
              data-cy="group edit switch"
              className="buzzn-pencil"
              style={{ float: 'right' }}
              onClick={switchEditMode}
            />
          )}
        </p>
        <FormPanel
          {...{
            editMode,
            dirty: !pristine,
            onCancel: () => {
              reset();
              switchEditMode();
            },
            cancelDisabled: submitting,
            onSave: handleSubmit(submitForm),
            saveDisabled: pristine || submitting,
          }}
        >
          <TwoColField
            {...{
              prefix,
              name: 'name',
              editMode,
              validationRules: validationRules.updateGroup,
              component: EditableInput,
            }}
          />
          <TwoColField
            {...{
              prefix: addressPrefix,
              name: 'address.street',
              editMode,
              validationRules: validationRules.updateGroup,
              component: EditableInput,
            }}
          />
          <TwoColField
            {...{
              prefix: addressPrefix,
              name: 'address.zip',
              editMode,
              validationRules: validationRules.updateGroup,
              component: EditableInput,
            }}
          />
          <TwoColField
            {...{
              prefix: addressPrefix,
              name: 'address.city',
              editMode,
              validationRules: validationRules.updateGroup,
              component: EditableInput,
            }}
          />
          <TwoColField
            {...{
              prefix,
              name: 'startDate',
              editMode,
              validationRules,
              component: EditableDate,
              normalize: dateNormalizer('YYYY-MM-DD'),
            }}
          />
          <Row className="fieldgroup">
            <Col xs="4" className="fieldname">
              <FormattedMessage id={`${prefix}.transmissionSystemOperator`} />
            </Col>
            <Col xs="8" className="grey-underline fieldvalue">
              {transmissionSystemOperator.name}
            </Col>
          </Row>
          <Row className="fieldgroup">
            <Col xs="4" className="fieldname">
              <FormattedMessage id={`${prefix}.distributionSystemOperator`} />
            </Col>
            <Col xs="8" className="grey-underline fieldvalue">
              {distributionSystemOperator.name}
            </Col>
          </Row>
          <Row className="fieldgroup">
            <Col xs="4" className="fieldname">
              <FormattedMessage id={`${prefix}.electricitySupplier`} />
            </Col>
            <Col xs="8" className="grey-underline fieldvalue">
              {electricitySupplier.name}
            </Col>
          </Row>
          <TwoColField
            {...{
              prefix,
              name: 'legacyPowerTakerContractBuzznid',
              editMode,
              validationRules: validationRules.updateGroup,
              component: EditableInput,
            }}
          />
          <TwoColField
            {...{
              prefix,
              name: 'legacyPowerGiverContractBuzznid',
              editMode,
              validationRules: validationRules.updateGroup,
              component: EditableInput,
            }}
          />
          <TwoColField
            {...{
              prefix,
              name: 'billingDetail.automaticAbschlagAdjust',
              editMode,
              validationRules: validationRules.updateGroup,
              component: EditableCheckbox,
            }}
          />
          <TwoColField
            {...{
              prefix,
              name: 'billingDetail.automaticAbschlagThresholdCents',
              editMode,
              validationRules: validationRules.updateGroup,
              component: EditableInput,
              normalize: numberNormalizer,
            }}
          />
          <TwoColField
            {...{
              prefix,
              name: 'billingDetail.issuesVat',
              editMode,
              validationRules: validationRules.updateGroup,
              component: EditableCheckbox,
            }}
          />
          {editMode && group.deletable && (
            <Row>
              <Col xs="12">
                <br />
                <DeleteButton
                  data-cy="group delete button"
                  className="btn btn-primary"
                  onClick={() => {
                    switchEditMode();
                    deleteGroup();
                  }}
                >
                  <FormattedMessage id="admin.buttons.delete" />
                </DeleteButton>
              </Col>
            </Row>
          )}
        </FormPanel>
      </form>
    </Col>
  );
};

export default reduxForm({
  form: 'groupUpdateForm',
  enableReinitialize: true,
})(withEditOverlay(Form));
