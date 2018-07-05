import * as React from 'react';
import { Field } from 'redux-form';
import { Row, Col } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import EditableInput from 'components/editable_input';
import AddressFields from './address_fields';
import PersonFields from './person_fields';

interface Props {
  prefix: string;
  editMode: boolean;
}

const OrganizationFields = ({ prefix, editMode }: Props) => {
  const fieldClassName = editMode ? 'editValue' : 'fieldvalue grey-underline';

  return (
    <React.Fragment>
      <Row className="fieldgroup">
        <Col xs="4" className="fieldname">
          <FormattedMessage id="admin.organizations.headerOrganization" />
        </Col>
        <Col xs="8" className={fieldClassName}>
          <Field
            {...{ withLabel: true, field: { type: 'text' }, name: `${prefix}name`, component: EditableInput, editMode }}
          />
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
            {...{ withLabel: true, field: { type: 'text' }, name: `${prefix}fax`, component: EditableInput, editMode }}
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
      <PersonFields {...{ editMode, prefix: 'contact.' }} />
    </React.Fragment>
  );
};

export default OrganizationFields;
