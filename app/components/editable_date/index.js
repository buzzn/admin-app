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
        <DateTimePicker { ...input }
          time={ false }
          format={ dateFormat }
          value={ input.value ? moment(input.value, dateFormat).toDate() : null }
          onBlur={ () => input.onBlur(moment(input.value).format(dateFormat)) } />
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
  dateFormat: 'DD-MM-YYYY',
};

export default EditableDate;
