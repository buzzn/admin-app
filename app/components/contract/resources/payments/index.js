import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const Payments = ({ loading, payments }) => {
  if (loading) return (<div>Loading...</div>);

  const formatDate = (date) => {
    if (!date) return '---';
    return moment(date).format('DD.MM.YYYY');
  };

  return (
    <div className="row">
      <div className="col-12">
        <h5>Payments</h5>
        <p>List of all payments for the contract</p>
      </div>
      <div className="col-12 no-padding">
        <table className="table">
          <thead className="thead-default">
          <tr>
            <th>Price</th>
            <th>From</th>
            <th>Until</th>
            <th>Cycle</th>
          </tr>
          </thead>
          <tbody>
          {
            payments.map(payment =>
              <tr key={ payment.id }>
                <td>{ payment.priceCents / 100 }</td>
                <td>{ formatDate(payment.beginDate) }</td>
                <td>{ formatDate(payment.endDate) }</td>
                <td>{ payment.cycle }</td>
              </tr>
            )
          }
          </tbody>
        </table>
      </div>
    </div>
  );
};

Payments.propTypes = {
  loading: PropTypes.bool.isRequired,
  payments: PropTypes.array.isRequired,
};

export default Payments;
