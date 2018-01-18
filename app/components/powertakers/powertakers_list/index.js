import * as React from 'react';
import ReactTable from 'react-table';
import orderBy from 'lodash/orderBy';
import moment from 'moment';
import { injectIntl } from 'react-intl';
import { tableParts as TableParts } from 'react_table_config';

import DefaultPerson from 'images/default_person.jpg';
import DefaultOrganisation from 'images/default_organisation.jpg';

const PowertakersList = ({ powertakers, loading, url, intl, active, history }) => {
  const filteredPowertakers = powertakers.filter(o => (active ? o.status !== 'ended' : o.status === 'ended'));

  const data = orderBy(
    filteredPowertakers,
    o => o.customer.name || `${o.customer.firstName} ${o.customer.lastName}`,
    'asc',
  ).map(p => ({
    ...p,
    name:
      p.customer.type === 'person'
        ? {
          value: `${p.customer.firstName} ${p.customer.lastName}`,
          image: p.customer.image || DefaultPerson,
          type: 'avatar',
        }
        : { value: p.customer.name, image: p.customer.image || DefaultOrganisation, type: 'avatar' },
    registerName: p.register.name,
    // HACK
    linkRegister: `${url
      .split('/')
      .slice(0, -1)
      .join('/')}/system/${p.register.meterId}/registers/${p.register.id}`,
    beginDate: moment(p.beginDate).toDate(),
    endDate: p.endDate ? moment(p.endDate).toDate() : p.endDate,
    link: `${url}/${p.id}`,
  }));

  const prefix = 'admin.contracts';

  const columns = [
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableName` })} />,
      accessor: 'name',
      filterMethod: TableParts.filters.filterByValue,
      sortMethod: TableParts.sort.sortByValue,
      Cell: TableParts.components.iconNameCell,
    },
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableRegisterName` })} />
      ),
      accessor: 'registerName',
      filterMethod: TableParts.filters.filterByValue,
      sortMethod: TableParts.sort.sortByValue,
      style: {
        cursor: 'pointer',
        textDecoration: 'underline',
      },
    },
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableContractNumber` })} />
      ),
      accessor: 'fullContractNumber',
      filterMethod: TableParts.filters.filterByValue,
      sortMethod: TableParts.sort.sortByValue,
    },
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableBeginDate` })} />,
      accessor: 'beginDate',
      Cell: ({ value }) => moment(value).format('DD.MM.YYYY'),
    },
  ];

  if (!active) {
    columns.push({
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableEndDate` })} />,
      accessor: 'endDate',
      Cell: ({ value }) => (value ? moment(value).toDate() : null),
    });
  }

  columns.push({
    Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableStatus` })} />,
    accessor: 'status',
    filterMethod: TableParts.filters.filterByValue,
    sortMethod: TableParts.sort.sortByValue,
  });

  return (
    <div className="p-0" key={2}>
      <ReactTable
        {...{
          data,
          columns,
          getTdProps: (state, rowInfo, column) => ({
            onClick: (e, handleOriginal) => {
              if (column.id === 'registerName') history.push(rowInfo.original.linkRegister);
              if (handleOriginal) handleOriginal();
            },
          }),
        }}
      />
    </div>
  );
};

export default injectIntl(PowertakersList);
