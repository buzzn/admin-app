export const required = value => (value ? undefined : 'Required');

export const isString = value =>
  value && typeof value === 'string' ?  undefined : 'Must be a string';

export const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined;

export const minLength = min => value =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined;

export const isNumber = value =>
  value && isNaN(Number(value)) ? 'Must be a number' : undefined;

export const minValue = min => value =>
  value && value < min ? `Must be at least ${min}` : undefined;

export const maxValue = max => value =>
  value && value > max ? `Must be at least ${max}` : undefined;

export const minValueInc = min => value =>
  value && value <= min ? `Must be at least ${min}` : undefined;

export const maxValueInc = max => value =>
  value && value >= max ? `Must be at least ${max}` : undefined;

export const isEmail = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined;

export const isAlphaNumeric = value =>
  value && /[^a-zA-Z0-9 ]/i.test(value)
    ? 'Only alphanumeric characters'
    : undefined;

export const isPhoneNumber = value =>
  value && !/^(0|[1-9][0-9]{9})$/i.test(value)
    ? 'Invalid phone number, must be 10 digits'
    : undefined;

export const isIncluded = list => value =>
  list.includes(value) ? undefined : 'Must be the one of the values';

export const fieldValidator = (field) => {
  const validators = [];
  if (!field) return validators;

  if (field.required) validators.push(required);
  if (field.type === 'string') {
    validators.push(isString);
    if (field.maxLength) validators.push(maxLength(field.maxLength));
  }
  if (field.enum) validators.push(isIncluded(field.enum));
  if (field.type === 'integer') {
    validators.push(isNumber);
    if (field.minimum) {
      if (field.exclusiveMinimum) {
        validators.push(minValue(field.minimum));
      } else {
        validators.push(minValueInc(field.minimum));
      }
    }
    if (field.maximum) {
      if (field.exclusiveMaximum) {
        validators.push(maxValue(field.maximum));
      } else {
        validators.push(maxValueInc(field.maximum));
      }
    }
  }

  return validators;
};
