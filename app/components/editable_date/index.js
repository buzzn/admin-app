import React from 'react';
import PropTypes from 'prop-types';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import moment from 'moment';
import momentLocalizer from 'react-widgets-moment';

momentLocalizer(moment);

const EditableDate = ({ editMode, input, dateFormat, meta: { touched, error } }) => {
  if (editMode) {
    return (
      <div className={ `editable-input form-group ${(touched && error) && 'has-danger'}` }>
        <DateTimePicker {...input}
          time={false}
          format={dateFormat}
          value={moment(input.value).toDate()}
          onBlur={() => input.onBlur(input.value)} />
        { touched && error && <div className="form-control-feedback">{ error }</div> }
      </div>
    );
  }
  return <span>{ moment(input.value).format(dateFormat) }</span>;
};

EditableDate.propTypes = {
  editMode: PropTypes.bool.isRequired,
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  dateFormat: PropTypes.string,
};

EditableDate.defaultProps = {
  dateFormat: 'YYYY-MM-DD',
};

export default EditableDate;
