import * as React from 'react';
import omit from 'lodash/omit';
import set from 'lodash/set';
import { reduxForm } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Col, FormGroup, CustomInput } from 'reactstrap';
import Select from 'react-select';
import withEditOverlay from 'components/with_edit_overlay';
import FormPanel from 'components/form_panel';
import { mainStyle } from 'components/react_select_styles';
import PersonFields from 'components/owner_fields/person_fields';
import OrganizationFields from 'components/owner_fields/organization_fields';
import TwoColField from 'components/two_col_field';
import EditableInput from 'components/editable_input';
import EditableDate from 'components/editable_date';
import EditableSelect from 'components/editable_select';
import EditableCheckbox from 'components/editable_checkbox';
import { dateNormalizer, numberNormalizer } from 'validation_normalizers';

import { CustomerOptions } from './style';

interface Props {
  url: string;
  history: any;
  loadAvailableUsers: () => void;
  loadAvailableOrganizations: () => void;
  addContract: (any) => void;
  availableUsers: { _status: null | number; array: Array<any> };
  availableOrganizations: { _status: null | number; array: Array<any> };
  pristine: boolean;
  reset: () => void;
  submitting: boolean;
  handleSubmit: Function;
  change: Function;
  validationRules: { lptp: {}; lpto: {} };
}

interface State {
  customerType: null | string;
  selectedCustomer: null | { value: null | string; label: string };
  selectedContact: null | { value: null | string; label: string };
  selectedLR: null | { value: null | string; label: string };
}

class AddPowertaker extends React.Component<Props, State> {
  state = { customerType: null, selectedCustomer: null, selectedContact: null, selectedLR: null };

  preselect = () => {
    this.setState({
      selectedCustomer: { value: null, label: 'Create new' },
      selectedContact: { value: null, label: 'Create new' },
      selectedLR: { value: null, label: 'Create new' },
    });
  };

  handleCustomerType = (customerType) => {
    const { loadAvailableUsers, loadAvailableOrganizations, reset } = this.props;
    if (customerType === 'organization') {
      loadAvailableOrganizations();
    }
    loadAvailableUsers();
    reset();
    this.preselect();
    this.setState({ customerType });
  };

  handleExistingSelect = (param) => {
    this.setState({
      selectedCustomer: param,
      selectedContact: { value: null, label: 'Create new' },
      selectedLR: { value: null, label: 'Create new' },
    });
  };

  handleContactChange = (param) => {
    const { change } = this.props;
    change('customer.contact.id', param ? param.value : param);
    this.setState({ selectedContact: param });
  };

  handleLRChange = (param) => {
    const { change } = this.props;
    change('customer.legalRepresentation.id', param ? param.value : param);
    this.setState({ selectedLR: param });
  };

  submitForm = (values) => {
    let params = { ...values };
    console.log(params);
    const { addContract, history, url } = this.props;
    const { customerType, selectedCustomer, selectedContact, selectedLR } = this.state;
    const customerValue = (selectedCustomer || { value: null }).value;
    const contactValue = (selectedContact || { value: null }).value;
    const lrValue = (selectedLR || { value: null }).value;
    const isPerson = customerType === 'person';
    // HACK
    if (!customerValue && isPerson) {
      set(params, 'customer.preferredLanguage', 'de');
      set(params, 'customer.address.country', 'DE');
    } else {
      set(params, 'customer.address.country', 'DE');
      if (!contactValue) {
        set(params, 'customer.contact.preferredLanguage', 'de');
        set(params, 'customer.contact.address.country', 'DE');
      }
      if (!lrValue) {
        set(params, 'customer.legalRepresentation.preferredLanguage', 'de');
      }
    }

    if (!customerValue && !isPerson) {
      // HACK
      params = omit(params, 'customer.legalRepresentation.address');
      // HACK
      if (contactValue) {
        params = omit(params, 'customer.contact');
        params.customer.contact = { id: contactValue };
      } else {
        params = omit(params, 'customer.contact.id');
      }
      // HACK
      if (lrValue) {
        params = omit(params, 'customer.legalRepresentation');
        params.customer.legalRepresentation = { id: lrValue };
      } else {
        params = omit(params, 'customer.legalRepresentation.id');
      }
    }

    if (customerValue) {
      params.customer = { id: customerValue };
    }

    return new Promise((resolve, reject) => {
      addContract({
        params: {
          // server validator hack
          registerMeta: {},
          ...params,
          type: 'contract_localpool_power_taker',
          customer: { ...params.customer, type: customerType },
        },
        resolve,
        reject,
      });
    }).then(() => {
      history.push(url);
    });
  };

