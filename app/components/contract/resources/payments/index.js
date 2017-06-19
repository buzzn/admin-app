import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import ReactTable from 'react-table';

const Payments = ({ loading, payments }) => {
  if (loading) return (<div>Loading...</div>);

  const formatDate = (date) => {
    if (!date) return '---';
    return moment(date).format('DD.MM.YYYY');
  };

  const data = payments.map(p => ({
    ...p,
    price: p.priceCents / 100,
    from: formatDate(p.beginDate),
    until: formatDate(p.endDate),
  }));

  const columns = [
    {
      Header: 'Price',
      accessor: 'price',
      minWidth: 100,
    },
    {
      Header: 'From',
      accessor: 'from',
      minWidth: 100,
    },
    {
      Header: 'Until',
      accessor: 'until',
      minWidth: 100,
    },
    {
      Header: 'Cycle',
      accessor: 'cycle',
      minWidth: 100,
    },
  ];

  return (
    <div className="row">
      <div className="col-12">
        <h5>Payments</h5>
        <p>List of all payments for the contract</p>
      </div>
      <div className="col-12 no-padding">
        <ReactTable {...{ data, columns }} />
      </div>
    </div>
  );
};

Payments.propTypes = {
  loading: PropTypes.bool.isRequired,
  payments: PropTypes.array.isRequired,
};

export default Payments;
