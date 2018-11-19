import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import isEqual from 'lodash/isEqual';
import { Row, Col } from 'reactstrap';
import { fieldValidator } from 'validation_functions';
import { getValidators } from '_util';

class TwoColField extends Component {
  state = { validate: fieldValidator(getValidators(this.props)) };

  componentDidUpdate(prevProps) {
    if (!isEqual(getValidators(prevProps), getValidators(this.props))) {
      return { validate: fieldValidator(getValidators(this.props)) };
    }

    return null;
  }

  render() {
    return (
      <Row className="fieldgroup">
        <Col xs="6" className="fieldname">
          <FormattedMessage id={`${this.props.prefix}.${this.props.name.split('.').pop()}`} />:
        </Col>
        <Col xs="6" className={`${this.props.editMode ? 'editValue' : 'fieldvalue grey-underline'}`}>
          <Field {...this.props} field={this.props.field || getValidators(this.props)} validate={this.state.validate} />
        </Col>
      </Row>
    );
  }
}

export default TwoColField;
