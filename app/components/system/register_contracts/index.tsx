import * as React from 'react';
import ReactTable from 'react-table';
import { injectIntl, FormattedMessage, InjectIntlProps } from 'react-intl';
import orderBy from 'lodash/orderBy';
import moment from 'moment';
import { tableParts as TableParts } from 'react_table_config';
import ContractStatus from 'components/contract_status';

const DefaultPerson = require('images/default_person.jpg');
const DefaultOrganisation = require('images/default_organisation.jpg');

interface Props {
  contracts: Array<any>;
  url: string;
}

const RegisterContracts = ({ contracts, url, intl }: Props & InjectIntlProps) => {
  const prefix = 'admin.contracts';
  const data = orderBy(contracts, c => new Date(c.beginDate), 'desc').map(c => ({
    ...c,
    name:
      c.type === 'contract_localpool_third_party'
        ? { value: 'drittbeliefert' }
        : c.customer.type === 'person'
          ? {
            value: `${c.customer.firstName} ${c.customer.lastName}`,
            image: c.customer.image || DefaultPerson,
            type: 'avatar',
          }
          : { value: c.customer.name, image: c.customer.image || DefaultOrganisation, type: 'avatar' },
    linkPowertaker: c.type === 'contract_localpool_third_party' ? '' : `${url}/${c.id}/powertaker`,
    linkContract: `${url}/${c.id}`,
    status: {
      value: c.status,
      Display: (
        <div>
          <ContractStatus {...{ size: 'small', status: c.status }} />
          <span className="ml-2">{intl.formatMessage({ id: `${prefix}.${c.status}` })}</span>
        </div>
      ),
    },
    beginDate: moment(c.beginDate).toDate(),
    endDate: c.endDate ? moment(c.endDate).toDate() : c.endDate,
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
        <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableContractNumber` })} />
      ),
      accessor: 'fullContractNumber',
      style: {
        cursor: 'pointer',
        textDecoration: 'underline',
      },
    },
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableStatus` })} />,
      accessor: 'status',
      filterMethod: TableParts.filters.filterByValue,
      sortMethod: TableParts.sort.sortByValue,
      Cell: ({ value: { Display } }) => Display,
    },
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableBeginDate` })} />,
      accessor: 'beginDate',
      Cell: ({ value }) => moment(value).format('DD.MM.YYYY'),
    },
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableEndDate` })} />,
      accessor: 'endDate',
      Cell: ({ value }) => (value ? moment(value).format('DD.MM.YYYY') : ''),
    },
  ];

  return (
    <div className="p-0" style={{ marginBottom: '2rem' }}>
      <ReactTable {...{
        data,
        columns,
      }}/>
    </div>
  );
};

export default injectIntl(RegisterContracts);
