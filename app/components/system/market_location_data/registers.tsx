import React, { useState } from 'react';
import { injectIntl, InjectIntlProps, FormattedMessage } from 'react-intl';
import ReactTableSorted from 'components/react_table_sorted';
import { tableParts as TableParts } from 'react_table_config';
import AddReading from 'components/add_reading';

interface Props {
  registers: Array<any>;
  url: string;
  history: any;
  locationId: string;
  groupId?: string;
  withAddReading?: boolean;
  cb?: () => void,
}

const Registers = ({ url, history, locationId, registers, intl, groupId, withAddReading, cb }: Props & InjectIntlProps) => {
  const [addReadingParams, setAddReadingParams] = useState({
    edifactMeasurementMethod: '',
    groupId,
    meterId: '',
    registerId: '',
    cb,
  });
  const [isOpen, switchAddReading] = useState(false);
  const prefix = 'admin.registers';
  const data = registers.map(r => ({
    ...r,
    linkRegister: `${url}/registers/${r.meterId}/${r.id}`,
    linkMeter: `${url}/meters/${r.meter.id}`,
  }));
  const columns = [
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
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableObis` })} />,
      accessor: 'obis',
      className: 'cy-obis',
      style: {
        cursor: 'pointer',
        textDecoration: 'underline',
      },
    },
  ];

  if (groupId && withAddReading) {
    columns.push({
      accessor: 'addReading',
      // @ts-ignore
      style: { cursor: 'pointer' },
      Cell: () => (
        <React.Fragment>
          <FormattedMessage id="admin.readings.addNew" /> <i className="fa fa-plus-circle" />
        </React.Fragment>
      ),
    });
  }

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
              if (column.id === 'addReading') {
                setAddReadingParams({
                  ...addReadingParams,
                  edifactMeasurementMethod: rowInfo.original.meter.edifactMeasurementMethod,
                  meterId: rowInfo.original.meter.id,
                  registerId: rowInfo.original.id,
                });
                switchAddReading(true);
              }
              if (handleOriginal) handleOriginal();
            },
          }),
          uiSortPath: `marketLocations.${locationId}.registers`,
        }}
      />
      <AddReading {...{ ...addReadingParams, isOpen, switchAddReading: () => switchAddReading(!isOpen) }} />
    </div>
  );
};

export default injectIntl(Registers);
