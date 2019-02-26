import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { reduxForm } from 'redux-form';
import reduce from 'lodash/reduce';
import omit from 'lodash/omit';
import withEditOverlay from 'components/with_edit_overlay';
import FormPanel from 'components/form_panel';
import PersonFields from 'components/owner_fields/person_fields';
import OrganizationFields from 'components/owner_fields/organization_fields';

interface Props {
  powertaker: any;
  powertakerType: string;
  updatable: boolean;
  groupId: string;
  contractId: string;
  powertakerId: string;
  loadGroupUser: (any) => void;
  loadGroupOrganization: (any) => void;
  switchEditMode: () => void;
  editMode: boolean;
  loadAvailableUsers: () => void;
  loadingOptions: boolean;
  updateContract: (any) => void;
  availableUsers: { _status: null | number; array: Array<any> };
  pristine: boolean;
  reset: () => void;
  submitting: boolean;
  handleSubmit: Function;
  change: Function;
  validationRules: {
    lptOrgCustomer: { [key: string]: { any } };
    lptPerCustomer: { [key: string]: { any } };
  };
}

interface State {
  selectedContact: null | { value: null | string; label: string };
  selectedLR: null | { value: null | string; label: string };
}

class PowertakerForm extends React.Component<Props, State> {
  state = { selectedContact: null, selectedLR: null };

  preselect = () => {
    this.setState({
      selectedContact: { value: null, label: 'Update existing' },
      selectedLR: { value: null, label: 'Update existing' },
    });
  };

  switchEditMode = () => {
    const { switchEditMode, editMode, loadAvailableUsers } = this.props;
    if (!editMode) {
      loadAvailableUsers();
      this.preselect();
    } else {
      this.setState({ selectedContact: null, selectedLR: null });
    }
    switchEditMode();
  };

  handleContactChange = (param) => {
    const { change } = this.props;
    change('contact.id', param ? param.value : param);
    this.setState({ selectedContact: param });
  };

  handleLRChange = (param) => {
    const { change } = this.props;
    change('legalRepresentation.id', param ? param.value : param);
    this.setState({ selectedLR: param });
  };

  submitForm = (values) => {
    let params = JSON.parse(JSON.stringify(values));
    params = omit(params, 'contracts');
    const {
      updateContract,
      groupId,
      contractId,
      powertakerType,
      powertakerId,
      loadGroupUser,
      loadGroupOrganization,
    } = this.props;
    const { selectedContact, selectedLR } = this.state;
    const contactValue = (selectedContact || { value: null }).value;
    const lrValue = (selectedLR || { value: null }).value;
    const isPerson = powertakerType === 'person';
    // HACK: for create from update
    const omitNulls = obj => reduce(
      obj,
      (res, v, k) => ({
        ...res,
        ...(typeof v === 'object' && v !== null ? { [k]: omitNulls(v) } : !v ? {} : { [k]: v }),
      }),
      {},
    );
    // HACK
    if (!params.address) params.address = {};
    if (isPerson) {
      if (!params.preferredLanguage) params.preferredLanguage = 'de';
      if (params.address && !params.address.country) params.address.country = 'DE';
    } else {
      if (params.address && !params.address.country) params.address.country = 'DE';
      if ((!contactValue || contactValue === 'new') && params.contact) {
        if (!params.contact.preferredLanguage) params.contact.preferredLanguage = 'de';
        if (params.contact.address && !params.contact.address.country) params.contact.address.country = 'DE';
      }
      if ((!lrValue || lrValue === 'new') && params.legalRepresentation) {
        if (!params.legalRepresentation.preferredLanguage) params.legalRepresentation.preferredLanguage = 'de';
      }
    }

    // HACK
    if (contactValue === 'new' && params.contact) {
      params.contact = omitNulls(params.contact);
    }

    // HACK
    if (lrValue === 'new' && params.legalRepresentation) {
      params.legalRepresentation = omitNulls(params.legalRepresentation);
    }

    if (!isPerson) {
      // HACK
      params = omit(params, 'legalRepresentation.address');
      // HACK
      if (contactValue && contactValue !== 'new') {
        params = omit(params, 'contact');
        params.contact = { id: contactValue };
      } else if (contactValue === 'new') {
        params = omit(params, ['contact.updatedAt', 'contact.id']);
      } else {
        params = omit(params, 'contact.id');
      }
      // HACK
      if (lrValue && lrValue !== 'new') {
        params = omit(params, 'legalRepresentation');
        params.legalRepresentation = { id: lrValue };
      } else if (lrValue === 'new') {
        params = omit(params, ['legalRepresentation.updatedAt', 'legalRepresentation.id']);
      } else {
        params = omit(params, 'legalRepresentation.id');
      }
    }

    if (params.additionalLegalRepresentation) params.additionalLegalRepresentation = Object.values(params.additionalLegalRepresentation).join('$#$');

    return new Promise((resolve, reject) => {
      updateContract({
        params,
        resolve,
        reject,
        groupId,
        contractId,
        updateType: powertakerType === 'person' ? 'personCustomer' : 'organizationCustomer',
      });
    }).then(() => {
      this.setState({ selectedContact: null, selectedLR: null });
      this.switchEditMode();
      if (powertakerType === 'person') {
        loadGroupUser({ userId: powertakerId, groupId });
      } else {
        loadGroupOrganization({ organizationId: powertakerId, groupId });
      }
    });
  };

  render() {
    const {
      powertaker,
      availableUsers,
      loadingOptions,
      editMode,
      handleSubmit,
      pristine,
      reset,
      submitting,
      validationRules: allRules,
      powertakerType,
      updatable,
    } = this.props;
    const { selectedContact, selectedLR } = this.state;

    const personOptions: Array<{ value: null | string; label: string }> = [
      { value: null, label: 'Update existing' },
      { value: 'new', label: 'Create new' },
    ].concat(availableUsers.array.map(u => ({ value: u.id, label: `${u.firstName} ${u.lastName} ${u.email}` })));

    const validationRules = powertakerType === 'person' ? allRules.lptPerCustomer : allRules.lptOrgCustomer;

    return (
      <form onSubmit={handleSubmit(this.submitForm)}>
        <FormPanel
          {...{
            editMode,
            dirty: !pristine,
            onCancel: () => {
              reset();
              this.switchEditMode();
            },
            cancelDisabled: submitting,
            onSave: handleSubmit(this.submitForm),
            saveDisabled: pristine || submitting,
          }}
        >
          <h5 className="grey-underline pb-2">
            <FormattedMessage id={'admin.contracts.headerContactInfo'} />
            {!editMode
              && updatable && <i className="buzzn-pencil" style={{ float: 'right' }} onClick={this.switchEditMode} />}
          </h5>
          {powertaker.type === 'person' ? (
            <PersonFields
              {...{
                editMode,
                path: '',
                overrideData: null,
                validationRules,
              }}
            />
          ) : (
            <OrganizationFields
              {...{
                editMode,
                path: '',
                overrideData: null,
                overrideContact: selectedContact
                  ? availableUsers.array.find(o => o.id === (selectedContact || { value: null }).value)
                  : null,
                overrideLR: selectedLR
                  ? availableUsers.array.find(o => o.id === (selectedLR || { value: null }).value)
                  : null,
                loadingOptions,
                validationRules,
                personOptions,
                handleContactChange: this.handleContactChange,
                handleLRChange: this.handleLRChange,
                selectedContact,
                selectedLR,
              }}
            />
          )}
        </FormPanel>
      </form>
    );
  }
}

export default reduxForm({
  form: 'powertakerCustomerForm',
  enableReinitialize: true,
})(withEditOverlay(PowertakerForm));
