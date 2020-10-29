import * as React from 'react';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';
import { reduxForm } from 'redux-form';
import { Tooltip } from 'reactstrap';
import FieldValidationWrapper from 'components/field_validation_wrapper';
import FieldInput from 'components/field_input';
import FieldDate from 'components/field_date';
import EditableSelect from 'components/editable_select';
import { dateNormalizer } from 'validation_normalizers';
import { getNumberDecimalSeperator } from '_util';

interface Props {}

class AddReadingForm extends React.Component<Props & InjectedIntlProps> {
  state = { tooltipOpen: false };

  tooltipToggle = () => {
    this.setState({ tooltipOpen: !this.state.tooltipOpen });
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
    const {
      isOpen,
      handleSubmit,
      validationRules,
      getAutoReadingValue,
      addReadingFormValues,
      edifactMeasurementMethod,
    } = this.props;
    const prefix = 'admin.readings';

    return (
      <Modal {...{ isOpen, toggle: this.handleToggle }} data-cy="create reading modal">
        <ModalHeader toggle={this.handleToggle}>
          <FormattedMessage id={`${prefix}.modalHeaderAdd`} />
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <Row>
              <Col xs={8}>
                <FieldValidationWrapper
                  {...{
                    name: 'rawValue',
                    type: 'text',
                    label: (
                      <React.Fragment>
                        <FormattedMessage id={`${prefix}.rawValue`} /> kWh 
                        <small>(xxxx{getNumberDecimalSeperator(this.props.intl.locale)}xx)</small>
                      </React.Fragment>
                    ),
                    component: FieldInput,
                    validationRules,
                  }}
                />
              </Col>
              <Col xs={4}>
                <FieldValidationWrapper
                  {...{
                    name: 'date',
                    type: 'text',
                    label: <FormattedMessage id={`${prefix}.date`} />,
                    component: FieldDate,
                    validationRules,
                    normalize: dateNormalizer('YYYY-MM-DD'),
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
                    withLabel: true,
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
                    withLabel: true,
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
                    withLabel: true,
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
                    withLabel: true,
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
                    withLabel: true,
                  }}
                />
              </Col>
              <Col xs={9}>
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
            </Row>
          </ModalBody>
          <ModalFooter>
            {edifactMeasurementMethod === 'AMR' && (
              <React.Fragment>
                <button
                  className="btn btn-dark"
                  id="req_reading"
                  onClick={(e) => {
                    e.preventDefault();
                    getAutoReadingValue();
                  }}
                  disabled={!addReadingFormValues.date}
                >
                  <FormattedMessage id="admin.buttons.requestReading" /> <i className="fa fa-cog" />
                </button>
                {!addReadingFormValues.date && (
                  <Tooltip
                    placement="bottom"
                    target="req_reading"
                    delay={200}
                    isOpen={this.state.tooltipOpen}
                    toggle={this.tooltipToggle}
                  >
                    Please, fill the date
                  </Tooltip>
                )}
              </React.Fragment>
            )}
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
  onSubmitSuccess: (_result, _dispatch, { reset }) => {
    reset();
  },
})(injectIntl(AddReadingForm));
