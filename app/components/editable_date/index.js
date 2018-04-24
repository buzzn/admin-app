import * as React from 'react';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import { FormGroup } from 'components/style';

import './style.scss';

momentLocalizer(moment);

const EditableDate = ({
  editMode,
  input,
  dateFormat,
  inputFormats = [],
  meta: { touched, error, dirty },
}) => {
  if (editMode) {
    return (
      <FormGroup className={`editable-date ${touched && error && 'has-danger'}`}>
        <div className={`date-wrapper ${touched && error && 'form-control-danger'} ${dirty && 'dirty'}`}>
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
        </div>
        {touched &&
          !!error && (
            <React.Fragment>
              <div className="inline-error">{error}</div>
              <i className="error-icon buzzn-attention" />
            </React.Fragment>
          )}
      </FormGroup>
    );
  }
  return <span>{moment(input.value).format(dateFormat)}</span>;
};

EditableDate.defaultProps = { dateFormat: 'DD.MM.YYYY' };

export default EditableDate;
