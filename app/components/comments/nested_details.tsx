import React, { useState } from 'react';
import { reduxForm } from 'redux-form';
import Alert from 'react-s-alert';

import TwoColField from 'components/two_col_field';
import EditableInput from 'components/editable_input';
import { NestedDetailsWrapper } from 'components/style';

const NestedDetails = ({ reset, handleSubmit, updateComment, deleteComment, validationRules }) => {
  const prefix = 'admin.comments';

  const [editMode, setEditMode] = useState(false);

  const submit = params => new Promise((resolve, reject) => {
    updateComment({ resolve, reject, params });
  }).then(() => {
    Alert.success('Saved');
  });

  return (
    <NestedDetailsWrapper>
      <form onSubmit={handleSubmit(submit)}>
        {!editMode && (
          <React.Fragment>
            <i className="buzzn-pencil float-right" onClick={() => setEditMode(true)} />
            <i className="fa fa-remove float-right" onClick={() => confirm('Are you sure?') && deleteComment()} />
          </React.Fragment>
        )}
        <br />
        {['author', 'content'].map(name => (
          <TwoColField
            {...{
              key: name,
              prefix,
              name,
              editMode,
              withLabel: true,
              validationRules,
              component: EditableInput,
            }}
          />
        ))}
        {editMode && (
          <React.Fragment>
            <button className="btn btn-primary" onClick={() => handleSubmit(submit)}>
              Save
            </button>
            <button
              className="btn btn-link"
              onClick={() => {
                reset();
                setEditMode(false);
              }}
            >
              Cancel
            </button>
          </React.Fragment>
        )}
      </form>
    </NestedDetailsWrapper>
  );
};

export default reduxForm({ enableReinitialize: true })(NestedDetails);
