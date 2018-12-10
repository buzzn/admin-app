import * as React from 'react';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';
import { reduxForm } from 'redux-form';
import FieldValidationWrapper from 'components/field_validation_wrapper';
import FieldInput from 'components/field_input';
import FieldDate from 'components/field_date';
import EditableSelect from 'components/editable_select';

interface Props {}

class AddReading extends React.Component<Props & InjectedIntlProps> {
  handleToggle = (event) => {
    const { pristine, reset, toggle, intl } = this.props;

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

  render() {
    const { isOpen, handleSubmit, validationRules } = this.props;
    const prefix = 'admin.readings';

    return (
      <Modal {...{ isOpen, toggle: this.handleToggle }} data-cy="create reading modal">
        <ModalHeader toggle={this.handleToggle}>
          <FormattedMessage id={`${prefix}.modalHeaderAdd`} />
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <Row>
              <Col xs={4}>
                <FieldValidationWrapper
                  {...{
                    name: 'rawValue',
                    type: 'text',
                    label: <FormattedMessage id={`${prefix}.rawValue`} />,
                    component: FieldInput,
                    validationRules,
                  }}
                />
              </Col>
              <Col xs={4}>
                <FieldValidationWrapper
                  {...{
                    name: 'value',
                    type: 'text',
                    label: <FormattedMessage id={`${prefix}.value`} />,
                    component: FieldInput,
                    validationRules,
                  }}
                />
              </Col>
              <Col xs={4}>
                <FieldValidationWrapper
                  {...{
                    name: 'unit',
                    editMode: true,
                    component: EditableSelect,
                    validationRules,
                    prefix,
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <FieldValidationWrapper
                  {...{
                    name: 'reason',
                    editMode: true,
                    component: EditableSelect,
                    validationRules,
                    prefix,
                  }}
                />
              </Col>
              <Col xs={3}>
                <FieldValidationWrapper
                  {...{
                    name: 'readBy',
                    editMode: true,
                    component: EditableSelect,
                    validationRules,
                    prefix,
                  }}
                />
              </Col>
              <Col xs={3}>
                <FieldValidationWrapper
                  {...{
                    name: 'quality',
                    editMode: true,
                    component: EditableSelect,
                    validationRules,
                    prefix,
                  }}
                />
              </Col>
              <Col xs={3}>
                <FieldValidationWrapper
                  {...{
                    name: 'source',
                    editMode: true,
                    component: EditableSelect,
                    validationRules,
                    prefix,
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <FieldValidationWrapper
                  {...{
                    name: 'status',
                    editMode: true,
                    component: EditableSelect,
                    validationRules,
                    prefix,
                  }}
                />
              </Col>
              <Col xs={6}>
                <FieldValidationWrapper
                  {...{
                    name: 'comment',
                    type: 'text',
                    label: <FormattedMessage id={`${prefix}.comment`} />,
                    component: FieldInput,
                    validationRules,
                  }}
                />
              </Col>
              <Col xs={3}>
                <FieldValidationWrapper
                  {...{
                    name: 'date',
                    type: 'text',
                    label: <FormattedMessage id={`${prefix}.date`} />,
                    component: FieldDate,
                    validationRules,
                  }}
                />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-link" onClick={this.handleToggle}>
              <FormattedMessage id="admin.buttons.cancel" /> <i className="fa fa-times" />
            </button>
            <span id="submit-add-reading">
              <button type="submit" className="btn btn-dark">
                <FormattedMessage id="admin.buttons.save" />
              </button>
            </span>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default reduxForm({
  enableReinitialize: true,
  form: 'addReading',
  onSubmitSuccess: (_result, _dispatch, { reset }) => {
    reset();
  },
})(injectIntl(AddReading));
