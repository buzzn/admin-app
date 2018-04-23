import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import isEqual from 'lodash/isEqual';
import { Row, Col } from 'reactstrap';
import { fieldValidator } from 'validation_functions';

class TwoColField extends Component {
  state = { validate: fieldValidator(this.props.validationRules[this.props.name]) };

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.validationRules[prevProps.name], this.props.validationRules[this.props.name])) {
      return { validate: fieldValidator(this.props.validationRules[this.props.name]) };
    }

    return null;
  }

  render() {
    return (
      <Row className="fieldgroup">
        <Col xs="4" className="fieldname">
          <FormattedMessage id={`${this.props.prefix}.${this.props.name}`} />:
        </Col>
        <Col xs="8" className={`${this.props.editMode ? 'editValue' : 'fieldvalue grey-underline'}`}>
          <Field
            {...this.props}
            field={this.props.field || this.props.validationRules[this.props.name]}
            validate={this.state.validate}
          />
        </Col>
      </Row>
    );
  }
}

export default TwoColField;
