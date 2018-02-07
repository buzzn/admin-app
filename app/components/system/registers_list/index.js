import * as React from 'react';
import ReactTableSorted from 'components/react_table_sorted';
import { injectIntl } from 'react-intl';
import { tableParts as TableParts } from 'react_table_config';

const RegistersList = ({ registers, url, history, intl, groupId }) => {
  const prefix = 'admin.registers';

  const data = registers.map(r => ({
    ...r,
    label: intl.formatMessage({ id: `${prefix}.${r.label}` }),
    linkMeter: `${url}/${r.meterId}`,
    linkRegister: `${url}/${r.meterId}/registers/${r.id}/readings`,
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
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableDirection` })} />,
      accessor: 'direction',
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
          getTdProps: (state, rowInfo, column) => ({
            onClick: (e, handleOriginal) => {
              if (column.id === 'name') history.push(rowInfo.original.linkRegister);
              if (column.id === 'meterProductSerialnumber') history.push(rowInfo.original.linkMeter);
              if (handleOriginal) handleOriginal();
            },
          }),
          uiSortPath: `groups.${groupId}.registers`,
        }}
      />
    </div>
  );
};

export default injectIntl(RegistersList);
