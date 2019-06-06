import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { reduxForm, FieldArray } from 'redux-form';
import { Col, Row } from 'reactstrap';
import Alert from 'react-s-alert';

import FormPanel from 'components/form_panel';
import TwoColField from 'components/two_col_field';
import withEditOverlay from 'components/with_edit_overlay';
import EditableInput from 'components/editable_input';

import FunctionFields from './function_fields';

const AddOrganization = ({
  addOrganizationMarket,
  editMode,
  initialize,
  handleSubmit,
  history,
  pristine,
  setEditMode,
  submitting,
  validationRules,
  url,
}) => {
  useEffect(() => {
    setEditMode(true);
    return () => setEditMode(false);
  }, []);
  const prefix = 'admin.organizations';
  const submit = values => new Promise((resolve, reject) => {
    addOrganizationMarket({ params: values, resolve, reject });
  }).then(() => {
    Alert.success('Saved!');
    history.push(url);
  });

  return (
    <Row>
      <Col xs={12}>
        <form onSubmit={handleSubmit(submit)}>
          <FormPanel
            {...{
              editMode,
              dirty: !pristine,
              onCancel: () => {
                initialize({});
                history.push(url);
              },
              cancelDisabled: submitting,
              onSave: handleSubmit(submit),
              saveDisabled: pristine || submitting,
            }}
          >
            <p className="h5 header text-uppercase">
              <FormattedMessage id={`${prefix}.headerAddOrganizationMarket`} />
            </p>
            {['name', 'description', 'email', 'phone', 'fax', 'website'].map(name => (
              <TwoColField {...{ key: name, prefix, name, editMode, validationRules, component: EditableInput }} />
            ))}
            <FieldArray
              {...{
                name: 'functions',
                component: FunctionFields,
                prefix,
                editMode,
                validationRules,
              }}
            />
          </FormPanel>
        </form>
      </Col>
    </Row>
  );
};

export default reduxForm({
  form: 'addOrganizationMarket',
  enableReinitialize: true,
  // HACK: see #3729, #3362 in redux-form
  keepDirtyOnReinitialize: true,
  onSubmitSuccess: (_result, _dispatch, { initialize }) => {
    initialize({});
  },
})(withEditOverlay(AddOrganization));
