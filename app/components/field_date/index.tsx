import * as React from 'react';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import { FormGroup } from 'components/style';

momentLocalizer(moment);

const DateField = ({ label, input, dateFormat = 'DD-MM-YYYY', defaultDate, meta: { active, touched, error } }) => (
  <FormGroup className={`form-group ${touched && error && 'has-danger'}`}>
    <DateTimePicker
      {...input}
      time={false}
      format={dateFormat}
      editFormat={dateFormat}
      value={input.value ? moment(input.value).toDate() : null}
      onBlur={() => input.onBlur(moment(input.value || defaultDate).toDate())}
    />
    <label className={`${!!input.value || active ? 'top' : 'center'}`}>{label}</label>
    {touched && error && <div className="form-control-feedback">{error}</div>}
  </FormGroup>
);

export default DateField;
