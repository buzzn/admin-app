import * as React from 'react';
import { reduxForm } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Row, Col } from 'reactstrap';
import Alert from 'react-s-alert';
import withEditOverlay from 'components/with_edit_overlay';
import FormPanel from 'components/form_panel';
import EditableInput from 'components/editable_input';
import EditableSelect from 'components/editable_select';
import TwoColView from 'components/two_col_view';
import TwoColField from 'components/two_col_field';
import EditableDate from 'components/editable_date';
import { dateNormalizer, numberNormalizer } from 'validation_normalizers';
import { FormTitle } from 'components/style';
import RegistersList from './registers_list';
import { MeterHeader } from './style';

interface Props {
  meter: any;
  editMode: boolean;
  switchEditMode: () => void;
  updateMeter: Function;
  handleSubmit: Function;
  pristine: boolean;
  reset: Function;
  submitting: boolean;
  validationRules: any;
  groupId: string;
  url: string;
  history: any;
}

class MeterData extends React.Component<Props> {
  render() {
    const {
      meter,
      editMode,
      switchEditMode,
      updateMeter,
      handleSubmit,
      pristine,
      reset,
      submitting,
      validationRules,
      groupId,
      url,
      history,
    } = this.props;

    const prefix = 'admin.meters';

    const submit = values => new Promise((resolve, reject) => {
      const { registers, ...params } = values;
      updateMeter({
        meterId: meter.id,
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
      <div className="meter-data">
        <MeterHeader>
          <Col xs="3">
            <div className="value">
              <FormattedMessage id={`${prefix}.${meter.manufacturerName}`} />
            </div>
            <div className="label">
              <FormattedMessage id={`${prefix}.manufacturerName`} />
            </div>
          </Col>
          <Col xs="3">
            <div className="value">{meter.productName}</div>
            <div className="label">
              <FormattedMessage id={`${prefix}.productName`} />
            </div>
          </Col>
          <Col xs="2">
            <div className="value">
              <FormattedMessage id={`${prefix}.${meter.type}`} />
            </div>
            <div className="label">
              <FormattedMessage id={`${prefix}.type`} />
            </div>
          </Col>
          <Col xs="2">
            <div className="value">{meter.converterConstant}</div>
            <div className="label">
              <FormattedMessage id={`${prefix}.converterConstant`} />
            </div>
          </Col>
          <Col xs="1" />
        </MeterHeader>
        <Row>
          <Col xs="12">
            <FormTitle>
              <FormattedMessage id={`${prefix}.headerRegistersReadings`} />
            </FormTitle>
            <RegistersList {...{ registers: meter.registers, history, url }} />
          </Col>
        </Row>
        <React.Fragment>
          <form onSubmit={handleSubmit(submit)} data-cy="edit meter form">
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
                <FormattedMessage id={`${prefix}.headerMeterDetails`} />
                {!editMode && meter.updatable && (
                  <i className="buzzn-pencil" data-cy="meter edit switch" onClick={switchEditMode} />
                )}
              </FormTitle>
              <TwoColField
                {...{
                  prefix,
                  name: 'manufacturerName',
                  editMode,
                  validationRules,
                  component: EditableSelect,
                  withValue: true,
                }}
              />
              <TwoColField
                {...{ prefix, name: 'manufacturerDescription', editMode, validationRules, component: EditableInput }}
              />
              <TwoColField {...{ prefix, name: 'productName', editMode, validationRules, component: EditableInput }} />
              <TwoColField {...{ prefix, name: 'ownership', editMode, validationRules, component: EditableSelect }} />
              <TwoColField
                {...{
                  prefix,
                  name: 'buildYear',
                  editMode,
                  validationRules,
                  component: EditableInput,
                  normalize: numberNormalizer,
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'calibratedUntil',
                  editMode,
                  validationRules,
                  component: EditableDate,
                  normalize: dateNormalizer('YYYY-MM-DD'),
                }}
              />
              <TwoColView {...{ prefix, field: 'converterConstant' }}>{meter.converterConstant}</TwoColView>
              <TwoColField
                {...{ prefix, name: 'locationDescription', editMode, validationRules, component: EditableInput }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'meteringLocationId',
                  editMode,
                  validationRules,
                  component: EditableInput,
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'datasource',
                  editMode,
                  validationRules,
                  component: EditableSelect,
                }}
              />
              <TwoColField
                {...{ prefix, name: 'directionNumber', editMode, validationRules, component: EditableSelect }}
              />
              <TwoColField
                {...{ prefix, name: 'productSerialnumber', editMode, validationRules, component: EditableInput }}
              />
              <TwoColView {...{ prefix, field: 'sequenceNumber' }}>{meter.sequenceNumber}</TwoColView>
              <TwoColView {...{ prefix, field: 'type' }}>
                <FormattedMessage id={`${prefix}.${meter.type}`} />
              </TwoColView>
              <FormTitle>
                <FormattedMessage id={`${prefix}.headerEdifactInformation`} />
              </FormTitle>
              <TwoColField
                {...{
                  prefix,
                  name: 'edifactCycleInterval',
                  editMode,
                  validationRules,
                  component: EditableSelect,
                  withValue: true,
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'edifactDataLogging',
                  editMode,
                  validationRules,
                  component: EditableSelect,
                  withValue: true,
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'edifactMeasurementMethod',
                  editMode,
                  validationRules,
                  component: EditableSelect,
                  withValue: true,
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'edifactMeterSize',
                  editMode,
                  validationRules,
                  component: EditableSelect,
                  withValue: true,
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'edifactMeteringType',
                  editMode,
                  validationRules,
                  component: EditableSelect,
                  withValue: true,
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'edifactMountingMethod',
                  editMode,
                  validationRules,
                  component: EditableSelect,
                  withValue: true,
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'edifactTariff',
                  editMode,
                  validationRules,
                  component: EditableSelect,
                  withValue: true,
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'edifactVoltageLevel',
                  editMode,
                  validationRules,
                  component: EditableSelect,
                  withValue: true,
                }}
              />
            </FormPanel>
          </form>
        </React.Fragment>
      </div>
    );
  }
}

export default withEditOverlay(reduxForm({ form: 'meterUpdateForm', enableReinitialize: true })(MeterData));
