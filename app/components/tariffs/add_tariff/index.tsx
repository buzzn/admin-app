import * as React from 'react';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';
import { reduxForm } from 'redux-form';
import FieldValidationWrapper from 'components/field_validation_wrapper';
import FieldInput from 'components/field_input';
import FieldDate from 'components/field_date';
import { dateNormalizer } from 'validation_normalizers';
import { getNumberDecimalSeperator } from '_util';

interface Props {}

class AddTariff extends React.Component<Props & InjectedIntlProps> {

  constructor(props) {
    super(props);
  }

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
    const prefix = 'admin.tariffs';

    return (
      <Modal {...{ isOpen, toggle: this.handleToggle }} data-cy="create tariff modal">
        <ModalHeader toggle={this.handleToggle}>
          <FormattedMessage id={`${prefix}.modalHeaderAdd`} />
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <Row>
              <Col xs={6}>
                <FieldValidationWrapper
                  {...{
                    name: 'name',
                    type: 'text',
                    label: <FormattedMessage id={`${prefix}.name`} />,
                    component: FieldInput,
                    validationRules,
                  }}
                />
              </Col>
              <Col xs={6}>
                <FieldValidationWrapper
                  {...{
                    name: 'beginDate',
                    type: 'text',
                    label: <FormattedMessage id={`${prefix}.beginDate`} />,
                    component: FieldDate,
                    validationRules,
                    normalize: dateNormalizer('YYYY-MM-DD'),
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <FieldValidationWrapper
                  {...{
                    name: 'energypriceCentsPerKwh',
                    type: 'text',
                    label: (
                      <React.Fragment>
                        <FormattedMessage id={`${prefix}.energypriceCentsPerKwh`} /> 
                        <small> (xx{getNumberDecimalSeperator(this.props.intl.locale)}xxxx CENT)</small>
                      </React.Fragment>
                    ),
                    component: FieldInput,
                    validationRules,
                  }}
                />
              </Col>
              <Col xs={6}>
                <FieldValidationWrapper
                  {...{
                    name: 'basepriceCentsPerMonth',
                    type: 'text',
                    label: (
                      <React.Fragment>
                        <FormattedMessage id={`${prefix}.basepriceCentsPerMonth`} /> €
                        <small> (xxxx{getNumberDecimalSeperator(this.props.intl.locale)}xx €)</small>
                      </React.Fragment>
                    ),
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
  form: 'addTariff',
  onSubmitSuccess: (_result, _dispatch, { reset }) => {
    reset();
  },
})(injectIntl(AddTariff));
