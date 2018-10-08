import * as React from 'react';
import { reduxForm, FieldArray } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Col } from 'reactstrap';
import pullAt from 'lodash/pullAt';
import withEditOverlay from 'components/with_edit_overlay';
import FormPanel from 'components/form_panel';
import TwoColField from 'components/two_col_field';
import EditableInput from 'components/editable_input';
import EditableDate from 'components/editable_date';
import EditableSelect from 'components/editable_select';
import { dateNormalizer, numberNormalizer } from 'validation_normalizers';
import RegisterFields from './register_fields';

interface Props {
  url: string;
  history: any;
  setEditMode: (boolean) => void;
  editMode: boolean;
  clearInitMeter: Function;
  initialize: Function;
  addMeter: (any) => void;
  loadMarketLocations: () => void;
  marketLocations: Array<{ [key: string]: any }>;
  handleSubmit: Function;
  pristine: boolean;
  submitting: boolean;
  validationRules: {};
}

class AddMeter extends React.Component<Props> {
  state = { selectedRegisters: [] };

  addSelectedRegister = () => {
    const { selectedRegisters } = this.state;
    // @ts-ignore
    selectedRegisters.push(null);
    this.setState({ selectedRegisters });
  };

  deleteSelectedRegister = (idx) => {
    const { selectedRegisters } = this.state;
    pullAt(selectedRegisters, [idx]);
    this.setState({ selectedRegisters });
  };

  setSelectedRegister = (idx, value) => {
    const { selectedRegisters } = this.state;
    // @ts-ignore
    selectedRegisters[idx] = value;
    this.setState({ selectedRegisters });
  };

  componentDidMount() {
    const { setEditMode, loadMarketLocations, marketLocations } = this.props;
    setEditMode(true);
    if (!marketLocations.length) loadMarketLocations();
  }

  componentWillUnmount() {
    this.props.setEditMode(false);
  }

  submitForm = (values) => {
    const params = { ...values };
    const { addMeter, history, url, clearInitMeter } = this.props;
    const { selectedRegisters } = this.state;
    params.registers = Object.values(params.registers);
    selectedRegisters.forEach((s, i) => {
      // @ts-ignore
      if (s && s.value) params.registers[i] = { id: s.value };
    });

    return new Promise((resolve, reject) => {
      addMeter({
        params,
        resolve,
        reject,
      });
    }).then(() => {
      clearInitMeter();
      history.push(url);
    });
  };

  render() {
    const {
      handleSubmit,
      editMode,
      pristine,
      history,
      url,
      submitting,
      validationRules,
      marketLocations,
      clearInitMeter,
      initialize,
    } = this.props;
    const { selectedRegisters } = this.state;

    const prefix = 'admin.meters';

    return (
      <Col xs={12}>
        <form onSubmit={handleSubmit(this.submitForm)}>
          <FormPanel
            {...{
              editMode,
              dirty: !pristine,
              onCancel: () => {
                initialize({});
                clearInitMeter();
                history.push(url);
              },
              cancelDisabled: submitting,
              onSave: handleSubmit(this.submitForm),
              saveDisabled: pristine || submitting,
            }}
          >
            <p className="h5 grey-underline header text-uppercase">
              <FormattedMessage id={`${prefix}.headerAddMeter`} />
            </p>
            <TwoColField
              {...{
                prefix,
                name: 'type',
                editMode,
                validationRules,
                component: EditableSelect,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'productSerialnumber',
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
              {...{
                prefix,
                name: 'productName',
                editMode,
                validationRules,
                component: EditableInput,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'manufacturerName',
                editMode,
                validationRules,
                component: EditableSelect,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'manufacturerDescription',
                editMode,
                validationRules,
                component: EditableInput,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'locationDescription',
                editMode,
                validationRules,
                component: EditableInput,
              }}
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
                name: 'ownership',
                editMode,
                validationRules,
                component: EditableSelect,
              }}
            />
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
                name: 'sentDataDso',
                editMode,
                validationRules,
                component: EditableDate,
                normalize: dateNormalizer('YYYY-MM-DD'),
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'converterConstant',
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
            <TwoColField
              {...{
                prefix,
                name: 'directionNumber',
                editMode,
                validationRules,
                component: EditableSelect,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'edifactMeteringType',
                editMode,
                validationRules,
                component: EditableSelect,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'edifactMeterSize',
                editMode,
                validationRules,
                component: EditableSelect,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'edifactMeasurementMethod',
                editMode,
                validationRules,
                component: EditableSelect,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'edifactTariff',
                editMode,
                validationRules,
                component: EditableSelect,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'edifactMountingMethod',
                editMode,
                validationRules,
                component: EditableSelect,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'edifactVoltageLevel',
                editMode,
                validationRules,
                component: EditableSelect,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'edifactCycleInterval',
                editMode,
                validationRules,
                component: EditableSelect,
              }}
            />
            <TwoColField
              {...{
                prefix,
                name: 'edifactDataLogging',
                editMode,
                validationRules,
                component: EditableSelect,
              }}
            />
            <FieldArray
              {...{
                label: <FormattedMessage id={`${prefix}.registers`} />,
                name: 'registers',
                component: RegisterFields,
                validationRules,
                prefix,
                editMode,
                addSelectedRegister: this.addSelectedRegister,
                deleteSelectedRegister: this.deleteSelectedRegister,
                setSelectedRegister: this.setSelectedRegister,
                selectedRegisters,
                marketLocations,
              }}
            />
          </FormPanel>
        </form>
      </Col>
    );
  }
}

export default reduxForm({
  form: 'addMeter',
  enableReinitialize: true,
  // HACK: see #3729, #3362 in redux-form
  keepDirtyOnReinitialize: true,
  onSubmitSuccess: (_result, _dispatch, { initialize, clearInitMeter }) => {
    initialize({});
    clearInitMeter();
  },
})(withEditOverlay(AddMeter));
