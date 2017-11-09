// @flow
import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { reduxForm } from 'redux-form';
import type { FormProps } from 'redux-form';
import EditableInput from 'components/editable_input';
import EditableSelect from 'components/editable_select';
import TwoColField from 'components/two_col_field';
import EditableDate from 'components/editable_date';
import { dateNormalizer } from 'validation_normalizers';

type Props = {
  isOpen: boolean,
  toggle: Function,
  addReading: Function,
  validationRules: Object,
} & FormProps;

const AddReading = ({ isOpen, toggle, addReading, handleSubmit, pristine, submitting, validationRules }: Props) => {
  const submit = values => new Promise((resolve, reject) => {
    addReading({
      params: values,
      resolve,
      reject,
    });
  });

  const prefix = 'admin.readings';

  return (
    <Modal size="lg" isOpen={ isOpen } toggle={ toggle }>
      <ModalHeader toggle={ toggle }>Add reading</ModalHeader>
      <ModalBody>
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
      </ModalBody>
      <ModalFooter>
        <button type="submit" form="readingAddForm" className="btn btn-warning" disabled={ pristine || submitting }>Submit</button>
        <button onClick={ toggle } className="btn btn-warning" disabled={ submitting }>Cancel</button>
      </ModalFooter>
    </Modal>
  );
};

export default reduxForm({
  form: 'readingAddForm',
})(AddReading);
