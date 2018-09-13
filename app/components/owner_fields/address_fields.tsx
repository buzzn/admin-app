import * as React from 'react';
import { Row, Col } from 'reactstrap';
import FieldValidationWrapper from 'components/field_validation_wrapper';
import EditableInput from 'components/editable_input';

interface Props {
  path: string;
  editMode: boolean;
  overrideData: null | { [key: string]: any };
  validationRules: { [key: string]: any };
}

const AddressFields = ({ path, editMode, overrideData, validationRules }: Props) => {
  const fieldClassName = editMode ? 'editValue' : 'fieldvalue grey-underline';
  const prefix = 'admin.addresses';

  return (
    <React.Fragment>
      <Row className="fieldgroup">
        <Col xs="4" className="fieldname" />
        <Col xs="8" className={fieldClassName}>
          <FieldValidationWrapper
            {...{
              prefix,
              withLabel: true,
              name: `${path}street`,
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
        <Col xs="8">
          <Row>
            <Col xs="4" className={fieldClassName}>
              <FieldValidationWrapper
                {...{
                  prefix,
                  withLabel: true,
                  name: `${path}zip`,
                  component: EditableInput,
                  editMode,
                  overrideData,
                  validationRules,
                }}
              />
            </Col>
            <Col xs="8" className={fieldClassName}>
              <FieldValidationWrapper
                {...{
                  prefix,
                  withLabel: true,
                  name: `${path}city`,
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
    </React.Fragment>
  );
};

export default AddressFields;
