import * as React from 'react';
import { Field } from 'redux-form';
import { Col } from 'reactstrap';
import EditableInput from 'components/editable_input';

import { InputRow } from './style';

const EditableInputArray = (props) => {
  if (!props.fields.length) props.fields.push();

  return (
    <>
      {props.fields.map((field, i) => (
        <InputRow className="fieldgroup" key={i}>
          <Col xs="4" className="fieldname">
            {i === 0 && props.label}
          </Col>
          <Col xs={8} className={props.fieldClassName}>
            <Field {...{ ...props, name: field, field: { type: 'text' }, component: EditableInput }} />
            {props.editMode && (
              <>
                <i className="fa fa-plus-circle add" onClick={() => props.fields.push()} />
                {i > 0 && <i className="fa fa-remove remove" onClick={() => props.fields.remove(i)} />}
              </>
            )}
          </Col>
        </InputRow>
      ))}
    </>
  );
};

export default EditableInputArray;
