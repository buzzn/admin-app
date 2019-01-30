import * as React from 'react';
import { reduxForm, Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Col, Row } from 'reactstrap';
import FieldToggle from 'components/field_toggle';

interface Props {
  handleSubmit: Function;
  group: { [key: string]: any };
  updateGroup: Function;
}

const Switches = ({
  handleSubmit,
  updateGroup,
  group,
}: Props) => {
  const submitForm = (values) => {
    const changed = Object.keys(values).reduce(
      (sum, key) => {
        if (values[key] !== group[key]) {
          return { ...sum, [key]: values[key] };
        }
        return sum;
      },
      { updatedAt: values.updatedAt },
    );
    return new Promise((resolve, reject) => {
      updateGroup({
        groupId: group.id,
        params: changed,
        resolve,
        reject,
      });
    });
  };
  const submit = handleSubmit(submitForm);

  const prefix = 'admin.groups';

  return (
    <Col xs="12">
      <form
        onSubmit={() => setTimeout(submit)}
        onBlur={(event) => {
          if (event.target.type !== 'checkbox') setTimeout(submit);
        }}
        // HACK
        onChange={(event: any) => {
          if (event.target.type === 'checkbox') setTimeout(submit);
        }}
      >
        <Row className="fieldgroup">
          <Col xs="4" className="fieldname">
            <FormattedMessage id={`${prefix}.visibility`} />
          </Col>
          <Col xs="8" className="grey-underline fieldvalue">
            <FormattedMessage id={`${prefix}.showObject`} />
            <Field className="float-right" name="showObject" component={FieldToggle} submitForm={submit} />
          </Col>
        </Row>
        <Row className="fieldgroup">
          <Col xs="4" className="fieldname" />
          <Col xs="8" className="grey-underline fieldvalue">
            <FormattedMessage id={`${prefix}.showProduction`} />
            <Field className="float-right" name="showProduction" component={FieldToggle} submitForm={submit} />
          </Col>
        </Row>
        <Row className="fieldgroup">
          <Col xs="4" className="fieldname" />
          <Col xs="8" className="grey-underline fieldvalue">
            <FormattedMessage id={`${prefix}.showEnergy`} />
            <Field className="float-right" name="showEnergy" component={FieldToggle} submitForm={submit} />
          </Col>
        </Row>
        <Row className="fieldgroup">
          <Col xs="4" className="fieldname" />
          <Col xs="8" className="grey-underline fieldvalue">
            <FormattedMessage id={`${prefix}.showContact`} />
            <Field className="float-right" name="showContact" component={FieldToggle} submitForm={submit} />
          </Col>
        </Row>
        <Row className="fieldgroup">
          <Col xs="4" className="fieldname" />
          <Col xs="8" className="grey-underline fieldvalue">
            <FormattedMessage id={`${prefix}.showDisplayApp`} />
            <Field className="float-right" name="showDisplayApp" component={FieldToggle} submitForm={submit} />
          </Col>
        </Row>
        {group.showDisplayApp && (
          <Row className="fieldgroup">
            <Col xs="4" className="fieldname" />
            <Col xs="8" className="grey-underline fieldvalue">
              <a href={group.displayAppUrl} target="_blank">
                <span style={{ textDecoration: 'underline' }}>{group.slug}</span>&nbsp;&nbsp;&nbsp;
                <i className="fa fa-s fa-external-link" />
              </a>
            </Col>
          </Row>
        )}
      </form>
    </Col>
  );
};

export default reduxForm({
  form: 'groupSwitchesForm',
  enableReinitialize: true,
})(Switches);
