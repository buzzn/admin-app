import * as React from 'react';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { Modal, ModalHeader, ModalBody, ModalFooter, Col } from 'reactstrap';
import { reduxForm } from 'redux-form';
import FieldValidationWrapper from 'components/field_validation_wrapper';
import EditableInput from 'components/editable_input';
import EditableDate from 'components/editable_date';
import EditableSelect from 'components/editable_select';

import { SpacedRow } from './style';

interface Props {
  isOpen: boolean;
  toggle: () => void;
  addDevice: Function;
  loadAvailableOrganizationMarkets: Function;
  organizationMarkets: Array<{ [key: string]: any }>;
  loading: boolean;
  handleSubmit: () => void;
  validationRules: any;
}

class AddDevice extends React.Component<Props & InjectedIntlProps> {
  componentDidMount() {
    this.props.loadAvailableOrganizationMarkets();
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
    const { isOpen, handleSubmit, validationRules, organizationMarkets } = this.props;
    const prefix = 'admin.devices';

    return (
      <Modal {...{ isOpen, toggle: this.handleToggle }} data-cy="create device modal">
        <ModalHeader toggle={this.handleToggle}>
          <FormattedMessage id={`${prefix}.modalHeaderAdd`} />
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <SpacedRow>
              <Col xs={4}>
                <FieldValidationWrapper
                  {...{
                    name: 'twoWayMeter',
                    editMode: true,
                    withLabel: true,
                    component: EditableSelect,
                    validationRules,
                    prefix,
                  }}
                />
              </Col>
              <Col xs={4}>
                <FieldValidationWrapper
                  {...{
                    name: 'twoWayMeterUsed',
                    editMode: true,
                    withLabel: true,
                    component: EditableSelect,
                    validationRules,
                    prefix,
                  }}
                />
              </Col>
              <Col xs={4}>
                <FieldValidationWrapper
                  {...{
                    name: 'primaryEnergy',
                    editMode: true,
                    withLabel: true,
                    component: EditableSelect,
                    validationRules,
                    prefix,
                  }}
                />
              </Col>
            </SpacedRow>
            <SpacedRow>
              <Col xs={3}>
                <FieldValidationWrapper
                  {...{
                    name: 'commissioning',
                    editMode: true,
                    withLabel: true,
                    component: EditableDate,
                    validationRules,
                    prefix,
                  }}
                />
              </Col>
              <Col xs={3}>
                <FieldValidationWrapper
                  {...{
                    name: 'law',
                    editMode: true,
                    withLabel: true,
                    component: EditableSelect,
                    validationRules,
                    prefix,
                  }}
                />
              </Col>
              <Col xs={3}>
                <FieldValidationWrapper
                  {...{
                    name: 'kwPeak',
                    editMode: true,
                    withLabel: true,
                    component: EditableInput,
                    validationRules,
                    prefix,
                  }}
                />
              </Col>
              <Col xs={3}>
                <FieldValidationWrapper
                  {...{
                    name: 'kwhPerAnnum',
                    editMode: true,
                    withLabel: true,
                    component: EditableInput,
                    validationRules,
                    prefix,
                  }}
                />
              </Col>
            </SpacedRow>
            <SpacedRow>
              <Col xs={6}>
                <FieldValidationWrapper
                  {...{
                    name: 'manufacturer',
                    editMode: true,
                    withLabel: true,
                    component: EditableInput,
                    validationRules,
                    prefix,
                  }}
                />
              </Col>
              <Col xs={6}>
                <FieldValidationWrapper
                  {...{
                    prefix,
                    name: 'electricitySupplier.id',
                    validationRules: {},
                    editMode: true,
                    withLabel: true,
                    component: EditableSelect,
                    noValTranslations: true,
                    listOverride: organizationMarkets.map(o => ({ value: o.id, label: o.name })),
                  }}
                />
              </Col>
            </SpacedRow>
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
  form: 'addDevice',
  onSubmitSuccess: (_result, _dispatch, { reset }) => {
    reset();
  },
})(injectIntl(AddDevice));
