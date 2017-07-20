import React from 'react';
import { DateTimePicker } from 'react-widgets';

export default ({ Chart, constants, loading, limit, changeDate, timestamp, changeResolution, changePage }) => (
  <div className="col-12 chart-wrapper">
    <div style={{ position: 'relative' }}>
      <div className="text-center">
        <button className="btn btn-default btn-icon icon-lg btn-chart-prev fa fa-chevron-left fa-2x" onClick={ () => changePage('prev') } disabled={ loading }></button>
        <button className="btn btn-default year" onClick={ () => changeResolution(constants.RESOLUTIONS.YEAR_MONTH) } disabled={ loading }>Jahr</button>
        <button className="btn btn-default month" onClick={ () => changeResolution(constants.RESOLUTIONS.MONTH_DAY) } disabled={ loading }>Monat</button>
        <button className="btn btn-default day" onClick={ () => changeResolution(constants.RESOLUTIONS.DAY_MINUTE) } disabled={ loading }>Tag</button>
        <button className="btn btn-default hour" onClick={ () => changeResolution(constants.RESOLUTIONS.HOUR_MINUTE) } disabled={ loading }>Stunde</button>
        <button className="btn btn-default btn-icon icon-lg btn-chart-next fa fa-chevron-right fa-2x" onClick={ () => changePage('next') } disabled={ loading || limit }></button>
        <div className="row justify-content-center">
          <div className="col-3">
            <DateTimePicker value={ new Date(timestamp) } onChange={ newDate => changeDate(newDate) }/>
          </div>
        </div>
      </div>
      <Chart layout="horizontal" />
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
