import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import ModalWrapper from 'components/modal_wrapper';
import EditableInput from 'components/editable_input';
import EditableSelect from 'components/editable_select';
import TwoColField from 'components/two_col_field';
import EditableDate from 'components/editable_date';
import { dateNormalizer } from 'validation_normalizers';

const AddReading = ({ isOpen, toggle, addReading, handleSubmit, pristine, submitting, validationRules, groupId, meterId, registerId }) => {
  const submit = values => new Promise((resolve, reject) => {
    addReading({
      groupId,
      meterId,
      registerId,
      params: values,
      resolve,
      reject,
    });
  });

  const prefix = 'admin.readings';

  return (
    <ModalWrapper
      modalTitle="Add reading"
      buttons={[
        { id: 1, text: 'Submit', type: 'submit', form: 'readingAddForm', className: 'btn-warning', disabled: pristine || submitting },
        { id: 2, text: 'Cancel', onClick: toggle, className: 'btn-warning', disabled: submitting },
      ]}
      isOpen={ isOpen }
      toggle={ toggle }>
      <form id="readingAddForm" onSubmit={ handleSubmit(submit) }>
        <div className="container-fluid">
          <div className="row">
            <div className="col-6">
              <TwoColField
                prefix={ prefix }
                name="date"
                editMode={ true }
                validationRules={ validationRules }
                normalize={ dateNormalizer('YYYY-MM-DD') }
                component={ EditableDate }
                defaultDate={ new Date() }
              />
              <TwoColField
                prefix={ prefix }
                name="rawValue"
                editMode={ true }
                validationRules={ validationRules }
                component={ EditableInput }
              />
              <TwoColField
                prefix={ prefix }
                name="value"
                editMode={ true }
                validationRules={ validationRules }
                component={ EditableInput }
              />
              <TwoColField
                prefix={ prefix }
                name="unit"
                editMode={ true }
                validationRules={ validationRules }
                component={ EditableSelect }
              />
              <TwoColField
                prefix={ prefix }
                name="reason"
                editMode={ true }
                validationRules={ validationRules }
                component={ EditableSelect }
              />
            </div>
            <div className="col-6">
              <TwoColField
                prefix={ prefix }
                name="readBy"
                editMode={ true }
                validationRules={ validationRules }
                component={ EditableSelect }
              />
              <TwoColField
                prefix={ prefix }
                name="quality"
                editMode={ true }
                validationRules={ validationRules }
                component={ EditableSelect }
              />
              <TwoColField
                prefix={ prefix }
                name="source"
                editMode={ true }
                validationRules={ validationRules }
                component={ EditableSelect }
              />
              <TwoColField
                prefix={ prefix }
                name="status"
                editMode={ true }
                validationRules={ validationRules }
                component={ EditableSelect }
              />
              <TwoColField
                prefix={ prefix }
                name="comment"
                editMode={ true }
                validationRules={ validationRules }
                component={ EditableInput }
              />
            </div>
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
};

AddReading.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  addReading: PropTypes.func.isRequired,
  validationRules: PropTypes.object.isRequired,
  groupId: PropTypes.string.isRequired,
  meterId: PropTypes.string.isRequired,
  registerId: PropTypes.string.isRequired,
};

export default reduxForm({
  form: 'readingAddForm',
})(AddReading);
