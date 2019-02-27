import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Alert from 'react-s-alert';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import Contracts from 'contracts';
import ReactTableSorted from 'components/react_table_sorted';
import { tableParts as TableParts } from 'react_table_config';
import { NestedDetailsWrapper } from 'components/style';
import Loading from 'components/loading';

const DefaultPerson = require('images/default_person.jpg');
const DefaultOrganisation = require('images/default_organisation.jpg');
const DefaultThirdParty = require('images/default_3rd_party.jpg');

const NestedDetails = ({
  groupId,
  tariffId,
  groupPowertakers,
  loading,
  loadGroupPowertakers,
  updateContract,
  intl,
}) => {
  const prefix = 'admin.contracts';
  useEffect(() => {
    loadGroupPowertakers({ groupId });
  }, [groupId, tariffId]);
  const [selected, setSelected] = useState({});
  useEffect(() => {
    setSelected(
      groupPowertakers.array.reduce(
        (res, p) => ({ ...res, [p.id]: !!p.tariffs.array.find(t => t.id === tariffId) }),
        {},
      ),
    );
  }, [tariffId, groupId, groupPowertakers._status, loading]);
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async () => {
    setUpdating(true);
    const toUpdate = Object.keys(selected)
      .filter(k => (selected[k]
        ? !groupPowertakers.array.find(p => p.id === k).tariffs.array.find(t => t.id === tariffId)
        : !!groupPowertakers.array.find(p => p.id === k).tariffs.array.find(t => t.id === tariffId)))
      .reduce((res, id) => {
        const powertaker = groupPowertakers.array.find(p => p.id === id);
        return {
          ...res,
          [id]: {
            updatedAt: powertaker.updatedAt,
            tariffIds: selected[id]
              ? powertaker.tariffs.array.map(t => t.id).concat(tariffId)
              : powertaker.tariffs.array.filter(t => t.id !== tariffId).map(t => t.id),
          },
        };
      }, {});
    if (!Object.keys(toUpdate).length) {
      Alert.error('Nothing to update');
      return;
    }
    // update one by one for perf reasons
    for (let i = 0; i < Object.keys(toUpdate).length; i++) {
      try {
        const contractId = Object.keys(toUpdate)[i];
        await new Promise((resolve, reject) => updateContract({
          resolve,
          reject,
          params: toUpdate[contractId],
          groupId,
          contractId,
          updateType: 'tariffs',
        }));
        Alert.success(`Contract updated, ${Object.keys(toUpdate).length - i - 1} to go.`);
      } catch (e) {
        Alert.error(JSON.stringify(e));
      }
    }
    loadGroupPowertakers({ groupId });
    setUpdating(false);
  };

  if (loading || groupPowertakers._status === null || updating) return <Loading minHeight={4} />;

  const data = groupPowertakers.array.map(p => ({
    ...p,
    name:
      p.type === 'contract_localpool_third_party'
        ? { value: 'drittbeliefert', image: DefaultThirdParty, type: 'avatar' }
        : p.customer.type === 'person'
          ? {
            value: `${p.customer.lastName} ${p.customer.firstName}`,
            image: p.customer.image || DefaultPerson,
            type: 'avatar',
            clickable: true,
          }
          : { value: p.customer.name, image: p.customer.image || DefaultOrganisation, type: 'avatar', clickable: true },
  }));

  const columns = [
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableName` })} />,
      accessor: 'name',
      className: 'cy-powertaker',
      filterMethod: TableParts.filters.filterByValue,
      sortMethod: TableParts.sort.sortByValue,
      Cell: TableParts.components.iconNameCell,
    },
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableContractNumber` })} />
      ),
      accessor: 'fullContractNumber',
      className: 'cy-number',
      sortMethod: TableParts.sort.sortByFulContractNumber,
    },
    {
      accessor: 'tariffs',
      Cell: ({ original }) => (
        <div onClick={() => setSelected({ ...selected, [original.id]: !selected[original.id] })}>
          {selected[original.id] ? <i className="fa fa-check" /> : <i className="fa fa-remove" />}
        </div>
      ),
    },
  ];

  return (
    <NestedDetailsWrapper>
      <ReactTableSorted
        {...{
          data,
          columns,
          uiSortPath: `groups.${groupId}.tariffs.${tariffId}.powertakers`,
        }}
      />
      <button onClick={handleUpdate} className="btn btn-primary">
        Update
      </button>
    </NestedDetailsWrapper>
  );
};

function mapStateToProps(state) {
  return {
    groupPowertakers: state.contracts.groupPowertakers,
    loading: state.contracts.loadingGroupPowertakers,
  };
}

export default connect(
  mapStateToProps,
  {
    loadGroupPowertakers: Contracts.actions.loadGroupPowertakers,
    updateContract: Contracts.actions.updateContract,
  },
)(injectIntl(NestedDetails));
