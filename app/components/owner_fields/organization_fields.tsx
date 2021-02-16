import * as React from 'react';
import { Row, Col } from 'reactstrap';
import Select from 'react-select';
import { FormattedMessage } from 'react-intl';
import get from 'lodash/get';
import Loading from 'components/loading';
import FieldValidationWrapper from 'components/field_validation_wrapper';
import EditableInput from 'components/editable_input';
import { mainStyle } from 'components/react_select_styles';
import AddressFields from './address_fields';
import PersonFields from './person_fields';

interface Props {
  groupId?: number,
  path: string;
  editMode: boolean;
  overrideData: null | { [key: string]: any };
  overrideContact: null | { [key: string]: any };
  overrideLR: null | { [key: string]: any };
  loadingOptions?: boolean;
  validationRules: { [key: string]: any };
  personOptions: Array<{ value: null | string; label: string }>;
  handleContactChange: Function;
  handleLRChange: Function;
  selectedContact: null | { value: null | string; label: string };
  selectedLR: null | { value: null | string; label: string };
}

const OrganizationFields = ({
  path,
  groupId,
  editMode,
  overrideData,
  overrideContact,
  overrideLR,
  loadingOptions,
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
    <React.Fragment>
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
      {editMode
        && (loadingOptions ? (
          <Loading {...{ minHeight: 60, unit: 'px' }} />
        ) : (
          <Select
            options={personOptions}
            onChange={handleContactChange}
            styles={mainStyle}
            value={selectedContact}
            isDisabled={!!overrideData}
          />
        ))}
      <br />
      <PersonFields
        {...{ groupId, editMode, path: `${path ? `${path}` : ''}contact.`, overrideData: overridePerson, validationRules }}
      />
      <br />
      {editMode
        && (loadingOptions ? (
          <Loading {...{ minHeight: 60, unit: 'px' }} />
        ) : (
          <Select
            options={personOptions}
            onChange={handleLRChange}
            styles={mainStyle}
            value={selectedLR}
            isDisabled={!!overrideData}
          />
        ))}
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
    </React.Fragment>
  );
};

export default OrganizationFields;
