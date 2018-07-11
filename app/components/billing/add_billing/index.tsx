import * as React from 'react';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import moment from 'moment';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';
import { reduxForm, Field } from 'redux-form';
import { fieldValidator } from 'validation_functions';
import Loading from 'components/loading';
import FieldInput from 'components/field_input';
import FieldDate from 'components/field_date';

interface Props {
  isOpen: boolean;
  toggle: () => void;
  addBillingCycle: Function;
  loading: boolean;
  nextBillingCycleBeginDate: string;
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
    const { isOpen, loading, nextBillingCycleBeginDate, handleSubmit, validationRules } = this.props;
    const prefix = 'admin.billingCycles';

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
                  <Col xs={6}>
                    <FieldInput
                      {...{
                        label: 'Begin Date',
                        meta: { active: true, touched: false, error: false },
                        input: { value: moment(nextBillingCycleBeginDate).format('DD.MM.YYYY'), disabled: true },
                      }}
                    />
                  </Col>
                  <Col xs={6}>
                    <Field
                      name="lastDate"
                      type="text"
                      component={FieldDate}
                      dateFormat="DD.MM.YYYY"
                      inputFormats={['D.M.YY']}
                      label="Last Date"
                      validate={fieldValidator(validationRules.lastDate)}
                    />
                    <Field
                      name="endDate"
                      type="text"
                      component={({ meta: { error } }) => <div>{!!error && error}</div>}
                    />
                  </Col>
                  <Col xs={12}>
                    <Field
                      name="name"
                      type="text"
                      component={FieldInput}
                      label="Name"
                      validate={fieldValidator(validationRules.name)}
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
  form: 'addBillingCycle',
  onSubmitSuccess: (_result, _dispatch, { reset }) => {
    reset();
  },
})(injectIntl(AddBilling));
