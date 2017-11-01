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
  url: string,
};

const MetersList = ({ loading, meters, intl, url }: Props) => {
  if (loading) return (<div>Loading...</div>);

  const data = meters.map(m => ({
    ...m,
    rawType: m.type,
    type: intl.formatMessage({ id: `admin.meters.${m.type}` }),
    meter: m.productSerialnumber,
    linkMeter: `${url}/${m.id}`,
    linkRegisters: `${url}/${m.id}/registers`,
    linkFormula: `${url}/${m.id}/formulas`,
  }));

  const columns = [
    {
      expander: true,
      width: 35,
      Expander: ({ isExpanded, row }) => {
        const { _original } = row;
        const hide = _original.rawType !== 'meter_real' || _original.registers.array.length === 0;
        return <TableParts.components.expander isExpanded={ isExpanded } hide={ hide } />;
      },
    },
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
        {
          action: row.original.rawType === 'meter_real' ? 'linkRegisters' : 'linkFormula',
          title: row.original.rawType === 'meter_real' ? 'Meter registers list' : 'Formula',
        },
      ] }/>,
    },
  ];

  return (
    <div className="p-0">
      <ReactTable {...{
        data,
        columns,
        SubComponent: (row) => {
          const { original: { rawType } } = row;
          if (rawType !== 'meter_real') return false;
          const { original: { linkRegisters, registers: { array: registers } } } = row;
          if (registers.length === 0) return false;
          return <RegistersList subComponent registers={ registers } url={ linkRegisters }/>;
        },
      }} />
    </div>
  );
};

export default injectIntl(MetersList);
