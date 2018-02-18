import * as React from 'react';
import ReactTableSorted from 'components/react_table_sorted';
import { injectIntl, InjectIntlProps } from 'react-intl';
import { tableParts as TableParts } from 'react_table_config';

interface Props {
  marketLocations: Array<any>;
  url: string;
  history: any;
  groupId: string;
}

const MarketLocationsList = ({ marketLocations, url, history, intl, groupId }: Props & InjectIntlProps) => {
  const prefix = 'admin.marketLocations';

  const data = marketLocations.map(m => ({
    ...m,
    label: intl.formatMessage({ id: `admin.registers.${m.register.label}` }),
    // linkMeter: `${url}/${m.meterId}`,
    // linkRegister: `${url}/${m.meterId}/registers/${m.id}/readings`,
  }));

  const columns = [
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableName` })} />,
      accessor: 'name',
      style: {
        cursor: 'pointer',
        textDecoration: 'underline',
      },
    },
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: 'admin.meters.tableProductSerialnumber' })} />
      ),
      accessor: 'meterProductSerialnumber',
      style: {
        cursor: 'pointer',
        textDecoration: 'underline',
      },
    },
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableLabel` })} />,
      accessor: 'label',
    },
  ];

  return (
    <div className="p-0">
      <ReactTableSorted
        {...{
          data,
          columns,
          collapseOnDataChange: false,
          // getTdProps: (_state, rowInfo, column) => ({
          //   onClick: (_e, handleOriginal) => {
          //     if (column.id === 'name') history.push(rowInfo.original.linkRegister);
          //     if (column.id === 'meterProductSerialnumber') history.push(rowInfo.original.linkMeter);
          //     if (handleOriginal) handleOriginal();
          //   },
          // }),
          uiSortPath: `groups.${groupId}.marketLocations`,
        }}
      />
    </div>
  );
};

export default injectIntl(MarketLocationsList);
