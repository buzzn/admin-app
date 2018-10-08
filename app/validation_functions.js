import moment from 'moment';

export const required = value => (value ? undefined : 'Required');

export const isString = value => (value === undefined || value === null || typeof value === 'string' ? undefined : 'Must be a string');

export const maxLength = max => value => (value === undefined || value === null || value.length <= max ? undefined : `Must be ${max} characters or less`);

export const minLength = min => value => (value === undefined || value === null || value.length >= min ? undefined : `Must be ${min} characters or more`);

export const isNumber = value => (value === undefined || !isNaN(Number(value)) ? undefined : 'Must be a number');

export const minValue = min => value => (value === undefined || value > min ? undefined : `Must be at least ${min}`);

export const maxValue = max => value => (value === undefined || value < max ? undefined : `Must be at least ${max}`);

export const minValueInc = min => value => (value === undefined || value >= min ? undefined : `Must be at least ${min}`);

export const maxValueInc = max => value => (value === undefined || value <= max ? undefined : `Must be at least ${max}`);

export const isEmail = value => (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'Invalid email address' : undefined);

export const isAlphaNumeric = value => (value && /[^a-zA-Z0-9 ]/i.test(value) ? 'Only alphanumeric characters' : undefined);

export const isPhoneNumber = value => (value && !/^(0|[1-9][0-9]{9})$/i.test(value) ? 'Invalid phone number, must be 10 digits' : undefined);

export const isIncluded = list => value => (value === undefined || value === null || list.includes(value) ? undefined : 'Must be the one of the values');

export const isDate = value => (value === undefined || value === '' || value === null || moment(value).isValid() ? undefined : 'Must be a valid date');

export const fieldValidator = (field) => {
  const validators = [];
  if (!field) return validators;

  if (field.required) validators.push(required);
  if (field.type === 'string' && field.format === 'date') {
    validators.push(isDate);
  } else if (field.type === 'string') {
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
