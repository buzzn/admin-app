import * as React from 'react';
import { Row, Col } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import get from 'lodash/get';
import FieldValidationWrapper from 'components/field_validation_wrapper';
import EditableInput from 'components/editable_input';
import EditableSelect from 'components/editable_select';
import AddressFields from './address_fields';

interface Props {
  path: string;
  editMode: boolean;
  overrideData: null | { [key: string]: any };
  validationRules: { [key: string]: any };
  legalRepresentation?: boolean;
}

const PersonFields = ({ path, editMode, overrideData, validationRules, legalRepresentation }: Props) => {
  const fieldClassName = editMode ? 'editValue' : 'fieldvalue grey-underline';
  const prefix = 'admin.persons';
  const overrideAddress = get(overrideData, `${path}address`) || get(overrideData, 'address');

  return (
    <React.Fragment>
      <Row className="fieldgroup">
        <Col xs="4" className="fieldname">
          <FormattedMessage
            id={`admin.persons.${legalRepresentation ? 'headerLegalRepresentation' : 'headerContact'}`}
          />
        </Col>
        <Col xs="8">
          <Row>
            <Col xs="2" className={fieldClassName}>
              <FieldValidationWrapper
                {...{
                  prefix,
                  withLabel: true,
                  name: `${path}prefix`,
                  component: EditableSelect,
                  editMode,
                  overrideData,
                  validationRules,
                }}
              />
            </Col>
            <Col xs="2" className={fieldClassName}>
              <FieldValidationWrapper
                {...{
                  prefix,
                  withLabel: true,
                  name: `${path}title`,
                  component: EditableSelect,
                  editMode,
                  overrideData,
                  validationRules,
                }}
              />
            </Col>
            <Col xs="4" className={fieldClassName}>
              <FieldValidationWrapper
                {...{
                  prefix,
                  withLabel: true,
                  name: `${path}firstName`,
                  component: EditableInput,
                  editMode,
                  overrideData,
                  validationRules,
                }}
              />
            </Col>
            <Col xs="4" className={fieldClassName}>
              <FieldValidationWrapper
                {...{
                  prefix,
                  withLabel: true,
                  name: `${path}lastName`,
                  component: EditableInput,
                  editMode,
                  overrideData,
                  validationRules,
                }}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      {!legalRepresentation && (
        <AddressFields
          {...{ editMode, path: `${path ? `${path}` : ''}address.`, overrideData: overrideAddress, validationRules }}
        />
      )}
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
    </React.Fragment>
  );
};

export default PersonFields;
