import * as React from 'react';
import { Field } from 'redux-form';
import isEqual from 'lodash/isEqual';
import { fieldValidator } from 'validation_functions';
import { getValidators } from '_util';

interface Props {
  name: string;
  validationRules: { [key: string]: any };
  field?: { [key: string]: any };
  overrideData?: null | { [key: string]: any };
}

// HACK: hack for redux form field rerender
class FieldValidationWrapper extends React.Component<Props> {
  state = { validate: fieldValidator(getValidators(this.props)) };

  componentDidUpdate(prevProps) {
    if (!isEqual(getValidators(prevProps), getValidators(this.props))) {
      return { validate: fieldValidator(getValidators(this.props)) };
    }

    return null;
  }

  render() {
    return (
      <Field
        {...{ ...this.props, validationRules: null }}
        field={this.props.field || getValidators(this.props) || { type: 'text' }}
        validate={this.props.overrideData ? undefined : this.state.validate}
      />
    );
  }
}

export default FieldValidationWrapper;
