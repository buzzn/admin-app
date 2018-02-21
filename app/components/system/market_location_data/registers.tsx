import * as React from 'react';
import { injectIntl, InjectIntlProps } from 'react-intl';
import ReactTableSorted from 'components/react_table_sorted';
import { tableParts as TableParts } from 'react_table_config';

interface Props {
  registers: Array<any>;
  url: string;
  history: any;
  locationId: string;
}

const Registers = ({ url, history, locationId, registers, intl }: Props & InjectIntlProps) => {
  const prefix = 'admin.registers';
  const data = registers.map(r => ({
    ...r,
    linkRegister: `${url}/registers/${r.id}`,
    linkMeter: `${url}/meters/${r.meter.id}`,
  }));
  const columns = [
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableObis` })} />,
      accessor: 'obis',
      style: {
        cursor: 'pointer',
        textDecoration: 'underline',
      },
    },
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: 'admin.meters.tableProductSerialnumber' })} />
      ),
      accessor: 'meter.productSerialnumber',
      style: {
        cursor: 'pointer',
        textDecoration: 'underline',
      },
    },
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableKind` })} />,
      accessor: 'kind',
    },
  ];

  return (
    <div className="p-0">
      <ReactTableSorted
        {...{
          data,
          columns,
          getTdProps: (_state, rowInfo, column) => ({
            onClick: (_e, handleOriginal) => {
              if (column.id === 'obis') history.push(rowInfo.original.linkRegister);
              if (column.id === 'meter.productSerialnumber') history.push(rowInfo.original.linkMeter);
              if (handleOriginal) handleOriginal();
            },
          }),
          uiSortPath: `marketLocations.${locationId}.registers`,
        }}
      />
    </div>
  );
};

export default injectIntl(Registers);
