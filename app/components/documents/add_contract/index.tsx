import * as React from 'react';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, UncontrolledTooltip } from 'reactstrap';
import { reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import Loading from 'components/loading';
import FieldValidationWrapper from 'components/field_validation_wrapper';
import FieldInput from 'components/field_input';
import FieldDate from 'components/field_date';
import EditableSelect from 'components/editable_select';

interface Props {
  isOpen: boolean;
  toggle: () => void;
  addContract: Function;
  loading: boolean;
  contractTypes: Array<{ value: string; label: string }>;
  handleSubmit: () => void;
  validationRules: { _status: null | number; [key: string]: any };
  groupName: string;
  groupOwner: null | { [key: string]: any };
  groupOwnerErrors: undefined | { [key: string]: any };
  url: string;
}

class AddContract extends React.Component<Props & InjectedIntlProps> {
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
    const {
      isOpen,
      loading,
      contractTypes,
      groupName,
      groupOwner,
      groupOwnerErrors,
      handleSubmit,
      validationRules,
      onSubmit,
      url,
    } = this.props;
    const prefix = 'admin.contracts';
    // TODO: replace with selected contractType incompleteness logic
    const disabled = !groupOwner;
    const pdfDisabled = !groupOwner || groupOwnerErrors;

    return (
      <Modal {...{ isOpen, toggle: this.handleToggle }}>
        <ModalHeader toggle={this.handleToggle}>
          <FormattedMessage id={`${prefix}.modalHeaderAdd`} />
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            {loading ? (
              <Loading minHeight={10} />
            ) : (
              <React.Fragment>
                <Row>
                  <Col xs={12}>
                    <FieldValidationWrapper
                      {...{
                        name: 'type',
                        editMode: true,
                        component: EditableSelect,
                        validationRules,
                        listOverride: contractTypes,
                        prefix,
                      }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={6}>{groupName}</Col>
                  <Col xs={6}>
                    {groupOwner ? (
                      groupOwner.name || `${groupOwner.firstName} ${groupOwner.lastName}`
                    ) : (
                      <Link
                        to={`${url
                          .split('/')
                          .slice(0, -1)
                          .join('/')}/settings/powergiver`}
                      >
                        <FormattedMessage id={`${prefix}.noGroupOwnerError`} />
                      </Link>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <FieldValidationWrapper
                      {...{
                        name: 'taxNumber',
                        type: 'text',
                        editMode: true,
                        component: FieldInput,
                        validationRules,
                      }}
                    />
                  </Col>
                  <Col xs={6}>
                    <FormattedMessage id={`${prefix}.signingDate`} />
                  </Col>
                  <Col xs={6}>
                    <FieldValidationWrapper
                      {...{
                        name: 'signingDate',
                        type: 'text',
                        editMode: true,
                        component: FieldDate,
                        dateFormat: 'DD.MM.YYYY',
                        inputFormats: ['D.M.YY'],
                        validationRules,
                      }}
                    />
                  </Col>
                </Row>
              </React.Fragment>
            )}
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-link" onClick={this.handleToggle}>
              <FormattedMessage id="admin.buttons.cancel" /> <i className="fa fa-times" />
            </button>
            <span id="submit-add-contract">
              <button type="submit" className="btn btn-dark" disabled={disabled}>
                <FormattedMessage id="admin.buttons.submit" />
              </button>
            </span>
            {disabled && (
              <UncontrolledTooltip target="submit-add-contract">Please, add group owner</UncontrolledTooltip>
            )}
            <span id="submit-add-contract-pdf">
              <button
                className="btn btn-dark"
                disabled={pdfDisabled}
                onClick={handleSubmit(values => onSubmit({ ...values, generatePDF: true }))}
              >
                <FormattedMessage id="admin.buttons.submitAndGeneratePDF" />
              </button>
            </span>
            {pdfDisabled && (
              <UncontrolledTooltip target="submit-add-contract-pdf">Please, add missing group owner data</UncontrolledTooltip>
            )}
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default reduxForm({
  form: 'addContract',
  onSubmitSuccess: (_result, _dispatch, { reset }) => {
    reset();
  },
})(injectIntl(AddContract));
