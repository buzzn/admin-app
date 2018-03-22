import * as React from 'react';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import { FormGroup } from 'components/style';

momentLocalizer(moment);

const DateField = ({
  label,
  input,
  dateFormat = 'DD.MM.YYYY',
  inputFormats = [],
  meta: { active, touched, error },
}) => (
  <FormGroup className={`form-group ${touched && error && 'has-danger'}`}>
    <DateTimePicker
      {...input}
      time={false}
      format={dateFormat}
      parse={[dateFormat].concat(inputFormats)}
      value={input.value ? moment(input.value).toDate() : null}
      onBlur={() => {
        const value = moment(input.value).endOf('day');
        if (value.isValid()) {
          input.onBlur(value.toDate());
        } else {
          input.onBlur(null);
        }
      }}
    />
    <label className={`${!!input.value || active ? 'top' : 'center'}`}>{label}</label>
    {touched && error && <div className="form-control-feedback">{error}</div>}
  </FormGroup>
);

export default DateField;
