import * as React from 'react';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';
import { reduxForm } from 'redux-form';
import FieldValidationWrapper from 'components/field_validation_wrapper';
import FieldInput from 'components/field_input';
import FieldDate from 'components/field_date';
import EditableSelect from 'components/editable_select';

interface Props {
  isOpen: boolean;
  toggle: () => void;
  handleSubmit: () => void;
  validationRules: { _status: null | number; [key: string]: any };
}

class AddBilling extends React.Component<Props & InjectedIntlProps> {
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
    const prefix = 'admin.billings';

    return (
      <Modal {...{ isOpen, toggle: this.handleToggle }} data-cy="create billing modal">
        <ModalHeader toggle={this.handleToggle}>
          <FormattedMessage id={`${prefix}.modalHeaderAdd`} />
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <Row>
              <Col xs={4}>
                <FieldValidationWrapper
                  {...{
                    name: 'beginDate',
                    type: 'text',
                    label: <FormattedMessage id={`${prefix}.beginDate`} />,
                    component: FieldDate,
                    validationRules,
                  }}
                />
              </Col>
              <Col xs={4}>
                <FieldValidationWrapper
                  {...{
                    name: 'endDate',
                    type: 'text',
                    label: <FormattedMessage id={`${prefix}.endDate`} />,
                    component: FieldDate,
                    validationRules,
                  }}
                />
              </Col>
              <Col xs={4}>
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
            </Row>
            <Row>
              <Col xs={12}>
                <FieldValidationWrapper
                  {...{
                    name: 'invoiceNumber',
                    type: 'text',
                    label: <FormattedMessage id={`${prefix}.invoiceNumber`} />,
                    component: FieldInput,
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
            <span id="submit-add-billing">
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
  form: 'addBilling',
  onSubmitSuccess: (_result, _dispatch, { reset }) => {
    reset();
  },
})(injectIntl(AddBilling));
