import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const Readings = ({ readings }) => {
  if (readings.length === 0) return (<div><h4>No readings.</h4></div>);

  return (
    <div className="row">
      <div className="col-12">
        <h5>Readings</h5>
        List of all readings for a register.
      </div>
      <div className="col-12 no-padding">
        <table className="table">
          <thead className="thead-default">
            <tr>
              <th>Date</th>
              <th>Value</th>
              <th>Reason</th>
              <th>Quality</th>
              <th>By</th>
            </tr>
          </thead>
          <tbody>
            {
              readings.map(reading => (
                <tr key={reading.id}>
                  <td>{moment(reading.timestamp).format('YYYY-MM-DD')}</td>
                  <td>{reading.powerMilliwatt}</td>
                  <td>{reading.reason}</td>
                  <td>{reading.quality}</td>
                  <td>{reading.source}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

Readings.propTypes = {
  readings: PropTypes.array.isRequired,
};

export default Readings;
