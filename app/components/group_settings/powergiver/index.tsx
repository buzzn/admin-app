import * as React from 'react';
import { reduxForm } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Col, FormGroup, Label, Input } from 'reactstrap';
import Select from 'react-select';
import withEditOverlay from 'components/with_edit_overlay';
import FormPanel from 'components/form_panel';
import PersonFields from './person_fields';
import OrganizationFields from './organization_fields';

interface Props {
  owner: any;
  ownerAddress: any;
  ownerContact: any;
  ownerContactAddress: any;
  switchEditMode: () => void;
  editMode: boolean;
  loadAvailableUsers: () => void;
  loadAvailableOrganizations: () => void;
  updateOwner: ({}) => void;
  updatable: boolean;
  availableUsers: { _status: null | number; array: Array<any> };
  availableOrganizations: { _status: null | number; array: Array<any> };
  pristine: boolean;
  reset: () => void;
  submitting: boolean;
  handleSubmit: Function;
}

interface State {
  ownerType: null | string;
  selectedOwner: null | string;
}

class Powergiver extends React.Component<Props, State> {
  state = { ownerType: null, selectedOwner: null };

  switchEditMode = () => {
    const { switchEditMode, editMode, loadAvailableUsers, loadAvailableOrganizations } = this.props;
    if (!editMode) {
      loadAvailableUsers();
      loadAvailableOrganizations();
    } else {
      this.setState({ ownerType: null, selectedOwner: null });
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
    this.setState({ selectedOwner: param.value });
  };

  submitForm = (params) => {
    const { updateOwner, owner } = this.props;
    const { ownerType, selectedOwner } = this.state;
    console.log(params);
    // HACK
    if (ownerType === 'person' || owner.type === 'person') {
      params.preferredLanguage = 'de';
      params.address.country = 'DE';
    } else {
      params.address.country = 'DE';
      params.contact.preferredLanguage = 'de';
      params.contact.address.country = 'DE';
    }
    return new Promise((resolve, reject) => {
      updateOwner({
        params,
        resolve,
        reject,
        update: !ownerType && !selectedOwner,
        ownerId: selectedOwner,
        ownerType: owner.type || ownerType,
      });
    }).then(() => {
      this.setState({ ownerType: null, selectedOwner: null });
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
    } = this.props;

    const { ownerType, selectedOwner } = this.state;

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
                <React.Fragment>
                  <FormGroup>
                    <Label>
                      <Input
                        checked={ownerType === 'person'}
                        type="radio"
                        name="ownerType"
                        onChange={() => this.handleOwnerType('person')}
                      />
                      Person
                    </Label>
                  </FormGroup>
                  <FormGroup>
                    <Label>
                      <Input
                        checked={ownerType === 'organization'}
                        type="radio"
                        name="ownerType"
                        onChange={() => this.handleOwnerType('organization')}
                      />
                      Organization
                    </Label>
                  </FormGroup>
                </React.Fragment>
              )}
            {!owner.id && !ownerType ? null : owner.type === 'person' || ownerType === 'person' ? (
              <React.Fragment>
                {editMode && <Select options={personOptions} onChange={this.handleExistingSelect} />}
                {(!editMode || (editMode && !selectedOwner)) && <PersonFields {...{ editMode, prefix: '' }} />}
              </React.Fragment>
            ) : (
              <React.Fragment>
                {editMode && <Select options={organizationOptions} onChange={this.handleExistingSelect} />}
                {(!editMode || (editMode && !selectedOwner)) && <OrganizationFields {...{ editMode, prefix: '' }} />}
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
