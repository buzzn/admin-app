import * as React from 'react';
import omit from 'lodash/omit';
import reduce from 'lodash/reduce';
import { reduxForm } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Col, FormGroup, CustomInput } from 'reactstrap';
import Select from 'react-select';
import withEditOverlay from 'components/with_edit_overlay';
import FormPanel from 'components/form_panel';
import PersonFields from './person_fields';
import OrganizationFields from './organization_fields';

import { mainStyle } from 'components/react_select_styles';
import { OwnerOptions } from './style';

interface Props {
  owner: any;
  switchEditMode: () => void;
  editMode: boolean;
  loadAvailableUsers: () => void;
  loadAvailableOrganizations: () => void;
  updateOwner: (any) => void;
  updatable: boolean;
  availableUsers: { _status: null | number; array: Array<any> };
  availableOrganizations: { _status: null | number; array: Array<any> };
  pristine: boolean;
  reset: () => void;
  submitting: boolean;
  handleSubmit: Function;
  change: Function;
  validationRules: {
    createPersonOwner: { [key: string]: { any } };
    updatePersonOwner: { [key: string]: { any } };
    createOrganizationOwner: { [key: string]: { any } };
    updateOrganizationOwner: { [key: string]: { any } };
  };
}

interface State {
  ownerType: null | string;
  selectedOwner: null | { value: null | string; label: string };
  selectedContact: null | { value: null | string; label: string };
  selectedLR: null | { value: null | string; label: string };
}

class Powergiver extends React.Component<Props, State> {
  state = { ownerType: null, selectedOwner: null, selectedContact: null, selectedLR: null };

  switchEditMode = () => {
    const { switchEditMode, editMode, loadAvailableUsers, loadAvailableOrganizations } = this.props;
    if (!editMode) {
      loadAvailableUsers();
      loadAvailableOrganizations();
    } else {
      this.setState({ ownerType: null, selectedOwner: null, selectedContact: null, selectedLR: null });
    }
    switchEditMode();
  };

  handleOwnerType = (ownerType) => {
    const { switchEditMode, editMode, loadAvailableUsers, loadAvailableOrganizations } = this.props;
    if (!editMode) {
      loadAvailableUsers();
      loadAvailableOrganizations();
      switchEditMode();
    }
    this.setState({ ownerType });
  };

