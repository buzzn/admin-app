import * as React from 'react';
import { Row, Col } from 'reactstrap';
import Select from 'react-select';
import reduce from 'lodash/reduce';
import { FormattedMessage } from 'react-intl';
import FieldValidationWrapper from 'components/field_validation_wrapper';
import EditableInput from 'components/editable_input';
import AddressFields from './address_fields';
import PersonFields from './person_fields';

import { mainStyle } from 'components/react_select_styles';

interface Props {
  path: string;
  editMode: boolean;
  overrideData: null | { [key: string]: any };
  overrideContact: null | { [key: string]: any };
  validationRules: { [key: string]: any };
  personOptions: Array<{ value: null | string; label: string }>;
  handleContactChange: Function;
  selectedContact: null | { value: null | string; label: string };
}

const OrganizationFields = ({
  path,
  editMode,
  overrideData,
  overrideContact,
  validationRules,
  personOptions,
  handleContactChange,
  selectedContact,
}: Props) => {
  const fieldClassName = editMode ? 'editValue' : 'fieldvalue grey-underline';
  const prefix = 'admin.organizations';
  const overridePerson = overrideContact
    ? reduce(overrideContact, (res, v, k) => ({ ...res, [`contact.${k}`]: v }), {})
    : overrideData;

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
      <AddressFields {...{ editMode, path: `${path ? `${path}` : ''}address.`, overrideData, validationRules }} />
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
      <br />
      <Select
        options={personOptions}
        onChange={handleContactChange}
        styles={mainStyle}
        value={selectedContact}
        isDisabled={!!overrideData}
      />
      <br />
      <PersonFields {...{ editMode, path: 'contact.', overrideData: overridePerson, validationRules }} />
    </React.Fragment>
  );
};

export default OrganizationFields;
