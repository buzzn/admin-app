import React, { useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, FormGroup, CustomInput } from 'reactstrap';
import { reduxForm } from 'redux-form';
import FieldValidationWrapper from 'components/field_validation_wrapper';
import FieldInput from 'components/field_input';
import FieldDate from 'components/field_date';
import EditableSelect from 'components/editable_select';
import { dateNormalizer, numberNormalizer } from 'validation_normalizers';

const AddPayment = ({ isOpen, toggle, pristine, reset, intl, tariffs, validationRules, handleSubmit, addPayment }) => {
  const [priceBase, setPriceBase] = useState('');
  const prefix = 'admin.payments';

  const handleToggle = (event) => {
    if (!pristine && confirm(intl.formatMessage({ id: 'admin.messages.cancelDirtyForm' }))) {
      reset();
      setPriceBase('');
      toggle();
    } else if (pristine) {
      setPriceBase('');
      toggle();
    } else {
      event.currentTarget.blur();
      event.preventDefault();
    }
  };

  const submit = (values) => {
    if (!priceBase) return Promise.reject();
    const params = { ...values };
    if (priceBase === 'tariff') {
      delete params.priceCents;
    } else {
      delete params.tariffId;
    }
    params.priceCents = params.priceCents * 100;
    return new Promise((resolve, reject) => {
      addPayment({ params, resolve, reject });
    });
  };

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
                  name: 'beginDate',
                  type: 'text',
                  label: <FormattedMessage id={`${prefix}.paymentsBeginDate`} />,
                  component: FieldDate,
                  validationRules,
                  normalize: dateNormalizer('YYYY-MM-DD'),
                }}
              />
            </Col>
            <Col xs={4}>
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
            <Col xs={4}>
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
          </Row>
          <Row>
            <Col xs={12}>
              <FormGroup check inline data-cy="group owner radio person">
                <CustomInput
                  checked={priceBase === 'tariff'}
                  type="radio"
                  name="priceBase"
                  onChange={() => setPriceBase('tariff')}
                  label="Tariff"
                  id="tariff-radio"
                />
              </FormGroup>
              <FormGroup check inline>
                <CustomInput
                  checked={priceBase === 'cents'}
                  type="radio"
                  name="priceBase"
                  onChange={() => setPriceBase('cents')}
                  label="Manual"
                  id="cents-radio"
                />
              </FormGroup>
            </Col>
            {priceBase === 'tariff' ? (
              <Col xs={12}>
                <FieldValidationWrapper
                  {...{
                    name: 'tariffId',
                    editMode: true,
                    component: EditableSelect,
                    validationRules,
                    prefix,
                    withLabel: true,
                    noValTranslations: true,
                    listOverride: tariffs.map(t => ({
                      value: t.id,
                      label: t.name,
                    })),
                  }}
                />
              </Col>
            ) : priceBase === 'cents' ? (
              <Col xs={12}>
                <FieldValidationWrapper
                  {...{
                    name: 'priceCents',
                    type: 'text',
                    label: (
                      <React.Fragment>
                        <FormattedMessage id={`${prefix}.paymentsPriceCents`} /> €
                      </React.Fragment>
                    ),
                    component: FieldInput,
                    validationRules,
                  }}
                />
              </Col>
            ) : (
              false
            )}
          </Row>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-link" onClick={handleToggle}>
            <FormattedMessage id="admin.buttons.cancel" /> <i className="fa fa-times" />
          </button>
          <span id="submit-add-payment">
            <button type="submit" className="btn btn-dark" disabled={!priceBase}>
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
})(injectIntl(AddPayment));
