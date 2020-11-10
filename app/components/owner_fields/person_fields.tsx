import * as React from 'react';
import { Row, Col } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import get from 'lodash/get';
import FieldValidationWrapper from 'components/field_validation_wrapper';
import EditableInput from 'components/editable_input';
import EditableSelect from 'components/editable_select';
import AddressFields from './address_fields';
import EditableCheckbox from '../editable_checkbox';
import { connect } from 'react-redux';
import Groups from '../../groups';
import Alert from 'react-s-alert';

interface Props {
  groupId?: number;
  path: string;
  editMode: boolean;
  overrideData: null | { [key: string]: any };
  validationRules: { [key: string]: any };
  legalRepresentation?: boolean;
  sendTestMail: Function;
}

const PersonFields = ({ groupId, path, editMode, overrideData, validationRules, legalRepresentation, sendTestMail }: Props) => {
  const fieldClassName = editMode ? 'editValue' : 'fieldvalue grey-underline';
  const prefix = 'admin.persons';
  const overrideAddress = overrideData ? (get(overrideData, `${path}address`) || get(overrideData, 'address') || {}) : null;

  const handleTestMail = (event) => {
    event.preventDefault();
    sendTestMail({ groupId, resolve: (res) => {
      Alert.success('<h4>' + res.message + '</h4> ' + res.receiver);
    }, reject: (...args) => {
      console.log('reject');
      Alert.error('<h4>' + 'ERROR' + '</h4> ' + JSON.stringify(args))
    }})
  }

  return (
    <React.Fragment>
      <Row className="fieldgroup">
        <Col xs="4" className="fieldname">
          <FormattedMessage
            id={`admin.persons.${legalRepresentation ? 'headerLegalRepresentation' : 'headerContact'}`}
          />
        </Col>
        <Col xs="8">
          <Row>
            <Col xs="2" className={fieldClassName}>
              <FieldValidationWrapper
                {...{
                  prefix,
                  withLabel: true,
                  name: `${path}prefix`,
                  component: EditableSelect,
                  editMode,
                  overrideData,
                  validationRules,
                }}
              />
            </Col>
            <Col xs="2" className={fieldClassName}>
              <FieldValidationWrapper
                {...{
                  prefix,
                  withLabel: true,
                  name: `${path}title`,
                  component: EditableSelect,
                  editMode,
                  overrideData,
                  validationRules,
                }}
              />
            </Col>
            <Col xs="4" className={fieldClassName}>
              <FieldValidationWrapper
                {...{
                  prefix,
                  withLabel: true,
                  name: `${path}firstName`,
                  component: EditableInput,
                  editMode,
                  overrideData,
                  validationRules,
                }}
              />
            </Col>
            <Col xs="4" className={fieldClassName}>
              <FieldValidationWrapper
                {...{
                  prefix,
                  withLabel: true,
                  name: `${path}lastName`,
                  component: EditableInput,
                  editMode,
                  overrideData,
                  validationRules,
                }}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      {!legalRepresentation && (
        <AddressFields
          {...{ editMode, path: `${path ? `${path}` : ''}address.`, overrideData: overrideAddress, validationRules }}
        />
      )}
      <Row className="fieldgroup">
        <Col xs="4" className="fieldname" />
        <Col xs="8" className={fieldClassName}>
          <FieldValidationWrapper
            {...{
              prefix,
              withLabel: true,
              name: `${path}phone`,
              component: EditableInput,
              editMode,
              overrideData,
              validationRules,
            }}
          />
        </Col>
      </Row>
      <Row className="fieldgroup">
        <Col xs="4" className="fieldname" />
        <Col xs="8" className={fieldClassName}>
          <FieldValidationWrapper
            {...{
              prefix,
              withLabel: true,
              name: `${path}fax`,
              component: EditableInput,
              editMode,
              overrideData,
              validationRules,
            }}
          />
        </Col>
      </Row>
      <Row className="fieldgroup">
        <Col xs="4" className="fieldname" />
        <Col xs="8" className={fieldClassName}>
          <FieldValidationWrapper
            {...{
              prefix,
              withLabel: true,
              name: `${path}email`,
              component: EditableInput,
              editMode,
              overrideData,
              validationRules,
            }}
          />
        </Col>
      </Row>
      { groupId ? (
        <div>
          <Row className="fieldgroup">
            <Col xs="4" className="fieldname">
              <FormattedMessage
                  id={`admin.persons.mailSettings`}
                />
            </Col>
            <Col xs="8">
              <FieldValidationWrapper
                  {...{
                    prefix,
                    withLabel: true,
                    name: `${path}emailBackendActive`,
                    component: EditableCheckbox,
                    editMode,
                    overrideData,
                    validationRules,
                  }}
                />
            </Col>
          </Row>
          <Row className="fieldgroup">
            <Col xs="4" className="fieldname">
              { !editMode ? (
                <button onClick={handleTestMail} className="btn btn-primary">
                  <FormattedMessage
                    id={`admin.persons.emailSendTestMail`}
                  />
                </button>
              ) : null}
            </Col>
            <Col xs="4" className={fieldClassName}>
              <FieldValidationWrapper
                {...{
                  prefix,
                  withLabel: true,
                  name: `${path}emailBackendHost`,
                  component: EditableInput,
                  editMode,
                  overrideData,
                  validationRules,
                }}
              />
            </Col>
            <Col xs="2" className={fieldClassName}>
              <FieldValidationWrapper
                {...{
                  prefix,
                  withLabel: true,
                  name: `${path}emailBackendEncryption`,
                  component: EditableSelect,
                  editMode,
                  listOverride: [
                    { value: 'NONE', label: 'none' },
                    { value: 'SSL/TLS', label: 'ssltls' },
                    { value: 'STARTTLS', label: 'starttls' }
                  ],
                  overrideData,
                  validationRules,
                }}
              />
            </Col>
            <Col xs="2" className={fieldClassName}>
              <FieldValidationWrapper
                {...{
                  prefix,
                  withLabel: true,
                  name: `${path}emailBackendPort`,
                  component: EditableInput,
                  editMode,
                  overrideData,
                  validationRules,
                }}
              />
            </Col>
          </Row>
          <Row className="fieldgroup">
            <Col xs="4" className="fieldname" />
            <Col xs="4" className={fieldClassName}>
              <FieldValidationWrapper
                {...{
                  prefix,
                  withLabel: true,
                  name: `${path}emailBackendUser`,
                  component: EditableInput,
                  editMode,
                  overrideData,
                  validationRules,
                }}
              />
            </Col>
            <Col xs="4" className={fieldClassName}>
              <FieldValidationWrapper
                {...{
                  prefix,
                  withLabel: true,
                  name: `${path}emailBackendPassword`,
                  component: EditableInput,
                  editMode,
                  overrideData,
                  validationRules,
                }}
              />
            </Col>
          </Row>
          <Row className="fieldgroup">
            <Col xs="4" className="fieldname" />
            <Col xs="8" className={fieldClassName}>
              <FieldValidationWrapper
                {...{
                  prefix,
                  withLabel: true,
                  name: `${path}emailBackendSignature`,
                  component: EditableInput,
                  editMode,
                  overrideData,
                  validationRules,
                }}
              />
            </Col>
          </Row>
        </div>
      ) : null }
      
    </React.Fragment>
  );
};
function mapStateToProps() {
  return {
  };
}

export default connect(
  mapStateToProps,
  {
    sendTestMail: Groups.actions.sendTestMail,
  },
)(PersonFields);
