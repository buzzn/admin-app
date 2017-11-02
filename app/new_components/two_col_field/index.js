import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import isEqual from 'lodash/isEqual';
import { fieldValidator } from 'validation_functions';

class TwoColField extends Component {
  state = {
    validate: fieldValidator(this.props.validationRules[this.props.name]),
  };

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.validationRules[this.props.name], nextProps.validationRules[nextProps.name])) {
      this.setState({
        validate: fieldValidator(nextProps.validationRules[nextProps.name]),
      });
    }
  }

  render() {
    return (
      <div className="row" style={{ minHeight: '40px' }}>
        <div className="col-6">
          <FormattedMessage id={ `${this.props.prefix}.${this.props.name}` } />:
        </div>
        <div className="col-6">
          <Field
            { ...this.props }
            field={ this.props.field || this.props.validationRules[this.props.name] }
            validate={ this.state.validate }
          />
        </div>
      </div>
    );
  }
}

export default TwoColField;
