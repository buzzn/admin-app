import * as React from 'react';
import Alert from 'react-s-alert';
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
  addGroup = (values) => {
    const { addGroup, toggle, history } = this.props;
    const params = { ...values };

    // Country is always predefined, so if there is only one address field,
    // user did not entered anything in address fields
    // uncomment if address fields must be optional
    // if (Object.keys(values.address).length === 1) delete params.address;

    return new Promise((resolve, reject) => {
      addGroup({ resolve, reject, params });
    }).then((res: { [key: string]: any }) => {
      Alert.success('Saved!');
      toggle();
      history.push(`/groups/${res.id}`);
    });
  };

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
    const { isOpen, handleSubmit, intl } = this.props;
    const prefix = 'admin.groups';

    return (
      <Modal {...{ isOpen, toggle: this.handleToggle }} data-cy="create group modal">
        <ModalHeader toggle={this.handleToggle}>
          <FormattedMessage id={`${prefix}.modalHeaderAdd`} />
        </ModalHeader>
        <form onSubmit={handleSubmit(this.addGroup)}>
          <ModalBody>
            <Row>
              <Col xs={12}>
                <Field
                  name="name"
                  type="text"
                  component={FieldInput}
                  label={intl.formatMessage({ id: `${prefix}.name` })}
                />
              </Col>
              <Col xs={6}>
                <Field
                  name="address.street"
                  type="text"
                  component={FieldInput}
                  label={intl.formatMessage({ id: 'admin.addresses.street' })}
                />
              </Col>
              <Col xs={2}>
                <Field
                  name="address.zip"
                  type="text"
                  component={FieldInput}
                  label={intl.formatMessage({ id: 'admin.addresses.zip' })}
                />
              </Col>
              <Col xs={4}>
                <Field
                  name="address.city"
                  type="text"
                  component={FieldInput}
                  label={intl.formatMessage({ id: 'admin.addresses.city' })}
                />
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
