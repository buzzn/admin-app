import * as React from 'react';
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
  ownerAddress: any;
  ownerContact: any;
  ownerContactAddress: any;
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
    change('legal_representation.id', param ? param.value : param);
    this.setState({ selectedLR: param });
  };

  submitForm = (params) => {
    const { updateOwner, owner } = this.props;
    const { ownerType, selectedOwner, selectedContact, selectedLR } = this.state;
    const update = !ownerType && !selectedOwner;
    const isPerson = ownerType === 'person' || owner.type === 'person';
    // HACK
    if (!update) {
      if (isPerson) {
        params.preferredLanguage = 'de';
        params.address.country = 'DE';
      } else {
        params.address.country = 'DE';
        if (!selectedContact) {
          params.contact.preferredLanguage = 'de';
          params.contact.address.country = 'DE';
        }
        if (!selectedLR) {
          params.legalRepresentation.preferredLanguage = 'de';
        }
      }
    }
    if (!isPerson) {
      // HACK
      if (selectedContact) {
        delete params.contact;
        params.contact = {
          id: (selectedContact || { value: null }).value,
        };
      } else {
        delete params.contact.id;
      }
      // HACK
      if (selectedLR) {
        delete params.legalRepresentation;
        params.legalRepresentation = {
          id: (selectedLR || { value: null }).value,
        };
      } else {
        delete params.legalRepresentation.id;
      }
    }
    return new Promise((resolve, reject) => {
      updateOwner({
        params,
        resolve,
        reject,
        update,
        ownerId: (selectedOwner || { value: null }).value,
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

    const personOptions = [{ value: null, label: owner.id ? 'Update existing' : 'Create new' }].concat(availableUsers.array.map(u => ({ value: u.id, label: `${u.firstName} ${u.lastName} ${u.email}` })));
    const organizationOptions = [{ value: null, label: owner.id ? 'Update existing' : 'Create new' }].concat(availableOrganizations.array.map(u => ({ value: u.id, label: `${u.name} ${u.email}` })));

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
})(withEditOverlay(Powergiver));
