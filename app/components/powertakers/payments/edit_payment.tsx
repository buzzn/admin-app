import React from 'react';
import { reduxForm } from 'redux-form';
import { Row, Col } from 'reactstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import FieldValidationWrapper from 'components/field_validation_wrapper';
import FieldInput from 'components/field_input';
import FieldDate from 'components/field_date';
import EditableSelect from 'components/editable_select';
import { dateNormalizer, numberNormalizer } from 'validation_normalizers';
import { NestedDetailsWrapper } from 'components/style';

const EditPayment = ({ validationRules, handleCancel, updatePayment, handleSubmit }) => {
  const prefix = 'admin.payments';

  const submit = params => new Promise((resolve, reject) => {
    updatePayment({ params, resolve, reject });
  }).then(handleCancel);

  return (
    <NestedDetailsWrapper>
      <form onSubmit={handleSubmit(submit)}>
        <Row>
          <Col xs={3}>
            <FieldValidationWrapper
              {...{
                name: 'beginDate',
                type: 'text',
                label: <FormattedMessage id={`${prefix}.paymentsBeginDate`} />,
                component: FieldDate,
                validationRules,
                normalize: dateNormalizer('YYYY-MM-DD'),
              }}
            />
          </Col>
          <Col xs={3}>
            <FieldValidationWrapper
              {...{
                name: 'energyConsumptionKwhPa',
                type: 'text',
                label: <FormattedMessage id={`${prefix}.paymentsEnergyConsumptionKwhPa`} />,
                component: FieldInput,
                validationRules,
                normalize: numberNormalizer,
              }}
            />
          </Col>
          <Col xs={3}>
            <FieldValidationWrapper
              {...{
                name: 'cycle',
                editMode: true,
                component: EditableSelect,
                validationRules,
                prefix,
                withLabel: true,
              }}
            />
          </Col>
          <Col xs={3}>
            <FieldValidationWrapper
              {...{
                name: 'priceCents',
                type: 'text',
                label: <FormattedMessage id={`${prefix}.paymentsPriceCents`} />,
                component: FieldInput,
                validationRules,
                normalize: numberNormalizer,
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <button className="btn btn-link" onClick={handleCancel}>
              <FormattedMessage id="admin.buttons.cancel" /> <i className="fa fa-times" />
            </button>
            <span id="submit-add-payment">
              <button type="submit" className="btn btn-dark">
                <FormattedMessage id="admin.buttons.save" />
              </button>
            </span>
          </Col>
        </Row>
      </form>
    </NestedDetailsWrapper>
  );
};

export default reduxForm({
  enableReinitialize: true,
  onSubmitSuccess: (_result, _dispatch, { reset }) => {
    reset();
  },
})(injectIntl(EditPayment));
