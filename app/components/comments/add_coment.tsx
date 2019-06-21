import React from 'react';
import Alert from 'react-s-alert';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';
import { reduxForm } from 'redux-form';
import FieldValidationWrapper from 'components/field_validation_wrapper';
import EditableInput from 'components/editable_input';

interface Props {
  isOpen: boolean;
  toggle: () => void;
  addComment: Function;
  loading: boolean;
  handleSubmit: () => void;
  validationRules: any;
}

const AddGroup: React.FC<Props & InjectedIntlProps> = ({
  isOpen,
  handleSubmit,
  intl,
  addComment,
  toggle,
  pristine,
  reset,
  validationRules,
}) => {
  const submit = params => new Promise((resolve, reject) => {
    addComment({ resolve, reject, params });
  }).then(() => {
    Alert.success('Saved!');
    toggle();
  });

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

  const prefix = 'admin.comments';

  return (
    <Modal {...{ isOpen, toggle: handleToggle }} data-cy="create comment modal">
      <ModalHeader toggle={handleToggle}>
        <FormattedMessage id={`${prefix}.modalHeaderAdd`} />
      </ModalHeader>
      <form onSubmit={handleSubmit(submit)}>
        <ModalBody>
          {['author', 'content'].map(name => (
            <Row key={name}>
              <Col key={name} xs={12}>
                <FieldValidationWrapper
                  {...{
                    prefix,
                    name,
                    editMode: true,
                    withLabel: true,
                    validationRules,
                    component: EditableInput,
                  }}
                />
              </Col>
            </Row>
          ))}
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-link" onClick={handleToggle}>
            <FormattedMessage id="admin.buttons.cancel" /> <i className="fa fa-times" />
          </button>
          <button type="submit" className="btn btn-dark">
            <FormattedMessage id="admin.buttons.submit" />
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default reduxForm({
  form: 'addComment',
  onSubmitSuccess: (_result, _dispatch, { reset }) => {
    reset();
  },
})(injectIntl(AddGroup));
