import * as React from 'react';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, UncontrolledTooltip } from 'reactstrap';
import { reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import Loading from 'components/loading';
import FieldValidationWrapper from 'components/field_validation_wrapper';
import FieldInput from 'components/field_input';
import EditableSelect from 'components/editable_select';
import LabeledValue from 'components/labeled_value';

interface Props {
  isOpen: boolean;
  toggle: () => void;
  addContract: Function;
  loading: boolean;
  contractTypes: Array<{ value: string; label: string }>;
  addContractFormValues: { [key: string]: any };
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
      addContractFormValues,
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
                        noDefault: true,
                        prefix,
                      }}
                    />
                  </Col>
                </Row>
                <Row style={{ padding: '1rem 0 1rem 0' }}>
                  <Col xs={6}>
                    <LabeledValue {...{ label: <FormattedMessage id="admin.groups.tableName" />, value: groupName }} />
                  </Col>
                  <Col xs={6}>
                    {groupOwner ? (
                      <LabeledValue
                        {...{
                          label: <FormattedMessage id="admin.groups.owner" />,
                          value: groupOwner.name || `${groupOwner.firstName} ${groupOwner.lastName}`,
                        }}
                      />
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
                {addContractFormValues.type === 'contract_localpool_processing' ? (
                  <Row>
                    <Col xs={12}>
                      <FieldValidationWrapper
                        {...{
                          name: 'taxNumber',
                          type: 'text',
                          label: <FormattedMessage id={`${prefix}.taxNumber`} />,
                          component: FieldInput,
                          validationRules,
                        }}
                      />
                    </Col>
                  </Row>
                ) : addContractFormValues.type === 'contract_metering_point_operator' ? (
                  <Row>
                    <Col xs={12}>
                      <FieldValidationWrapper
                        {...{
                          name: 'taxNumber',
                          type: 'text',
                          label: <FormattedMessage id={`${prefix}.taxNumber`} />,
                          component: FieldInput,
                          validationRules,
                        }}
                      />
                    </Col>
                  </Row>
                ) : (
                  false
                )}
              </React.Fragment>
            )}
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-link" onClick={this.handleToggle}>
              <FormattedMessage id="admin.buttons.cancel" /> <i className="fa fa-times" />
            </button>
            <span id="submit-add-contract">
              <button type="submit" className="btn btn-dark" disabled={disabled}>
                <FormattedMessage id="admin.buttons.save" />
              </button>
            </span>
            {disabled && (
              <UncontrolledTooltip target="submit-add-contract">Please, add group owner</UncontrolledTooltip>
            )}
            {addContractFormValues.type === 'contract_localpool_processing' && (
              <React.Fragment>
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
                  <UncontrolledTooltip target="submit-add-contract-pdf">
                    Please, add missing group owner data
                  </UncontrolledTooltip>
                )}
              </React.Fragment>
            )}
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default reduxForm({
  form: 'addContract',
  enableReinitialize: true,
  onSubmitSuccess: (_result, _dispatch, { reset }) => {
    reset();
  },
})(injectIntl(AddContract));
