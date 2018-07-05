import * as React from 'react';
import { Field } from 'redux-form';
import { Row, Col } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import EditableInput from 'components/editable_input';
import AddressFields from './address_fields';

interface Props {
  prefix: string;
  editMode: boolean;
}

const PersonFields = ({ prefix, editMode }: Props) => {
  const fieldClassName = editMode ? 'editValue' : 'fieldvalue grey-underline';

  return (
    <React.Fragment>
      <Row className="fieldgroup">
        <Col xs="4" className="fieldname">
          <FormattedMessage id="admin.persons.headerContact" />
        </Col>
        <Col xs="8">
          <Row>
            <Col xs="2" className={fieldClassName}>
              <Field
                {...{
                  withLabel: true,
                  field: { type: 'text' },
                  name: `${prefix}prefix`,
                  component: EditableInput,
                  editMode,
                }}
              />
            </Col>
            <Col xs="2" className={fieldClassName}>
              <Field
                {...{
                  withLabel: true,
                  field: { type: 'text' },
                  name: `${prefix}title`,
                  component: EditableInput,
                  editMode,
                }}
              />
            </Col>
            <Col xs="4" className={fieldClassName}>
              <Field
                {...{
                  withLabel: true,
                  field: { type: 'text' },
                  name: `${prefix}firstName`,
                  component: EditableInput,
                  editMode,
                }}
              />
            </Col>
            <Col xs="4" className={fieldClassName}>
              <Field
                {...{
                  withLabel: true,
                  field: { type: 'text' },
                  name: `${prefix}lastName`,
                  component: EditableInput,
                  editMode,
                }}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <AddressFields {...{ editMode, prefix: `${prefix ? `${prefix}` : ''}address.` }} />
      <Row className="fieldgroup">
        <Col xs="4" className="fieldname" />
        <Col xs="8" className={fieldClassName}>
          <Field
            {...{
              withLabel: true,
              field: { type: 'text' },
              name: `${prefix}phone`,
              component: EditableInput,
              editMode,
            }}
          />
        </Col>
      </Row>
      <Row className="fieldgroup">
        <Col xs="4" className="fieldname" />
        <Col xs="8" className={fieldClassName}>
          <Field
            {...{
              withLabel: true,
              field: { type: 'text' },
              name: `${prefix}fax`,
              component: EditableInput,
              editMode,
            }}
          />
        </Col>
      </Row>
      <Row className="fieldgroup">
        <Col xs="4" className="fieldname" />
        <Col xs="8" className={fieldClassName}>
          <Field
            {...{
              withLabel: true,
              field: { type: 'text' },
              name: `${prefix}email`,
              component: EditableInput,
              editMode,
            }}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default PersonFields;
