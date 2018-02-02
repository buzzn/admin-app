import * as React from 'react';
import ReactTable from 'react-table';
import orderBy from 'lodash/orderBy';
import moment from 'moment';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { tableParts as TableParts } from 'react_table_config';
import ContractStatus from 'components/contract_status';
import Loading from 'components/loading';

const DefaultPerson = require('images/default_person.jpg');
const DefaultOrganisation = require('images/default_organisation.jpg');

interface Props {
  powertakers: Array<any>;
  loading: boolean;
  url: string;
  active: boolean;
  history: any;
}

const PowertakersList = ({ powertakers, loading, url, intl, active, history }: Props & InjectedIntlProps) => {
  if (loading) return <Loading minHeight={40} />;

  const filteredPowertakers = powertakers.filter(o => (active ? o.status !== 'ended' : o.status === 'ended'));

  const prefix = 'admin.contracts';

  const data = orderBy(
    filteredPowertakers,
    o =>
      (o.type === 'contract_localpool_third_party'
        ? null
        : o.customer.name || `${o.customer.firstName} ${o.customer.lastName}`),
    'asc',
  ).map(p => ({
    ...p,
    name:
      p.type === 'contract_localpool_third_party'
        ? { value: 'drittbeliefert' }
        : p.customer.type === 'person'
          ? {
            value: `${p.customer.firstName} ${p.customer.lastName}`,
            image: p.customer.image || DefaultPerson,
            type: 'avatar',
          }
          : { value: p.customer.name, image: p.customer.image || DefaultOrganisation, type: 'avatar' },
    linkPowertaker: p.type === 'contract_localpool_third_party' ? '' : `${url}/${p.id}/powertaker`,
    linkContract: `${url}/${p.id}`,
    registerName: p.register.name,
    // HACK
    linkRegister: `${url
      .split('/')
      .slice(0, -1)
      .join('/')}/system/${p.register.meterId}/registers/${p.register.id}/readings`,
    beginDate: moment(p.beginDate).toDate(),
    endDate: p.endDate ? moment(p.endDate).toDate() : p.endDate,
    status: {
      value: p.status,
      Display: (
        <div>
          <ContractStatus {...{ size: 'small', status: p.status }} />
          <span className="ml-2">{intl.formatMessage({ id: `${prefix}.${p.status}` })}</span>
        </div>
      ),
    },
  }));

  const columns = [
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableName` })} />,
      accessor: 'name',
      filterMethod: TableParts.filters.filterByValue,
      sortMethod: TableParts.sort.sortByValue,
      Cell: TableParts.components.iconNameCell,
      style: {
        cursor: 'pointer',
        textDecoration: 'underline',
      },
    },
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableRegisterName` })} />
      ),
      accessor: 'registerName',
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
      style: {
        cursor: 'pointer',
        textDecoration: 'underline',
      },
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
      Cell: ({ value }) => (value ? moment(value).format('DD.MM.YYYY') : ''),
    });
  }

  columns.push({
    Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableStatus` })} />,
    accessor: 'status',
    filterMethod: TableParts.filters.filterByValue,
    sortMethod: TableParts.sort.sortByValue,
    Cell: ({ value: { Display } }) => Display,
  });

  return (
    <div className="p-0" key={2}>
      <ReactTable
        {...{
          data,
          columns,
          getTdProps: (_state, rowInfo, column) => ({
            onClick: (_e, handleOriginal) => {
              if (column.id === 'registerName') history.push(rowInfo.original.linkRegister);
              if (column.id === 'name' && rowInfo.original.linkPowertaker.length) { history.push(rowInfo.original.linkPowertaker); }
              if (column.id === 'fullContractNumber') history.push(rowInfo.original.linkContract);
              if (handleOriginal) handleOriginal();
            },
          }),
        }}
      />
    </div>
  );
};

export default injectIntl(PowertakersList);
