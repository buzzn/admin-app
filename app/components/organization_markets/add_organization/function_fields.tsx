import React, { useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { FormattedMessage } from 'react-intl';

import FieldValidationWrapper from 'components/field_validation_wrapper';
import EditableInput from 'components/editable_input';
import EditableSelect from 'components/editable_select';
import { InputRow } from 'components/style';

const FunctionFields = ({ editMode, fields, prefix, validationRules }) => {
  useEffect(() => {
    fields.push();
  }, []);

  return (
    <React.Fragment>
      <Row>
        <Col xs={12}>
          <p className="h5 header text-uppercase" style={{ paddingTop: '2rem' }}>
            <FormattedMessage id={`${prefix}.functions`} />
          </p>
        </Col>
      </Row>
      {fields.map((field, i) => (
        <InputRow className="fieldgroup" key={i} noGutters>
          <i
            className="fa fa-plus-circle add cy-add-register"
            onClick={() => {
              fields.push();
            }}
          />
          {fields.length > 1 && (
            <i
              className="fa fa-remove remove"
              onClick={() => {
                fields.remove(i);
              }}
            />
          )}
          {['marketPartnerId', 'edifactEmail', 'function'].map(name => (
            <Col key={name} xs={4}>
              <FieldValidationWrapper
                {...{
                  prefix,
                  name: `${field}.${name}`,
                  editMode,
                  withLabel: true,
                  validationRules,
                  component: validationRules[`${field.split(['['])[0]}${name[0].toUpperCase()}${name.slice(1)}`].enum
                    ? EditableSelect
                    : EditableInput,
                }}
              />
            </Col>
          ))}
        </InputRow>
      ))}
    </React.Fragment>
  );
};

export default FunctionFields;
