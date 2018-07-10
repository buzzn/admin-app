import * as React from 'react';
import { Field } from 'redux-form';
import isEqual from 'lodash/isEqual';
import camelCase from 'lodash/camelCase';
import { fieldValidator } from 'validation_functions';

interface Props {
  name: string;
  validationRules: { [key: string]: any };
  field?: { [key: string]: any };
}

// HACK: hack for redux form field rerender
class FieldValidationWrapper extends React.Component<Props> {
  state = { validate: fieldValidator(this.props.validationRules[camelCase(this.props.name)]) };

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.validationRules[prevProps.name], this.props.validationRules[this.props.name])) {
      return { validate: fieldValidator(this.props.validationRules[camelCase(this.props.name)]) };
    }

    return null;
  }

  render() {
    return (
      <Field
        {...{ ...this.props, validationRules: null}}
        field={this.props.field || this.props.validationRules[this.props.name] || { type: 'text' }}
        validate={this.state.validate}
      />
    );
  }
}

export default FieldValidationWrapper;