  render() {
    const {
      availableUsers,
      availableOrganizations,
      handleSubmit,
      validationRules: allRules,
      history,
      url,
      pristine,
      submitting,
    } = this.props;

    const { customerType, selectedCustomer, selectedContact, selectedLR } = this.state;

    const prefix = 'admin.contracts';

    const personOptions: Array<{ value: null | string; label: string }> = [{ value: null, label: 'Create new' }].concat(
      availableUsers.array.map(u => ({ value: u.id, label: `${u.firstName} ${u.lastName} ${u.email}` })),
    );
    const organizationOptions: Array<{ value: null | string; label: string }> = [
      { value: null, label: 'Create new' },
    ].concat(availableOrganizations.array.map(u => ({ value: u.id, label: `${u.name} ${u.email}` })));

    const validationRules = customerType === 'person' ? allRules.lptp : allRules.lpto;

    const editMode = true;

    return (
      <Col xs="12">
        <p className="h5 grey-underline header text-uppercase">
          <FormattedMessage id={`${prefix}.headerAddPowertaker`} />
        </p>
        <form onSubmit={handleSubmit(this.submitForm)}>
          <FormPanel
            {...{
              editMode,
              dirty: !pristine,
              onCancel: () => {
                history.push(url);
              },
              cancelDisabled: submitting,
              onSave: handleSubmit(this.submitForm),
              saveDisabled: (pristine && !selectedCustomer) || submitting,
            }}
          >
            <TwoColField
              {...{
                prefix,
                name: 'signingDate',
                editMode,
                validationRules,
                component: EditableDate,
                normalize: dateNormalizer('YYYY-MM-DD'),
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'beginDate',
                editMode,
                validationRules,
                component: EditableDate,
                normalize: dateNormalizer('YYYY-MM-DD'),
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'terminationDate',
                editMode,
                validationRules,
                component: EditableDate,
                normalize: dateNormalizer('YYYY-MM-DD'),
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'endDate',
                editMode,
                validationRules,
                component: EditableDate,
                normalize: dateNormalizer('YYYY-MM-DD'),
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'contractNumber',
                editMode,
                validationRules,
                component: EditableInput,
                normalize: numberNormalizer,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'contractNumberAddition',
                editMode,
                validationRules,
                component: EditableInput,
                normalize: numberNormalizer,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'renewableEnergyLawTaxation',
                editMode,
                validationRules,
                component: EditableSelect,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'forecastKwhPa',
                editMode,
                validationRules,
                component: EditableInput,
                normalize: numberNormalizer,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'originalSigningUser',
                editMode,
                validationRules,
                component: EditableInput,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'mandateReference',
                editMode,
                validationRules,
                component: EditableInput,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'confirmPricingModel',
                editMode,
                validationRules,
                component: EditableCheckbox,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'powerOfAttorney',
                editMode,
                validationRules,
                component: EditableCheckbox,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'otherContract',
                editMode,
                validationRules,
                component: EditableCheckbox,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'moveIn',
                editMode,
                validationRules,
                component: EditableCheckbox,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'authorization',
                editMode,
                validationRules,
                component: EditableCheckbox,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'thirdPartyBillingNumber',
                editMode,
                validationRules,
                component: EditableInput,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'thirdPartyRenterNumber',
                editMode,
                validationRules,
                component: EditableInput,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'meteringPointOperatorName',
                editMode,
                validationRules,
                component: EditableInput,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'oldSupplierName',
                editMode,
                validationRules,
                component: EditableInput,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'oldCustomerNumber',
                editMode,
                validationRules,
                component: EditableInput,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'oldAccountNumber',
                editMode,
                validationRules,
                component: EditableInput,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'energyConsumptionBeforeKwhPa',
                editMode,
                validationRules,
                component: EditableInput,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'downPaymentBeforeCentsPerMonth',
                editMode,
                validationRules,
                component: EditableInput,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'shareRegisterWithGroup',
                editMode,
                validationRules,
                component: EditableCheckbox,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'shareRegisterPublicly',
                editMode,
                validationRules,
                component: EditableCheckbox,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'registerMeta.name',
                editMode,
                validationRules,
                component: EditableInput,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'registerMeta.label',
                editMode,
                validationRules,
                component: EditableSelect,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'registerMeta.observerEnabled',
                editMode,
                validationRules,
                component: EditableCheckbox,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'registerMeta.observerMinThreshold',
                editMode,
                validationRules,
                component: EditableInput,
                normalize: numberNormalizer,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'registerMeta.observerMaxThreshold',
                editMode,
                validationRules,
                component: EditableInput,
                normalize: numberNormalizer,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'registerMeta.observerOfflineMonitoring',
                editMode,
                validationRules,
                component: EditableCheckbox,
              }}
            />
            <CustomerOptions>
              <FormGroup check inline>
                <CustomInput
                  checked={customerType === 'person'}
                  type="radio"
                  name="ownerType"
                  onChange={() => this.handleCustomerType('person')}
                  label="Person"
                  id="person-radio"
                />
              </FormGroup>
              <FormGroup check inline>
                <CustomInput
                  checked={customerType === 'organization'}
                  type="radio"
                  name="ownerType"
                  onChange={() => this.handleCustomerType('organization')}
                  label="Organization"
                  id="organization-radio"
                />
              </FormGroup>
            </CustomerOptions>
            {!customerType ? null : customerType === 'person' ? (
              <React.Fragment>
                <React.Fragment>
                  <Select
                    options={personOptions}
                    onChange={this.handleExistingSelect}
                    styles={mainStyle}
                    value={selectedCustomer}
                  />
                  <br />
                </React.Fragment>
                <PersonFields
                  {...{
                    editMode,
                    path: 'customer.',
                    overrideData: selectedCustomer
                      ? availableUsers.array.find(o => o.id === (selectedCustomer || { value: null }).value)
                      : null,
                    validationRules,
                  }}
                />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <React.Fragment>
                  <Select
                    options={organizationOptions}
                    onChange={this.handleExistingSelect}
                    styles={mainStyle}
                    value={selectedCustomer}
                  />
                  <br />
                </React.Fragment>
                <OrganizationFields
                  {...{
                    editMode,
                    path: 'customer.',
                    overrideData: selectedCustomer
                      ? availableOrganizations.array.find(o => o.id === (selectedCustomer || { value: null }).value)
                      : null,
                    overrideContact: selectedContact
                      ? availableUsers.array.find(o => o.id === (selectedContact || { value: null }).value)
                      : null,
                    overrideLR: selectedLR
                      ? availableUsers.array.find(o => o.id === (selectedLR || { value: null }).value)
                      : null,
                    validationRules,
                    personOptions,
                    handleContactChange: this.handleContactChange,
                    handleLRChange: this.handleLRChange,
                    selectedContact,
                    selectedLR,
                  }}
                />
              </React.Fragment>
            )}
          </FormPanel>
        </form>
      </Col>
    );
  }
}

export default reduxForm({
  form: 'addPowertakerForm',
  enableReinitialize: true,
  // HACK: see #3729, #3362 in redux-form
  keepDirtyOnReinitialize: true,
  onSubmitSuccess: (_result, _dispatch, { initialize }) => {
    initialize({});
  },
})(withEditOverlay(AddPowertaker));
