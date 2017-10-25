// @flow
import * as React from 'react';
import ReactTable from 'react-table';
import { injectIntl } from 'react-intl';
import type { intlShape } from 'react-intl';
import { tableParts as TableParts } from 'react_table_config';
import RegistersList from '../registers_list';

type Props = {
  loading: boolean,
  meters: Array<Object>,
  intl: intlShape,
  groupId: string,
};

const MetersList = ({ loading, meters, groupId, intl }: Props) => {
  if (loading) return (<div>Loading...</div>);

  const data = meters.map(m => ({
    ...m,
    rawType: m.type,
    type: intl.formatMessage({ id: `admin.meters.${m.type}` }),
    meter: m.productSerialnumber,
    linkMeter: `/localpools/${groupId}/system/${m.id}`,
    linkRegisters: `/localpools/${groupId}/system/${m.id}/registers`,
  }));

  const columns = [
    {
      Header: () => <TableParts.components.headerCell title="Type"/>,
      accessor: 'type',
      minWidth: 200,
    },
    {
      Header: () => <TableParts.components.headerCell title="Meter"/>,
      accessor: 'meter',
      minWidth: 200,
    },
    {
      Header: '',
      accessor: '',
      sortable: false,
      filterable: false,
      resizable: false,
      width: 100,
      className: 'dropdown-fix',
      Cell: row => <TableParts.components.dropDownCell row={ row } menuItems={ [
        { action: 'linkMeter', title: 'View meter' },
        { action: 'linkRegisters', title: 'Meter registers list' },
      ] }/>,
    },
  ];

  return (
    <div className="p-0">
      <ReactTable {...{
        data,
        columns,
        SubComponent: (row) => {
          const { original: { rawType, registers: { array: registers } } } = row;
          console.log(rawType)
          if (registers.length === 0 || rawType !== 'meter_real') return false;
          return <RegistersList subComponent registers={ registers }/>;
        },
      }} />
    </div>
  );
};

export default injectIntl(MetersList);
