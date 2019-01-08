import * as React from 'react';
import { Row, Col } from 'reactstrap';
import { FieldArray } from 'redux-form';
import Select from 'react-select';
import { FormattedMessage } from 'react-intl';
import get from 'lodash/get';
import FieldValidationWrapper from 'components/field_validation_wrapper';
import EditableInput from 'components/editable_input';
import EditableInputArray from 'components/editable_input_array';
import { mainStyle } from 'components/react_select_styles';
import AddressFields from './address_fields';
import PersonFields from './person_fields';

interface Props {
  path: string;
  editMode: boolean;
  overrideData: null | { [key: string]: any };
  overrideContact: null | { [key: string]: any };
  overrideLR: null | { [key: string]: any };
  validationRules: { [key: string]: any };
  personOptions: Array<{ value: null | string; label: string }>;
  handleContactChange: Function;
  handleLRChange: Function;
  selectedContact: null | { value: null | string; label: string };
  selectedLR: null | { value: null | string; label: string };
}

const OrganizationFields = ({
  path,
  editMode,
  overrideData,
  overrideContact,
  overrideLR,
  validationRules,
  personOptions,
  handleContactChange,
  handleLRChange,
  selectedContact,
  selectedLR,
}: Props) => {
  const fieldClassName = editMode ? 'editValue' : 'fieldvalue grey-underline';
  const prefix = 'admin.organizations';
  const overridePerson = overrideContact || (overrideData ? get(overrideData, 'contact') || {} : null);
  const overrideAddress = overrideData ? get(overrideData, 'address') || {} : null;
  const overrideLegal = overrideLR || (overrideData ? get(overrideData, 'legalRepresentation') || {} : null);

  return (
    <>
      <Row className="fieldgroup">
        <Col xs="4" className="fieldname">
          <FormattedMessage id="admin.organizations.headerOrganization" />
        </Col>
        <Col xs="8" className={fieldClassName}>
          <FieldValidationWrapper
            {...{
              prefix,
              withLabel: true,
              name: `${path}name`,
              component: EditableInput,
              editMode,
              overrideData,
              validationRules,
            }}
          />
        </Col>
      </Row>
      <Row className="fieldgroup">
        <Col xs="4" className="fieldname" />
        <Col xs="8" className={fieldClassName}>
          <FieldValidationWrapper
            {...{
              prefix,
              withLabel: true,
              name: `${path}description`,
              component: EditableInput,
              editMode,
              overrideData,
              validationRules,
            }}
          />
        </Col>
      </Row>
      <AddressFields
        {...{ editMode, path: `${path ? `${path}` : ''}address.`, overrideData: overrideAddress, validationRules }}
      />
      <Row className="fieldgroup">
        <Col xs="4" className="fieldname" />
        <Col xs="8" className={fieldClassName}>
          <FieldValidationWrapper
            {...{
              prefix,
              withLabel: true,
              name: `${path}phone`,
              component: EditableInput,
              editMode,
              overrideData,
              validationRules,
            }}
          />
        </Col>
      </Row>
      <Row className="fieldgroup">
        <Col xs="4" className="fieldname" />
        <Col xs="8" className={fieldClassName}>
          <FieldValidationWrapper
            {...{
              prefix,
              withLabel: true,
              name: `${path}fax`,
              component: EditableInput,
              editMode,
              overrideData,
              validationRules,
            }}
          />
        </Col>
      </Row>
      <Row className="fieldgroup">
        <Col xs="4" className="fieldname" />
        <Col xs="8" className={fieldClassName}>
          <FieldValidationWrapper
            {...{
              prefix,
              withLabel: true,
              name: `${path}email`,
              component: EditableInput,
              editMode,
              overrideData,
              validationRules,
            }}
          />
        </Col>
      </Row>
      <Row className="fieldgroup">
        <Col xs="4" className="fieldname" />
        <Col xs="8" className={fieldClassName}>
          <FieldValidationWrapper
            {...{
              prefix,
              withLabel: true,
              name: `${path}website`,
              component: EditableInput,
              editMode,
              overrideData,
              validationRules,
            }}
          />
        </Col>
      </Row>
      <br />
      {editMode && (
        <Select
          options={personOptions}
          onChange={handleContactChange}
          styles={mainStyle}
          value={selectedContact}
          isDisabled={!!overrideData}
        />
      )}
      <br />
      <PersonFields
        {...{ editMode, path: `${path ? `${path}` : ''}contact.`, overrideData: overridePerson, validationRules }}
      />
      <br />
      {editMode && (
        <Select
          options={personOptions}
          onChange={handleLRChange}
          styles={mainStyle}
          value={selectedLR}
          isDisabled={!!overrideData}
        />
      )}
      <br />
      <PersonFields
        {...{
          legalRepresentation: true,
          editMode,
          path: `${path ? `${path}` : ''}legalRepresentation.`,
          overrideData: overrideLegal,
          validationRules,
        }}
      />
      {!overrideData && (
        <FieldArray
          {...{
            label: <FormattedMessage id="admin.organizations.headerAdditionalLegalRepresentation" />,
            name: 'additionalLegalRepresentation',
            fieldClassName,
            component: EditableInputArray,
            prefix,
            editMode,
          }}
        />
      )}
    </>
  );
};

export default OrganizationFields;
