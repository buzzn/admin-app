import React from 'react';
import { DateTimePicker, DropdownList } from 'react-widgets';

export default ({ Chart, constants, loading, limit, changeDate, timestamp, resolution, changeResolution, changePage }) => (
  <div className="col-12 chart-wrapper">
    <div style={{ position: 'relative' }}>
      <div className="chart-navigation">
        <div className="row justify-content-center">
          <div className="col-3 resolution">
            <DropdownList
              onChange={ ({ value }) => changeResolution(value) }
              disabled={ loading }
              value={ resolution }
              valueField="value"
              textField="label"
              data={[
                { value: constants.RESOLUTIONS.YEAR_MONTH, label: 'Jahr' },
                { value: constants.RESOLUTIONS.MONTH_DAY, label: 'Monat' },
                { value: constants.RESOLUTIONS.DAY_MINUTE, label: 'Tag' },
                { value: constants.RESOLUTIONS.HOUR_MINUTE, label: 'Stunde' },
              ]}
              className="resolution-select"
            />
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-3 timestamp">
            <button className="btn btn-default btn-icon icon-lg btn-chart-prev fa fa-chevron-left fa-2x" onClick={ () => changePage('prev') } disabled={ loading }></button>
            <DateTimePicker
              value={ new Date(timestamp) }
              onChange={ newDate => changeDate(newDate) }
              className="timestamp-picker"
            />
            <button className="btn btn-default btn-icon icon-lg btn-chart-next fa fa-chevron-right fa-2x" onClick={ () => changePage('next') } disabled={ loading || limit }></button>
          </div>
        </div>
      </div>
      <Chart layout="horizontal" withTitle={ false } />
      <div className="basic-loading" style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: loading ? 10 : -10,
        background: 'rgba(255, 255, 255, 0.7)',
      }}>
        <div style={{ color: 'grey', fontSize: '28px', fontWeight: 'bolder', marginLeft: '45%', marginTop: '15%' }}>
          Loading...
        </div>
      </div>
    </div>
  </div>
);
