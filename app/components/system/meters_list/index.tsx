import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { injectIntl, InjectIntlProps } from 'react-intl';

import Meters from 'meters';

import Loading from 'components/loading';
import { tableParts as TableParts } from 'react_table_config';
import ReactTableSorted from 'components/react_table_sorted';

interface ExtProps {
  groupId: string;
  url: string;
}

const MetersList: React.FC<ExtProps & StateProps & DispatchProps & InjectIntlProps> = ({
  groupId,
  groupMeters,
  intl,
  loadGroupMeters,
  loading,
  url,
}) => {
  useEffect(() => {
    loadGroupMeters(groupId);
  }, [groupId]);

  if (loading || groupMeters._status === null) return <Loading minHeight={40} />;
  if (groupMeters._status && groupMeters._status !== 200) return <Redirect to={url} />;

  const prefix = 'admin.meters';

  const data = groupMeters.array.map(m => ({
    ...m,
    meterNumber: {
      value: m.productSerialnumber,
      Display: <Link to={`${url}/meters/${m.id}`}>{m.productSerialnumber}</Link>,
    },
    meterRegisters: {
      value: m.registers.array.reduce(
        (s, register) => `${s} ${
          register.registerMeta
            ? `${register.registerMeta.name} - ${intl.formatMessage({ id: `admin.registers.${register.registerMeta.label}` })}`
            : register.obis
        } ${register.lastReading}`,
        '',
      ),
      Display: (
        <React.Fragment>
          <ul>
            {m.registers.array.map(register => (
              <li key={register.id}>
                {register.registerMeta
                  ? `${register.registerMeta.name} - ${intl.formatMessage({ id: `admin.registers.${register.registerMeta.label}` })}`
                  : register.obis}
                , Last reading: {register.lastReading}
              </li>
            ))}
          </ul>
        </React.Fragment>
      ),
    },
  }));
  const columns = [
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableProductSerialnumber` })} />
      ),
      accessor: 'meterNumber',
      className: 'cy-meter-serial',
      filterable: true,
      filterMethod: TableParts.filters.filterByValue,
      sortMethod: TableParts.sort.sortByValue,
      width: 160,
      style: {
        cursor: 'pointer',
        textDecoration: 'underline',
      },
      Cell: ({ value: { Display } }) => Display,
    },
    {
      Header: () => intl.formatMessage({ id: `${prefix}.tableRegisters` }),
      accessor: 'meterRegisters',
      className: 'cy-meter-registers',
      sortable: false,
      filterable: true,
      filterMethod: TableParts.filters.filterByValue,
      sortMethod: TableParts.sort.sortByValue,
      Cell: ({ value: { Display } }) => Display,
    },
  ];

  return (
    <React.Fragment>
      <ReactTableSorted
        {...{
          data,
          columns,
          uiSortPath: `groups.${groupId}.allMeters`,
        }}
      />
    </React.Fragment>
  );
};

interface StatePart {
  meters: { groupMeters: { _status: null | number; array: Array<any> }; loadingGroupMeters: boolean };
}

interface StateProps {
  groupMeters: { _status: null | number; array: Array<any> };
  loading: boolean;
}

interface DispatchProps {
  loadGroupMeters: (string) => void;
}

const mapStateToProps = (state: StatePart) => ({
  groupMeters: state.meters.groupMeters,
  loading: state.meters.loadingGroupMeters,
});

export default connect<StateProps, DispatchProps, ExtProps>(
  mapStateToProps,
  { loadGroupMeters: Meters.actions.loadGroupMeters },
)(injectIntl(MetersList));
