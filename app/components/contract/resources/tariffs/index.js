import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';

const Tariffs = ({ loading, tariffs, url }) => {
  if (loading) return (<div>Loading...</div>);

  const formatDate = (date) => {
    if (!date) return '---';
    return moment(date).format('DD.MM.YYYY');
  };

  return (
    <div className="row">
      <div className="col-12">
        <h5>Tariffs</h5>
        <p>List of all tariffs for the contract</p>
      </div>
      <div className="col-12 no-padding">
        <table className="table">
          <thead className="thead-default">
            <tr>
              <th>Name</th>
              <th>Valid from</th>
              <th>Until</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              tariffs.map(tariff =>
                <tr key={ tariff.id }>
                  <td>{ tariff.name }</td>
                  <td>{ formatDate(tariff.beginDate) }</td>
                  <td>{ formatDate(tariff.endDate) }</td>
                  <td>
                    <Link
                      to={ `${url}/${tariff.id}` }
                      className="btn btn-outline-secondary"
                      style={{ float: 'right', marginRight: '15px' }}>
                      View
                    </Link>
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

Tariffs.propTypes = {
  loading: PropTypes.bool.isRequired,
  tariffs: PropTypes.array.isRequired,
  url: PropTypes.string.isRequired,
};

Tariffs.defaultProps = {
  tariffs: [],
};

export default Tariffs;
