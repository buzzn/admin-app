import React from 'react';
import { reduxForm } from 'redux-form';
import { Row, Col } from 'reactstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import FieldValidationWrapper from 'components/field_validation_wrapper';
import FieldInput from 'components/field_input';
import EditableCheckbox from 'components/editable_checkbox';
import { NestedDetailsWrapper } from 'components/style';

const EditBankAccount = ({ validationRules, handleCancel, updateBankAccount, handleSubmit }) => {
  const prefix = 'admin.bankAccounts';

  const submit = params => new Promise((resolve, reject) => {
    updateBankAccount({ params, resolve, reject });
  }).then(handleCancel);

  return (
    <NestedDetailsWrapper>
      <form onSubmit={handleSubmit(submit)}>
        <Row>
          <Col xs={4}>
            <FieldValidationWrapper
              {...{
                name: 'holder',
                type: 'text',
                label: <FormattedMessage id={`${prefix}.holder`} />,
                component: FieldInput,
                validationRules,
              }}
            />
          </Col>
          <Col xs={4}>
            <FieldValidationWrapper
              {...{
                name: 'bic',
                type: 'text',
                label: <FormattedMessage id={`${prefix}.bic`} />,
                component: FieldInput,
                validationRules,
              }}
            />
          </Col>
          <Col xs={4}>
            <FieldValidationWrapper
              {...{
                name: 'iban',
                type: 'text',
                label: <FormattedMessage id={`${prefix}.iban`} />,
                component: FieldInput,
                validationRules,
              }}
            />
          </Col>
          <Col xs={4}>
            <FieldValidationWrapper
              {...{
                name: 'bankName',
                type: 'text',
                label: <FormattedMessage id={`${prefix}.bankName`} />,
                component: FieldInput,
                validationRules,
              }}
            />
          </Col>
          <Col xs={4}>
            <FieldValidationWrapper
              {...{
                name: 'directDebit',
                editMode: true,
                label: <FormattedMessage id={`${prefix}.directDebit`} />,
                component: EditableCheckbox,
                validationRules,
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
})(injectIntl(EditBankAccount));
