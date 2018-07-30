import * as React from 'react';
import moment from 'moment';
import { reduxForm, Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Col, Row } from 'reactstrap';
import withEditOverlay from 'components/with_edit_overlay';
import FormPanel from 'components/form_panel';
import FieldToggle from 'components/field_toggle';
import { DeleteButton } from 'components/style';

interface Props {
  editMode: boolean;
  switchEditMode: () => void;
  handleSubmit: (Function) => void;
  submitGroup: () => void;
  group: { [key: string]: any };
  deleteGroup: () => void;
  address: { [key: string]: any };
  transmissionSystemOperator: { [key: string]: any };
  distributionSystemOperator: { [key: string]: any };
  electricitySupplier: { [key: string]: any };
}

const Group = ({
  handleSubmit,
  submitGroup,
  group,
  deleteGroup,
  address,
  transmissionSystemOperator,
  distributionSystemOperator,
  electricitySupplier,
  editMode,
  switchEditMode,
}: Props) => {
  const submitForm = handleSubmit(submitGroup);
  const prefix = 'admin.groups';
  const addressPrefix = 'admin.addresses';

  return (
    <Col xs="12">
      <form
        onSubmit={() => setTimeout(submitForm)}
        onBlur={(event) => {
          if (event.target.type !== 'checkbox') setTimeout(submitForm);
        }}
        // HACK
        onChange={(event: any) => {
          if (event.target.type === 'checkbox') setTimeout(submitForm);
        }}
      >
        <p className="h5 grey-underline header text-uppercase">
          <FormattedMessage id={`${prefix}.headerGroup`} />
          {!editMode &&
            group.updatable && <i data-cy="group edit switch" className="buzzn-pencil" style={{ float: 'right' }} onClick={switchEditMode} />}
        </p>
        <FormPanel
          {...{
            editMode,
            dirty: false,
            onCancel: () => {
              switchEditMode();
            },
            cancelDisabled: false,
            onSave: () => null,
            saveDisabled: true,
          }}
        >
          <Row className="fieldgroup">
            <Col xs="4" className="fieldname">
              <FormattedMessage id={`${prefix}.name`} />
            </Col>
            <Col xs="8" className="grey-underline fieldvalue">
              {group.name}
            </Col>
          </Row>
          <Row className="fieldgroup">
            <Col xs="4" className="fieldname">
              <FormattedMessage id={`${addressPrefix}.address`} />
            </Col>
            <Col xs="8" className="grey-underline fieldvalue">
              {address.street}
            </Col>
          </Row>
          <Row className="fieldgroup">
            <Col xs="4" className="fieldname" />
            <Col xs="2" className="grey-underline fieldvalue">
              {address.zip}
            </Col>
            <Col xs="6" className="grey-underline fieldvalue">
              {address.city}
            </Col>
          </Row>
          <Row className="fieldgroup">
            <Col xs="4" className="fieldname">
              <FormattedMessage id={`${prefix}.startDate`} />
            </Col>
            <Col xs="8" className="grey-underline fieldvalue">
              {group.startDate ? moment(group.startDate).format('DD.MM.YYYY') : ''}
            </Col>
          </Row>
          <Row className="fieldgroup">
            <Col xs="4" className="fieldname">
              <FormattedMessage id={`${prefix}.transmissionSystemOperator`} />
            </Col>
            <Col xs="8" className="grey-underline fieldvalue">
              {transmissionSystemOperator.name}
            </Col>
          </Row>
          <Row className="fieldgroup">
            <Col xs="4" className="fieldname">
              <FormattedMessage id={`${prefix}.distributionSystemOperator`} />
            </Col>
            <Col xs="8" className="grey-underline fieldvalue">
              {distributionSystemOperator.name}
            </Col>
          </Row>
          <Row className="fieldgroup">
            <Col xs="4" className="fieldname">
              <FormattedMessage id={`${prefix}.electricitySupplier`} />
            </Col>
            <Col xs="8" className="grey-underline fieldvalue">
              {electricitySupplier.name}
            </Col>
          </Row>
          {editMode &&
            group.deletable && (
              <Row>
                <Col xs="12">
                  <br />
                  <DeleteButton
                    data-cy="group delete button"
                    className="btn btn-primary"
                    onClick={() => {
                      switchEditMode();
                      deleteGroup();
                    }}
                  >
                    <FormattedMessage id="admin.buttons.delete" />
                  </DeleteButton>
                </Col>
              </Row>
            )}
        </FormPanel>
        <Row className="fieldgroup">
          <Col xs="4" className="fieldname">
            <FormattedMessage id={`${prefix}.visibility`} />
          </Col>
          <Col xs="8" className="grey-underline fieldvalue">
            <FormattedMessage id={`${prefix}.showObject`} />
            <Field className="float-right" name="showObject" component={FieldToggle} submitForm={submitForm} />
          </Col>
        </Row>
        <Row className="fieldgroup">
          <Col xs="4" className="fieldname" />
          <Col xs="8" className="grey-underline fieldvalue">
            <FormattedMessage id={`${prefix}.showProduction`} />
            <Field className="float-right" name="showProduction" component={FieldToggle} submitForm={submitForm} />
          </Col>
        </Row>
        <Row className="fieldgroup">
          <Col xs="4" className="fieldname" />
          <Col xs="8" className="grey-underline fieldvalue">
            <FormattedMessage id={`${prefix}.showEnergy`} />
            <Field className="float-right" name="showEnergy" component={FieldToggle} submitForm={submitForm} />
          </Col>
        </Row>
        <Row className="fieldgroup">
          <Col xs="4" className="fieldname" />
          <Col xs="8" className="grey-underline fieldvalue">
            <FormattedMessage id={`${prefix}.showContact`} />
            <Field className="float-right" name="showContact" component={FieldToggle} submitForm={submitForm} />
          </Col>
        </Row>
        <Row className="fieldgroup">
          <Col xs="4" className="fieldname" />
          <Col xs="8" className="grey-underline fieldvalue">
            <FormattedMessage id={`${prefix}.showDisplayApp`} />
            <Field className="float-right" name="showDisplayApp" component={FieldToggle} submitForm={submitForm} />
          </Col>
        </Row>
        {group.showDisplayApp && (
          <Row className="fieldgroup">
            <Col xs="4" className="fieldname" />
            <Col xs="8" className="grey-underline fieldvalue">
              <a href={group.displayAppUrl} target="_blank">
                <span style={{ textDecoration: 'underline' }}>{group.slug}</span>&nbsp;&nbsp;&nbsp;<i className="fa fa-s fa-external-link" />
              </a>
            </Col>
          </Row>
        )}
      </form>
    </Col>
  );
};

export default reduxForm({
  form: 'groupUpdateForm',
  enableReinitialize: true,
})(withEditOverlay(Group));
