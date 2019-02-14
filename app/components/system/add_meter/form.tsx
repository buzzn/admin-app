import * as React from 'react';
import { reduxForm, FieldArray } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Col, Row } from 'reactstrap';
import Select from 'react-select';
import Loading from 'components/loading';
import { mainStyle } from 'components/react_select_styles';
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
  loading: boolean;
  setEditMode: (boolean) => void;
  onSubmit: Function;
  editMode: boolean;
  initialize: Function;
  marketLocations: { _status: null | number; array: Array<{ [key: string]: any }> };
  handleSubmit: Function;
  pristine: boolean;
  submitting: boolean;
  validationRules: {};
}

class AddMeterForm extends React.Component<Props> {
  state = { selectedRegisters: [], selectedPreset: { value: 'custom', label: 'Custom meter' } };

  presets = [
    { value: 'custom', label: 'Custom meter', lockRegisters: false, registersNum: 1, init: {} },
    {
      value: 'transfer',
      label: 'Transfer meter',
      lockRegisters: true,
      registersNum: 2,
      init: { directionNumber: 'ZRZ' },
    },
    {
      value: 'demarcation',
      label: 'Demarcation meter',
      lockRegisters: true,
      registersNum: 2,
      init: { directionNumber: 'ZRZ' },
    },
    {
      value: 'production',
      label: 'Production meter',
      lockRegisters: true,
      registersNum: 1,
      init: { directionNumber: 'ERZ' },
    },
    {
      value: 'consumption',
      label: 'Consumption meter',
      lockRegisters: true,
      registersNum: 1,
      init: { directionNumber: 'ERZ' },
    },
  ];

  setPreset = (value) => {
    if (value.value === this.state.selectedPreset.value) return;
    const { initialize } = this.props;
    this.setState({ selectedPreset: value });
    const preset = this.presets.find(p => p.value === value.value);
    if (preset) initialize(preset.init);
  };

  setSelectedRegisters = (selectedRegisters) => {
    this.setState({ selectedRegisters });
  };

  componentDidMount() {
    const { setEditMode } = this.props;
    setEditMode(true);
  }

  componentWillUnmount() {
    this.props.setEditMode(false);
  }

  render() {
    const {
      handleSubmit,
      onSubmit,
      editMode,
      pristine,
      history,
      url,
      submitting,
      validationRules,
      marketLocations,
      initialize,
      loading,
    } = this.props;
    const { selectedPreset } = this.state;

    const prefix = 'admin.meters';
    const preset = this.presets.find(p => p.value === selectedPreset.value);

    const submit = (values) => onSubmit(values, this.state.selectedRegisters);

    return (
      <Row>
        <Col xs={12}>
          <form onSubmit={handleSubmit(submit)} data-cy="create meter form">
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
              <Row>
                <Col>
                  <div className="header1">
                    <Select
                      options={this.presets.map(p => ({ value: p.value, label: p.label }))}
                      onChange={value => this.setPreset(value)}
                      styles={mainStyle}
                      value={selectedPreset}
                    />
                  </div>
                </Col>
              </Row>
              {loading ? (
                <Loading {...{ minHeight: 4 }} />
              ) : (
                <FieldArray
                  {...{
                    label: <FormattedMessage id={`${prefix}.registers`} />,
                    name: 'registers',
                    component: RegisterFields,
                    validationRules,
                    prefix,
                    editMode,
                    setSelectedRegisters: this.setSelectedRegisters,
                    marketLocations: marketLocations.array,
                    preset,
                  }}
                />
              )}
              <p className="h5 header text-uppercase">
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
            </FormPanel>
          </form>
        </Col>
      </Row>
    );
  }
}

export default reduxForm({
  form: 'addMeter',
  enableReinitialize: true,
  // HACK: see #3729, #3362 in redux-form
  keepDirtyOnReinitialize: true,
  onSubmitSuccess: (_result, _dispatch, { initialize }) => {
    initialize({});
  },
})(withEditOverlay(AddMeterForm));
