import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';
import { reduxForm, Field } from 'redux-form';
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
}

class AddBilling extends React.Component<Props> {
  render() {
    const { isOpen, toggle, loading, nextBillingCycleBeginDate, handleSubmit } = this.props;
    const prefix = 'admin.billingCycles';

    return (
      <Modal {...{ isOpen, toggle }}>
        <ModalHeader toggle={toggle}>
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
                      label="Last Date"
                    />
                    <Field
                      name="endDate"
                      type="text"
                      component={({ meta: { error } }) => <div>{!!error && error}</div>}
                    />
                  </Col>
                  <Col xs={12}>
                    <Field name="name" type="text" component={FieldInput} label="Name" />
                  </Col>
                </Row>
              </React.Fragment>
            )}
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-link" onClick={toggle}>
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
})(AddBilling);
