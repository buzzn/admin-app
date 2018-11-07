import * as React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Row, Col } from 'reactstrap';
import { reduxForm } from 'redux-form';
import Alert from 'react-s-alert';
import withEditOverlay from 'components/with_edit_overlay';
import FormPanel from 'components/form_panel';
import { FormTitle } from 'components/style';

interface Props {
  register: any;
  meter: any;
  url: string;
  editMode: boolean;
  switchEditMode: () => void;
  updateRegister: Function;
  handleSubmit: Function;
  pristine: boolean;
  reset: Function;
  submitting: boolean;
  groupId: string;
}

class RegisterData extends React.Component<Props> {
  render() {
    const {
      register,
      meter,
      url,
      editMode,
      switchEditMode,
      updateRegister,
      handleSubmit,
      pristine,
      reset,
      submitting,
      groupId,
    } = this.props;

    const prefix = 'admin.registers';

    const submit = params => new Promise((resolve, reject) => {
      updateRegister({
        registerId: register.id,
        params,
        resolve,
        reject,
        groupId,
      });
    }).then(() => {
      Alert.success('Saved!');
      switchEditMode();
    });

    return (
      <div>
        <form onSubmit={handleSubmit(submit)}>
          <FormPanel
            {...{
              editMode,
              dirty: !pristine,
              onCancel: () => {
                reset();
                switchEditMode();
              },
              cancelDisabled: submitting,
              onSave: handleSubmit(submit),
              saveDisabled: pristine || submitting,
            }}
          >
            <FormTitle>
              <FormattedMessage id={`${prefix}.headerRegisterDetails`} />
              {!editMode && register.updatable && <i className="buzzn-pencil" onClick={switchEditMode} />}
            </FormTitle>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname">
                <FormattedMessage id={`${prefix}.obis`} />
              </Col>
              <Col xs="8" className="grey-underline fieldvalue">
                {register.obis}
              </Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname">
                <FormattedMessage id={`${prefix}.label`} />
              </Col>
              <Col xs="8" className="grey-underline fieldvalue">
                <FormattedMessage id={`${prefix}.${register.registerMeta.label}`} />
              </Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname">
                <FormattedMessage id={`${prefix}.direction`} />
              </Col>
              <Col xs="8" className="grey-underline fieldvalue">
                {register.direction}
              </Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname">
                <FormattedMessage id="admin.marketLocations.name" />
              </Col>
              <Col xs="8" className="grey-underline fieldvalue">
                <Link to={`${url}/${register.registerMeta.id}`}>{register.registerMeta.name}</Link>
              </Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname">
                <FormattedMessage id="admin.meters.productSerialnumber" />
              </Col>
              <Col xs="8" className="grey-underline fieldvalue">
                {meter.productSerialnumber}
              </Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname">
                <FormattedMessage id={`${prefix}.meteringPointId`} />
              </Col>
              <Col xs="8" className="grey-underline fieldvalue">
                {register.meteringPointId}
              </Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname">
                <FormattedMessage id={`${prefix}.shareGroup`} />
              </Col>
              <Col xs="8" className="grey-underline fieldvalue">
                {register.shareWithGroup ? 'Yes' : 'No'}
              </Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname">
                <FormattedMessage id={`${prefix}.sharePublicly`} />
              </Col>
              <Col xs="8" className="grey-underline fieldvalue">
                {register.sharePublicly ? 'Yes' : 'No'}
              </Col>
            </Row>
            <p className="h5 grey-underline header" style={{ marginTop: '2rem' }}>
              <FormattedMessage id="admin.registers.headerEdifactInformation" />
            </p>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname">
                <FormattedMessage id={`${prefix}.postDecimalPosition`} />
              </Col>
              <Col xs="8" className="grey-underline fieldvalue">
                {register.postDecimalPosition}
              </Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname">
                <FormattedMessage id={`${prefix}.preDecimalPosition`} />
              </Col>
              <Col xs="8" className="grey-underline fieldvalue">
                {register.preDecimalPosition}
              </Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname">
                <FormattedMessage id={`${prefix}.lowLoadAbility`} />
              </Col>
              <Col xs="8" className="grey-underline fieldvalue">
                {register.lowLoadAbility ? 'Yes' : 'No'}
              </Col>
            </Row>
          </FormPanel>
        </form>
      </div>
    );
  }
}

export default withEditOverlay(reduxForm({ form: 'registerUpdateForm', enableReinitialize: true })(RegisterData));
