import * as React from 'react';
import ReactTable from 'react-table';
import orderBy from 'lodash/orderBy';
import moment from 'moment';
import { FormattedNumber, injectIntl, InjectIntlProps } from 'react-intl';
import { tableParts as TableParts } from 'react_table_config';

interface Props {
  active?: boolean;
  tariffs: Array<any>;
}

const TariffsList = ({ active, tariffs, intl }: Props & InjectIntlProps) => {
  const filteredTariffs = tariffs.filter(t => (active ? !t.endDate : !!t.endDate));

  const prefix = 'admin.tariffs';

  const data = orderBy(filteredTariffs, t => new Date(t.beginDate), 'desc').map(t => ({
    ...t,
    beginDate: moment(t.beginDate).toDate(),
    endDate: t.endDate ? moment(t.endDate).toDate() : t.endDate,
    basepriceCentsPerMonth: {
      Display: (
        <FormattedNumber
          value={(t.basepriceCentsPerMonth / 100).toFixed(2)}
          style="currency"
          currency="EUR"
          currencyDisplay="symbol"
        />
      ),
      value: t.basepriceCentsPerMonth,
    },
    energypriceCentsPerKwh: {
      Display: (
        <React.Fragment>
          <FormattedNumber value={t.energypriceCentsPerKwh} style="decimal" maximumFractionDigits={1} /> ¢
        </React.Fragment>
      ),
      value: t.energypriceCentsPerKwh,
    },
  }));

  const columns = [
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableName` })} />,
      accessor: 'name',
    },
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableBeginDate` })} />,
      accessor: 'beginDate',
      Cell: ({ value }) => moment(value).format('DD.MM.YYYY'),
    },
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableBasepriceCentsPerMonth` })} />
      ),
      accessor: 'basepriceCentsPerMonth',
      filterMethod: TableParts.filters.filterByValue,
      sortMethod: TableParts.sort.sortByValue,
      Cell: ({ value: { Display } }) => Display,
    },
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableEnergypriceCentsPerKwh` })} />
      ),
      accessor: 'energypriceCentsPerKwh',
      filterMethod: TableParts.filters.filterByValue,
      sortMethod: TableParts.sort.sortByValue,
      Cell: ({ value: { Display } }) => Display,
    },
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.numberOfContracts` })} />
      ),
      accessor: 'numberOfContracts',
      Cell: ({ value }) => value || 0,
    },
  ];

  if (!active) {
    columns.splice(2, 0, {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableEndDate` })} />,
      accessor: 'endDate',
      Cell: ({ value }) => (value ? moment(value).format('DD.MM.YYYY') : ''),
    });
  }

  return (
    <div className="p-0">
      <ReactTable
        {...{
          data,
          columns,
        }}
      />
    </div>
  );
};

export default injectIntl(TariffsList);
