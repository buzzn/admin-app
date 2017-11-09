// @flow
import * as React from 'react';
import type { FormProps } from 'redux-form';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import moment from 'moment';
import momentLocalizer from 'react-widgets-moment';

import './style.scss';

momentLocalizer(moment);

type Props = {
  editMode: boolean,
  dateFormat?: string,
  defaultDate: Date,
} & FormProps;

const EditableDate = ({ editMode, input, dateFormat, defaultDate, meta: { touched, error } }: Props) => {
  if (editMode) {
    return (
      <div className={ `editable-date form-group ${(touched && error) && 'has-danger'}` }>
        <DateTimePicker { ...input }
                        time={ false }
                        format={ dateFormat }
                        editFormat={ dateFormat }
                        value={ input.value ? moment(input.value).toDate() : null }
                        onBlur={ () => input.onBlur(moment(input.value || defaultDate).toDate()) } />
        { touched && error && <div className="form-control-feedback">{ error }</div> }
      </div>
    );
  }
  return <span>{ moment(input.value).format(dateFormat) }</span>;
};

EditableDate.defaultProps = {
  dateFormat: 'DD-MM-YYYY',
};

export default EditableDate;
