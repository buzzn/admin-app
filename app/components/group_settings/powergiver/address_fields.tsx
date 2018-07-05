import * as React from 'react';
import { Field } from 'redux-form';
import { Row, Col } from 'reactstrap';
import EditableInput from 'components/editable_input';

interface Props {
  prefix: string;
  editMode: boolean;
}

const AddressFields = ({ prefix, editMode }: Props) => {
  const fieldClassName = editMode ? 'editValue' : 'fieldvalue grey-underline';

  return (
    <React.Fragment>
      <Row className="fieldgroup">
        <Col xs="4" className="fieldname" />
        <Col xs="8" className={fieldClassName}>
          <Field
            {...{
              withLabel: true,
              field: { type: 'text' },
              name: `${prefix}street`,
              component: EditableInput,
              editMode,
            }}
          />
        </Col>
      </Row>
      <Row className="fieldgroup">
        <Col xs="4" className="fieldname" />
        <Col xs="8">
          <Row>
            <Col xs="4" className={fieldClassName}>
              <Field
                {...{
                  withLabel: true,
                  field: { type: 'integer' },
                  name: `${prefix}zip`,
                  component: EditableInput,
                  editMode,
                }}
              />
            </Col>
            <Col xs="8" className={fieldClassName}>
              <Field
                {...{
                  withLabel: true,
                  field: { type: 'text' },
                  name: `${prefix}city`,
                  component: EditableInput,
                  editMode,
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