  handleExistingSelect = (param) => {
    this.setState({ selectedOwner: param, selectedContact: null, selectedLR: null });
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
    let params = { ...values };
    const { updateOwner, owner } = this.props;
    const { ownerType, selectedOwner, selectedContact, selectedLR } = this.state;
    const ownerValue = (selectedOwner || { value: null }).value;
    const contactValue = (selectedContact || { value: null }).value;
    const lrValue = (selectedLR || { value: null }).value;
    const update = !ownerType && !ownerValue;
    const isPerson = ownerType === 'person' || owner.type === 'person';
    // HACK: for create from update
    const omitNulls = obj =>
      reduce(
        obj,
        (res, v, k) => ({
          ...res,
          ...(typeof v === 'object' && v !== null ? { [k]: omitNulls(v) } : !v ? {} : { [k]: v }),
        }),
        {},
      );
    // HACK
    if (isPerson) {
      if (!params.preferredLanguage) params.preferredLanguage = 'de';
      if (params.address && !params.address.country) params.address.country = 'DE';
    } else {
      if (params.address && !params.address.country) params.address.country = 'DE';
      if (!contactValue && params.contact) {
        if (!params.contact.preferredLanguage) params.contact.preferredLanguage = 'de';
        if (params.contact.address && !params.contact.address.country) params.contact.address.country = 'DE';
      }
      if (!lrValue && params.legalRepresentation) {
        if (!params.legalRepresentation.preferredLanguage) params.legalRepresentation.preferredLanguage = 'de';
      }
    }

    // HACK
    if (ownerValue === 'new') {
      params = omit(params, ['id', 'updatedAt', 'address.id', 'address.updatedAt']);
      params = omitNulls(params);
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

    return new Promise((resolve, reject) => {
      updateOwner({
        params,
        resolve,
        reject,
        update,
        ownerId: ownerValue === 'new' ? null : ownerValue,
        ownerType: owner.type || ownerType,
      });
    }).then(() => {
      this.setState({ ownerType: null, selectedOwner: null, selectedContact: null, selectedLR: null });
      this.switchEditMode();
    });
  };

  render() {
    const {
      updatable,
      owner,
      editMode,
      availableUsers,
      availableOrganizations,
      pristine,
      reset,
      submitting,
      handleSubmit,
      validationRules: { createPersonOwner, updatePersonOwner, createOrganizationOwner, updateOrganizationOwner },
    } = this.props;

    const { ownerType, selectedOwner, selectedContact, selectedLR } = this.state;

    const personValidationRules = !ownerType && !selectedOwner ? updatePersonOwner : createPersonOwner;
    const organizationValidationRules =
      !ownerType && !selectedOwner ? updateOrganizationOwner : createOrganizationOwner;

    const prefix = 'admin.groups';

    const personOptions: Array<{ value: null | string; label: string }> = [
      { value: null, label: owner.id ? 'Update existing' : 'Create new' },
    ].concat(availableUsers.array.filter(u => owner.id !== u.id).map(u => ({ value: u.id, label: `${u.firstName} ${u.lastName} ${u.email}` })));
    const organizationOptions: Array<{ value: null | string; label: string }> = [
      { value: null, label: owner.id ? 'Update existing' : 'Create new' },
    ].concat(availableOrganizations.array.filter(o => owner.id !== o.id).map(u => ({ value: u.id, label: `${u.name} ${u.email}` })));
    if (owner.id) {
      personOptions.unshift({ value: 'new', label: 'Create new' });
      organizationOptions.unshift({ value: 'new', label: 'Create new' });
    }

    return (
      <Col xs="12">
        <p className="h5 grey-underline header text-uppercase">
          <FormattedMessage id={`${prefix}.headerPowergiver`} />
          {!editMode &&
            owner.id &&
            updatable && <i className="buzzn-pencil" style={{ float: 'right' }} onClick={this.switchEditMode} />}
        </p>
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
              saveDisabled: (pristine && !selectedOwner) || submitting,
            }}
          >
            {updatable &&
              !owner.id && (
                <OwnerOptions>
                  <FormGroup check inline>
                    <CustomInput
                      checked={ownerType === 'person'}
                      type="radio"
                      name="ownerType"
                      onChange={() => this.handleOwnerType('person')}
                      label="Person"
                      id="person-radio"
                    />
                  </FormGroup>
                  <FormGroup check inline>
                    <CustomInput
                      checked={ownerType === 'organization'}
                      type="radio"
                      name="ownerType"
                      onChange={() => this.handleOwnerType('organization')}
                      label="Organization"
                      id="organization-radio"
                    />
                  </FormGroup>
                </OwnerOptions>
              )}
            {!owner.id && !ownerType ? null : owner.type === 'person' || ownerType === 'person' ? (
              <React.Fragment>
                {editMode && (
                  <React.Fragment>
                    <Select
                      options={personOptions}
                      onChange={this.handleExistingSelect}
                      styles={mainStyle}
                      value={selectedOwner}
                    />
                    <br />
                  </React.Fragment>
                )}
                <PersonFields
                  {...{
                    editMode,
                    path: '',
                    overrideData: selectedOwner
                      ? availableUsers.array.find(o => o.id === (selectedOwner || { value: null }).value)
                      : null,
                    validationRules: personValidationRules,
                  }}
                />
              </React.Fragment>
            ) : (
              <React.Fragment>
                {editMode && (
                  <React.Fragment>
                    <Select
                      options={organizationOptions}
                      onChange={this.handleExistingSelect}
                      styles={mainStyle}
                      value={selectedOwner}
                    />
                    <br />
                  </React.Fragment>
                )}
                <OrganizationFields
                  {...{
                    editMode,
                    path: '',
                    overrideData: selectedOwner
                      ? availableOrganizations.array.find(o => o.id === (selectedOwner || { value: null }).value)
                      : null,
                    overrideContact: selectedContact
                      ? availableUsers.array.find(o => o.id === (selectedContact || { value: null }).value)
                      : null,
                    overrideLR: selectedLR
                      ? availableUsers.array.find(o => o.id === (selectedLR || { value: null }).value)
                      : null,
                    validationRules: organizationValidationRules,
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
  form: 'groupOwnerForm',
  enableReinitialize: true,
  // HACK: see #3729, #3362 in redux-form
  keepDirtyOnReinitialize: true,
  onSubmitSuccess: (_result, _dispatch, { initialize }) => {
    initialize({});
  },
})(withEditOverlay(Powergiver));
