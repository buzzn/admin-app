import * as React from 'react';
import ReactTable from 'react-table';
import { reduxForm } from 'redux-form';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import moment from 'moment';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';
import { Row, Col } from 'reactstrap';
import Alert from 'react-s-alert';
import withEditOverlay from 'components/with_edit_overlay';
import FormPanel from 'components/form_panel';
import { MeterHeader, MeterTitle } from './style';
import EditableInput from 'components/editable_input';
import EditableSelect from 'components/editable_select';
import TwoColField from 'components/two_col_field';
import EditableDate from 'components/editable_date';
import { dateNormalizer, numberNormalizer } from 'validation_normalizers';

interface Props {
  meter: any;
}

interface State {
  expanded: { [key: number]: boolean };
}

class MeterData extends React.Component<Props & InjectedIntlProps, State> {
  state = { expanded: {} };

  handleRowClick(rowNum) {
    this.setState(state => ({ expanded: { ...state.expanded, [rowNum]: !state.expanded[rowNum] } }));
  }

  render() {
    const {
      meter,
      intl,
      editMode,
      switchEditMode,
      updateMeter,
      handleSubmit,
      pristine,
      reset,
      submitting,
      validationRules,
      groupId,
    } = this.props;

    const data = get(meter.registers, 'array', []).map(r => ({
      ...r,
      lastReading: get(r.readings, 'array[0]', {}),
    }));

    const columns = [
      {
        Header: () => <FormattedMessage id="admin.registers.tableName" />,
        accessor: 'marketLocation.name',
        filterable: false,
        sortable: false,
      },
      {
        Header: () => <FormattedMessage id="admin.readings.tableDate" />,
        accessor: 'lastReading.date',
        filterable: false,
        sortable: false,
        Cell: ({ value }) => <span>{value ? moment(value).format('DD.MM.YYYY') : ''}</span>,
      },
      {
        Header: () => <FormattedMessage id="admin.readings.tableValue" />,
        accessor: 'lastReading.value',
        filterable: false,
        sortable: false,
        Cell: row => <span>{row.value ? `${intl.formatNumber(row.value / 1000)} kWh` : ''}</span>,
      },
      {
        Header: () => <FormattedMessage id="admin.readings.tableReason" />,
        accessor: 'lastReading.reason',
        filterable: false,
        sortable: false,
        Cell: row => <span>{row.value ? <FormattedMessage id={`admin.readings.${row.value}`} /> : ''}</span>,
      },
      {
        expander: true,
        Expander: row =>
          (row.original.lastReading.value ? (
            <div>{row.isExpanded ? <i className="fa fa-chevron-up" /> : <i className="fa fa-chevron-down" />}</div>
          ) : (
            ''
          )),
        style: { color: '#bdbdbd' },
      },
    ];

    const prefix = 'admin.meters';

    const submit = values =>
      new Promise((resolve, reject) => {
        updateMeter({
          meterId: meter.id,
          params: values,
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
            <MeterTitle>
              <FormattedMessage id={`${prefix}.headerRegistersReadings`} />
            </MeterTitle>
            <ReactTable
              {...{
                data: orderBy(data, 'lastReading.date', 'desc'),
                columns,
                SubComponent: row => (
                  <Row
                    style={{
                      backgroundColor: '#F5F5F5',
                      boxShadow: 'inset 0 1px 8px 0 rgba(0,0,0,0.07)',
                      padding: '20px 10px',
                      margin: 0,
                    }}
                  >
                    <Col sm="4">
                      <b>
                        <FormattedMessage id={'admin.readings.status'} />:
                      </b>{' '}
                      <FormattedMessage id={`admin.readings.${row.original.lastReading.status}`} />
                    </Col>
                    <Col sm="4">
                      <b>
                        <FormattedMessage id={'admin.readings.quality'} />:
                      </b>{' '}
                      <FormattedMessage id={`admin.readings.${row.original.lastReading.quality}`} />
                    </Col>
                    <Col sm="4">
                      <b>
                        <FormattedMessage id={'admin.readings.readBy'} />:
                      </b>{' '}
                      <FormattedMessage id={`admin.readings.${row.original.lastReading.readBy}`} />
                    </Col>
                    {row.original.lastReading.comment && (
                      <Col sm="12" style={{ marginTop: '10px' }}>
                        <b>
                          <FormattedMessage id={'admin.readings.comment'} />:
                        </b>{' '}
                        {row.original.lastReading.comment}
                      </Col>
                    )}
                  </Row>
                ),
                expanded: this.state.expanded,
                getTrProps: (_state, rowInfo) => ({
                  onClick: (_event, handleOriginal) => {
                    rowInfo.original.lastReading.value && this.handleRowClick(rowInfo.viewIndex);
                    handleOriginal && handleOriginal();
                  },
                }),
              }}
            />
          </Col>
        </Row>
        <React.Fragment>
          <form onSubmit={handleSubmit(submit)}>
            <FormPanel
              {...{
                editMode,
                onCancel: () => {
                  reset();
                  switchEditMode();
                },
                cancelDisabled: submitting,
                onSave: handleSubmit(submit),
                saveDisabled: pristine || submitting,
              }}
            >
              <MeterTitle>
                <FormattedMessage id={`${prefix}.headerMeterDetails`} />
                {!editMode && meter.updatable && <i className="buzzn-pencil" onClick={switchEditMode} />}
              </MeterTitle>
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
                {...{ prefix, name: 'locationDescription', editMode, validationRules, component: EditableInput }}
              />
              <Row className="fieldgroup">
                <Col xs="4" className="fieldname">
                  <FormattedMessage id={`${prefix}.dataSource`} />
                </Col>
                <Col xs="8" className="grey-underline fieldvalue">
                  <FormattedMessage id={`${prefix}.${meter.dataSource}`} />
                </Col>
              </Row>
              <TwoColField
                {...{ prefix, name: 'directionNumber', editMode, validationRules, component: EditableSelect }}
              />
              <TwoColField
                {...{ prefix, name: 'productSerialnumber', editMode, validationRules, component: EditableInput }}
              />
              <Row className="fieldgroup">
                <Col xs="4" className="fieldname">
                  <FormattedMessage id={`${prefix}.sequenceNumber`} />
                </Col>
                <Col xs="8" className="grey-underline fieldvalue">
                  {meter.sequenceNumber}
                </Col>
              </Row>
              <Row className="fieldgroup">
                <Col xs="4" className="fieldname">
                  <FormattedMessage id={`${prefix}.type`} />
                </Col>
                <Col xs="8" className="grey-underline fieldvalue">
                  <FormattedMessage id={`${prefix}.${meter.type}`} />
                </Col>
              </Row>
              <MeterTitle>
                <FormattedMessage id={`${prefix}.headerEdifactInformation`} />
              </MeterTitle>
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

export default injectIntl(withEditOverlay(reduxForm({ form: 'meterUpdateForm', enableReinitialize: true })(MeterData)));
