// @flow
import * as React from 'react';
import { DateTimePicker, DropdownList } from 'react-widgets';

type Props = {
  Chart: React.ElementType,
  constants: Object,
  loading: boolean,
  limit: boolean,
  changeDate: Function,
  timestamp: number,
  resolution: string,
  changeResolution: Function,
  changePage: Function,
};

export default ({ Chart, constants, loading, limit, changeDate, timestamp, resolution, changeResolution, changePage }: Props) => {
  let dateFormat = 'DD MMM YYYY';
  let views = ['month', 'year', 'decade', 'century'];

  switch (resolution) {
    case constants.RESOLUTIONS.YEAR_MONTH:
      dateFormat = 'YYYY';
      views = ['decade', 'century'];
      break;
    case constants.RESOLUTIONS.MONTH_DAY:
      dateFormat = 'MMM YYYY';
      views = ['year', 'decade', 'century'];
      break;
    default:
    case constants.RESOLUTIONS.DAY_MINUTE:
      dateFormat = 'DD MMM YYYY';
      views = ['month', 'year', 'decade', 'century'];
      break;
    case constants.RESOLUTIONS.HOUR_MINUTE:
      dateFormat = 'DD MMM YYYY HH:mm';
      views = ['month', 'year', 'decade', 'century'];
      break;
  }

  return (
    <div className="chart-wrapper">
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
              <button className="btn btn-default btn-icon icon-lg btn-chart-prev fa fa-chevron-left fa-2x"
                      onClick={ () => changePage('prev') } disabled={ loading }/>
              <DateTimePicker
                value={ new Date(timestamp) }
                onChange={ newDate => changeDate(newDate) }
                className="timestamp-picker"
                time={ resolution === constants.RESOLUTIONS.HOUR_MINUTE }
                format={ dateFormat }
                views={ views }
              />
              <button className="btn btn-default btn-icon icon-lg btn-chart-next fa fa-chevron-right fa-2x"
                      onClick={ () => changePage('next') } disabled={ loading || limit }/>
            </div>
          </div>
        </div>
        <Chart layout="horizontal" withTitle={ false }/>
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
};
