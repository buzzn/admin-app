import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import isEqual from 'lodash/isEqual';
import camelCase from 'lodash/camelCase';
import { Row, Col } from 'reactstrap';
import { fieldValidator } from 'validation_functions';

const cleanArrStr = str => str.replace(/\[\d*\]/, '');

class TwoColField extends Component {
  state = { validate: fieldValidator(this.props.validationRules[camelCase(this.props.name)]) };

  componentDidUpdate(prevProps) {
    if (
      !isEqual(
        prevProps.validationRules[camelCase(cleanArrStr(prevProps.name))],
        this.props.validationRules[camelCase(cleanArrStr(this.props.name))],
      )
    ) {
      return { validate: fieldValidator(this.props.validationRules[camelCase(cleanArrStr(this.props.name))]) };
    }

    return null;
  }

  render() {
    return (
      <Row className="fieldgroup">
        <Col xs="6" className="fieldname">
          <FormattedMessage id={`${this.props.prefix}.${cleanArrStr(this.props.name)}`} />:
        </Col>
        <Col xs="6" className={`${this.props.editMode ? 'editValue' : 'fieldvalue grey-underline'}`}>
          <Field
            {...this.props}
            field={this.props.field || this.props.validationRules[camelCase(cleanArrStr(this.props.name))]}
            validate={this.state.validate}
          />
        </Col>
      </Row>
    );
  }
}

export default TwoColField;
