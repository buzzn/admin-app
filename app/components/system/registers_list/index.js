// @flow
import * as React from 'react';
import ReactTable from 'react-table';
import { injectIntl } from 'react-intl';
import type { intlShape } from 'react-intl';
import { tableParts as TableParts } from 'react_table_config';

type Props = {
  registers: Array<Object>,
  history: Object,
  url: string,
  intl: intlShape,
};

const RegistersList = ({ registers, url, history, intl }: Props) => {
  const prefix = 'admin.registers';

  const data = registers.map(r => ({
    ...r,
    label: intl.formatMessage({ id: `${prefix}.${r.label}` }),
    linkMeter: `${url}/${r.meterId}`,
    linkRegister: `${url}/${r.meterId}/registers/${r.id}/readings`,
  }));

  const columns = [
    {
      Header: () => <TableParts.components.headerCell title={ intl.formatMessage({ id: `${prefix}.tableName` }) }/>,
      accessor: 'name',
      style: {
        cursor: 'pointer',
        textDecoration: 'underline',
      },
    },
    {
      Header: () => <TableParts.components.headerCell title={ intl.formatMessage({ id: 'admin.meters.tableProductSerialnumber' }) }/>,
      accessor: 'meterProductSerialnumber',
      style: {
        cursor: 'pointer',
        textDecoration: 'underline',
      },
    },
    {
      Header: () => <TableParts.components.headerCell title={ intl.formatMessage({ id: `${prefix}.tableDirection` }) }/>,
      accessor: 'direction',
    },
    {
      Header: () => <TableParts.components.headerCell title={ intl.formatMessage({ id: `${prefix}.tableLabel` }) }/>,
      accessor: 'label',
    },
  ];

  return (
    <div className="p-0">
      <ReactTable {...{
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
      }} />
    </div>
  );
};

export default injectIntl(RegistersList);
