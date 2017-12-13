// @flow
import * as React from 'react';
import ReactTable from 'react-table';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';
import { Row, Col } from 'reactstrap';
import { tableParts as TableParts } from 'react_table_config';

import './style.scss';

type Props = {
  meter: Object,
};

type State = {
  expanded: {
    [number]: boolean,
  },
};

class MeterData extends React.Component<Props, State> {
  state = {
    expanded: {},
  }

  handleRowClick(rowNum: number) {
    this.setState(state => ({ expanded: { ...state.expanded, [rowNum]: !state.expanded[rowNum] } }));
  }

  render() {
    const {
      meter,
    } = this.props;

    const data = get(meter.registers, 'array', []).map(r => ({
      ...r,
      lastReading: get(r.readings, 'array[0]', {}),
    }));

    const columns = [
      {
        Header: () => <FormattedMessage id="admin.registers.tableName"/>,
        accessor: 'name',
        filterable: false,
        sortable: false,
      },
      {
        Header: () => <FormattedMessage id="admin.readings.tableDate"/>,
        accessor: 'lastReading.date',
        filterable: false,
        sortable: false,
        Cell: ({ value }) => <span>{ value ? moment(value).format('DD.MM.YYYY') : '' }</span>,
      },
      {
        Header: () => <FormattedMessage id="admin.readings.tableValue"/>,
        accessor: 'lastReading.value',
        filterable: false,
        sortable: false,
        Cell: (row) => <span>{ `${row.value} ${row.original.lastReading.unit}` }</span>,
      },
      {
        Header: () => <FormattedMessage id="admin.readings.tableReason"/>,
        accessor: 'lastReading.reason',
        filterable: false,
        sortable: false,
        Cell: (row) => <span><FormattedMessage id={ `admin.readings.${row.value}` }/></span>,
      },
      {
        expander: true,
        Expander: ({ isExpanded }) => (
          <div>
            {
              isExpanded
              ? <i className="fa fa-chevron-up"/>
              : <i className="fa fa-chevron-down"/>
            }
          </div>
        ),
        style: {
          color: '#bdbdbd',
        },
      },
    ];

    const prefix = 'admin.meters';

    return (
      <div className="meter-data">
        <Row className="meter-header">
          <Col xs="3">
            <div className="value">
              <FormattedMessage id={ `${prefix}.${meter.manufacturerName}` }/>
            </div>
            <div className="label">
              <FormattedMessage id={ `${prefix}.manufacturerName` }/>
            </div>
          </Col>
          <Col xs="3">
            <div className="value">
              { meter.productName }
            </div>
            <div className="label">
              <FormattedMessage id={ `${prefix}.productName` }/>
            </div>
          </Col>
          <Col xs="2">
            <div className="value">
              <FormattedMessage id={ `${prefix}.${meter.type}` }/>
            </div>
            <div className="label">
              <FormattedMessage id={ `${prefix}.type` }/>
            </div>
          </Col>
          <Col xs="2">
            <div className="value">
              { meter.converterConstant }
            </div>
            <div className="label">
              <FormattedMessage id={ `${prefix}.converterConstant` }/>
            </div>
          </Col>
          <Col xs="1"></Col>
        </Row>
        <Row>
          <Col xs="12">
            <h5><FormattedMessage id={`${prefix}.headerRegistersReadings`}/></h5>
            <ReactTable {...{
              data: orderBy(data, 'lastReading.date', 'desc'),
              columns,
              SubComponent: (row) => (
                <Row style={{
                  backgroundColor: '#F5F5F5',
                  boxShadow: 'inset 0 1px 8px 0 rgba(0,0,0,0.07)',
                  padding: '20px 10px',
                  margin: 0,
                }}>
                  <Col sm="4"><b><FormattedMessage id={ 'admin.readings.status' }/>:</b> <FormattedMessage id={ `admin.readings.${row.original.lastReading.status}` }/></Col>
                  <Col sm="4"><b><FormattedMessage id={ 'admin.readings.quality' }/>:</b> <FormattedMessage id={ `admin.readings.${row.original.lastReading.quality}` }/></Col>
                  <Col sm="4"><b><FormattedMessage id={ 'admin.readings.readBy' }/>:</b> <FormattedMessage id={ `admin.readings.${row.original.lastReading.readBy}` }/></Col>
                  { row.original.lastReading.comment && <Col sm="12" style={{ marginTop: '10px' }}><b><FormattedMessage id={ 'admin.readings.comment' }/>:</b> { row.original.lastReading.comment }</Col> }
                </Row>
              ),
              expanded: this.state.expanded,
              getTrProps: (state, rowInfo) => ({
                onClick: (event, handleOriginal) => {
                  this.handleRowClick(rowInfo.viewIndex);
                  handleOriginal && handleOriginal();
                },
              }),
            }}/>
          </Col>
        </Row>
        {
          meter.type === 'meter_real' ?
          <React.Fragment>
            <h5><FormattedMessage id={`${prefix}.headerMeterDetails`}/></h5>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.manufacturerName` }/></Col>
              <Col xs="8" className="grey-underline fieldvalue"><div>{ meter.manufacturerName } - <FormattedMessage id={ `${prefix}.${meter.manufacturerName}` }/></div></Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.manufacturerDescription` }/></Col>
              <Col xs="8" className="grey-underline fieldvalue">{meter.manufacturerDescription}</Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.productName` }/></Col>
              <Col xs="8" className="grey-underline fieldvalue">{ meter.productName }</Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.ownership` }/></Col>
              <Col xs="8" className="grey-underline fieldvalue">{ meter.ownership }</Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.buildYear` }/></Col>
              <Col xs="8" className="grey-underline fieldvalue">{ meter.buildYear }</Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.calibratedUntil` }/></Col>
              <Col xs="8" className="grey-underline fieldvalue">{ meter.calibratedUntil }</Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.converterConstant` }/></Col>
              <Col xs="8" className="grey-underline fieldvalue">{ meter.converterConstant }</Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.locationDescription` }/></Col>
              <Col xs="8" className="grey-underline fieldvalue">{ meter.locationDescription }</Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.dataSource` }/></Col>
              <Col xs="8" className="grey-underline fieldvalue"><FormattedMessage id={ `${prefix}.${meter.dataSource}` }/></Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.directionNumber` }/></Col>
              <Col xs="8" className="grey-underline fieldvalue">{ meter.directionNumber }</Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.productSerialnumber` }/></Col>
              <Col xs="8" className="grey-underline fieldvalue">{ meter.productSerialnumber }</Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.sequenceNumber` }/></Col>
              <Col xs="8" className="grey-underline fieldvalue">{ meter.sequenceNumber }</Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.type` }/></Col>
              <Col xs="8" className="grey-underline fieldvalue"><FormattedMessage id={ `${prefix}.${meter.type}` }/></Col>
            </Row>
            <h5><FormattedMessage id={`${prefix}.headerEdifactInformation`}/></h5>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.edifactCycleInterval` }/></Col>
              <Col xs="8" className="grey-underline fieldvalue"><div>{ meter.edifactCycleInterval } - <FormattedMessage id={ `${prefix}.${meter.edifactCycleInterval}` }/></div></Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.edifactDataLogging` }/></Col>
              <Col xs="8" className="grey-underline fieldvalue"><div>{ meter.edifactDataLogging } - <FormattedMessage id={ `${prefix}.${meter.edifactDataLogging}` }/></div></Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.edifactMeasurementMethod` }/></Col>
              <Col xs="8" className="grey-underline fieldvalue"><div>{ meter.edifactMeasurementMethod } - <FormattedMessage id={ `${prefix}.${meter.edifactMeasurementMethod}` }/></div></Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.edifactMeterSize` }/></Col>
              <Col xs="8" className="grey-underline fieldvalue"><div>{ meter.edifactMeterSize } - <FormattedMessage id={ `${prefix}.${meter.edifactMeterSize}` }/></div></Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.edifactMeteringType` }/></Col>
              <Col xs="8" className="grey-underline fieldvalue"><div>{ meter.edifactMeteringType } - <FormattedMessage id={ `${prefix}.${meter.edifactMeteringType}` }/></div></Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.edifactMountingMethod` }/></Col>
              <Col xs="8" className="grey-underline fieldvalue"><div>{ meter.edifactMountingMethod } - <FormattedMessage id={ `${prefix}.${meter.edifactMountingMethod}` }/></div></Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.edifactTariff` }/></Col>
              <Col xs="8" className="grey-underline fieldvalue"><div>{ meter.edifactTariff } - <FormattedMessage id={ `${prefix}.${meter.edifactTariff}` }/></div></Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.edifactVoltageLevel` }/></Col>
              <Col xs="8" className="grey-underline fieldvalue"><div>{ meter.edifactVoltageLevel } - <FormattedMessage id={ `${prefix}.${meter.edifactVoltageLevel}` }/></div></Col>
            </Row>
          </React.Fragment> :
          <React.Fragment></React.Fragment>
        }
      </div>
    );
  }
}

export default MeterData;
