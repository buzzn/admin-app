import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';
import { reduxForm } from 'redux-form';
import FieldValidationWrapper from 'components/field_validation_wrapper';
import FieldInput from 'components/field_input';
import EditableCheckbox from 'components/editable_checkbox';

const AddBankAccount = ({
  isOpen,
  toggle,
  pristine,
  reset,
  intl,
  validationRules,
  handleSubmit,
  addBankAccount,
  reloadCb,
}) => {
  const prefix = 'admin.bankAccounts';

  const handleToggle = (event) => {
    if (!pristine && confirm(intl.formatMessage({ id: 'admin.messages.cancelDirtyForm' }))) {
      reset();
      toggle();
    } else if (pristine) {
      toggle();
    } else {
      event.currentTarget.blur();
      event.preventDefault();
    }
  };

  const submit = params => new Promise((resolve, reject) => {
    addBankAccount({ params, resolve, reject });
  }).then(() => {
    reloadCb && reloadCb();
    toggle();
  });

  return (
    <Modal {...{ isOpen, toggle: handleToggle }}>
      <ModalHeader toggle={handleToggle}>
        <FormattedMessage id={`${prefix}.modalHeaderAdd`} />
      </ModalHeader>
      <form onSubmit={handleSubmit(submit)}>
        <ModalBody>
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
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-link" onClick={handleToggle}>
            <FormattedMessage id="admin.buttons.cancel" /> <i className="fa fa-times" />
          </button>
          <span id="submit-add-payment">
            <button type="submit" className="btn btn-dark">
              <FormattedMessage id="admin.buttons.save" />
            </button>
          </span>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default reduxForm({
  enableReinitialize: true,
  onSubmitSuccess: (_result, _dispatch, { reset }) => {
    reset();
  },
})(injectIntl(AddBankAccount));
