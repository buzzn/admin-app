import * as React from 'react';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';
import { reduxForm, Field } from 'redux-form';
import FieldInput from 'components/field_input';

interface Props {
  isOpen: boolean;
  toggle: () => void;
  addGroup: Function;
  loading: boolean;
  handleSubmit: () => void;
}

class AddGroup extends React.Component<Props & InjectedIntlProps> {
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
    const { isOpen, handleSubmit } = this.props;
    const prefix = 'admin.groups';

    return (
      <Modal {...{ isOpen, toggle: this.handleToggle }}>
        <ModalHeader toggle={this.handleToggle}>
          <FormattedMessage id={`${prefix}.modalHeaderAdd`} />
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <Row>
              <Col xs={12}>
                <Field name="name" type="text" component={FieldInput} label="Name" />
              </Col>
              <Col xs={6}>
                <Field name="address.street" type="text" component={FieldInput} label="Street" />
              </Col>
              <Col xs={4}>
                <Field name="address.city" type="text" component={FieldInput} label="City" />
              </Col>
              <Col xs={2}>
                <Field name="address.zip" type="text" component={FieldInput} label="ZIP" />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-link" onClick={this.handleToggle}>
              <FormattedMessage id="admin.buttons.cancel" /> <i className="fa fa-times" />
            </button>
            <button type="submit" className="btn btn-dark">
              <FormattedMessage id="admin.buttons.submit" />
            </button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default reduxForm({
  form: 'addGroup',
  onSubmitSuccess: (_result, _dispatch, { reset }) => {
    reset();
  },
  initialValues: { address: { country: 'DE' } },
})(injectIntl(AddGroup));
