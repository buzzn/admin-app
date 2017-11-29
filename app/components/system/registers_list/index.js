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
  const data = registers.map(r => ({
    ...r,
    linkRegister: `${url}/${r.meterId}/registers/${r.id}`,
  }));

  const columns = [
    {
      Header: () => <TableParts.components.headerCell title={ intl.formatMessage({ id: 'admin.registers.tableName' }) }/>,
      accessor: 'name',
    },
    {
      Header: () => <TableParts.components.headerCell title={ intl.formatMessage({ id: 'admin.registers.tableMeteringPointId' }) }/>,
      accessor: 'meteringPointId',
    },
    {
      Header: () => <TableParts.components.headerCell title={ intl.formatMessage({ id: 'admin.registers.tableDirection' }) }/>,
      accessor: 'direction',
    },
    {
      Header: () => <TableParts.components.headerCell title={ intl.formatMessage({ id: 'admin.registers.tableLabel' }) }/>,
      accessor: 'label',
    },
  ];

  return (
    <div className="p-0">
      <ReactTable {...{
        data,
        columns,
        collapseOnDataChange: false,
        getTrProps: (state, rowinfo) => ({
          onClick: () => {
            history.push(rowinfo.original.linkRegister);
          },
          style: {
            cursor: 'pointer',
          },
        }),
      }} />
    </div>
  );
};

export default injectIntl(RegistersList);
