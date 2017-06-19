import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import ReactTable from 'react-table';
import { tableParts } from 'react_table_config';

const Tariffs = ({ loading, tariffs, url }) => {
  if (loading) return (<div>Loading...</div>);

  const formatDate = (date) => {
    if (!date) return '---';
    return moment(date).format('DD.MM.YYYY');
  };

  const data = tariffs.map(t => ({
    ...t,
    validFrom: formatDate(t.beginDate),
    validUntil: formatDate(t.endDate),
    link: `${url}/${t.id}`,
  }));

  const columns = [
    {
      Header: 'Name',
      accessor: 'name',
      minWidth: 200,
    },
    {
      Header: 'Valid from',
      accessor: 'validFrom',
      minWidth: 100,
    },
    {
      Header: 'Until',
      accessor: 'validUntil',
      minWidth: 100,
    },
    {
      Header: '',
      accessor: 'link',
      sortable: false,
      filterable: false,
      resizable: false,
      width: 100,
      Cell: tableParts.components.linkCell,
    },
  ];

  return (
    <div className="row">
      <div className="col-12">
        <h5>Tariffs</h5>
        <p>List of all tariffs for the contract</p>
      </div>
      <div className="col-12 no-padding">
        <ReactTable {...{ data, columns }} />
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
