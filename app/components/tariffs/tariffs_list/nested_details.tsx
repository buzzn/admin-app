import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Alert from 'react-s-alert';
import { FormattedMessage, injectIntl } from 'react-intl';
import Contracts from 'contracts';
import ReactTableSorted from 'components/react_table_sorted';
import { tableParts as TableParts } from 'react_table_config';
import { NestedDetailsWrapper, SpanClick } from 'components/style';
import Loading from 'components/loading';
import { DocumentList, ResponseOutputBox, StatusIcon, SwitchButton, ToolBar } from './style';

const DefaultPerson = require('images/default_person.jpg');
const DefaultOrganisation = require('images/default_organisation.jpg');

const NestedDetails = ({
  groupId,
  tariffId,
  groupPowertakers,
  loading,
  loadGroupPowertakers,
  updateContract,
  intl,
  getContractPDFData,
  generateContractPDF,
  sendTariffChangeLetterPDF,
}) => {
  const prefix = 'admin.contracts';
  useEffect(() => {
    loadGroupPowertakers({ groupId });
  }, [groupId, tariffId]);
  const [selected, setSelected] = useState({});
  const [appliedAll, setAppliedAll] = useState(false);
  const [generationErrors, setGenerationErrors] = useState<any[]>([]);
  useEffect(() => {
    setSelected(
      groupPowertakers.array.reduce(
        (res, p) => ({ ...res, [p.id]: !!p.tariffs.array.find(t => t.id === tariffId) }),
        {},
      ),
    );
  }, [tariffId, groupId, groupPowertakers._status, loading]);
  
  const [updating, setUpdating] = useState(false);
  const [filterShowActive, setFilterShowActive] = useState(false);
  
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

  const data = groupPowertakers.array
    .filter(p => p.status !== 'ended')
    .filter(p => p.type !== 'contract_localpool_third_party')
    .map(p => ({
      ...p,
      name:
        p.customer.type === 'person'
          ? {
            value: `${p.customer.lastName} ${p.customer.firstName}`,
            image: p.customer.image || DefaultPerson,
            type: 'avatar',
            clickable: true,
          }
          : { value: p.customer.name, image: p.customer.image || DefaultOrganisation, type: 'avatar', clickable: true },
    }));

  const handleGeneratePDFs = () => {
    const errors: any[] = [];
    setUpdating(true);
    const activeData = data.filter(d=> d.status === 'active');
    const contracts = [...activeData];

    const next = () => {
      console.log('NEXT', contracts);
      if(contracts.length) {
        setTimeout(() => goThrough(), 800);
      } else {
        setGenerationErrors(errors);
        setUpdating(false);
        loadGroupPowertakers({ groupId });
      }
    }

    const goThrough = () => {
      const contract = contracts.pop();
      console.log('CONTRACT', contract);
      
      // call the group powertakers document tarif generation super thing
      console.log('call again');
      
      generateContractPDF({ groupId, contractId: contract.id,
        template: 'tariff_change_letter',
        resolve: () => {
          Alert.success('<h4>' + (activeData.length - contracts.length) + '/'+ activeData.length + '</h4>' + 'successfully generated for: ' + contract.fullContractNumber)
          next();
        },
        reject: (status, message) => {
          Alert.error('<h4>' + (activeData.length - contracts.length) + '/'+ activeData.length + '</h4>' + status + ' - ' + JSON.stringify(message));
          errors.push({
            contract, 
            message
          })
          next();
        } 
      });
    };
    goThrough();
  }

  const handleSendTariffChangeLetterPDFs = () => {
    const errors: any[] = [];
    setUpdating(true);
    const activeData = data.filter(d=> d.status === 'active');
    const contracts = [...activeData];

    const next = () => {
      console.log('NEXT', contracts);
      if(contracts.length) {
        setTimeout(() => goThrough(), 800);
      } else {
        setGenerationErrors(errors);
        setUpdating(false);
        loadGroupPowertakers({ groupId });
      }
    }

    const goThrough = () => {
      const contract = contracts.pop();
      console.log('CONTRACT', contract);

      if(!contract.documents || !contract.documents.array.length) {
        Alert.error('<h4>No Documents</h4> for ' + contract.fullContractNumber);
        errors.push({
          contract, 
          message: 'no documents'
        });
        goThrough();
        return ; 
      }

      if(!contract.documents.array.find(({ purpose }) => purpose === 'tariff_change_letter')) {
        Alert.error('<h4>No Tariff change Letter generated</h4> for ' + contract.fullContractNumber);
        errors.push({
          contract, 
          message: 'No Tariff change Letter generated'
        });
        goThrough();
        return;
      }

      if(!contract.documents.array.find(({ purpose, lastSend }) => purpose === 'tariff_change_letter' && !lastSend)) {
        Alert.error('<h4>No Tariff change Letter that was not already sent</h4> for ' + contract.fullContractNumber);
        errors.push({
          contract, 
          message: 'No Tariff change Letter that was not already sent'
        });
        goThrough();
        return;
      }

      const documents = contract.documents.array.filter(({ purpose, lastSend }) => purpose === 'tariff_change_letter' && !lastSend).sort((a, b) => {
        const da = Date.parse(a);
        const db = Date.parse(b);
        if (da > db) {
          return 1;
        }
        if (da < db) {
          return -1;
        }
        return 0;
      });
      console.log(documents);
      // call the group powertakers document tarif generation super thing
      
      sendTariffChangeLetterPDF({ 
        groupId, 
        contractId: contract.id,
        documentId: documents[0].id,
        resolve: () => {
          Alert.success('<h4>' + (activeData.length - contracts.length) + '/'+ activeData.length + '</h4>' + 'successfully send for: ' + contract.fullContractNumber)
          next();
        },
        reject: (status, message) => {
          Alert.error('<h4>' + (activeData.length - contracts.length) + '/'+ activeData.length + '</h4>' + status + ' - ' + JSON.stringify(message));
          errors.push({
            contract, 
            message
          })
          next();
        } 
      });
    };
    goThrough();
  }

  const filterActive = () => {
    setFilterShowActive(!filterShowActive);
  }

  const applyAll = () => {
    const tempSelected = {};
    data.forEach((d) => {
      tempSelected[d.id] = !appliedAll;
    });
    setSelected(tempSelected);
    setAppliedAll(!appliedAll);
  }

  const apply = (original) => {
    if(selected[original.id]) {
      setAppliedAll(false);
    }
    setSelected({ ...selected, [original.id]: !selected[original.id] });
  }

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
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableStatus` })} />
      ),
      accessor: 'status',
      className: 'cy-text',
      Cell: ({ original }) => (
        <div>
          <StatusIcon active={original.status === 'active' && selected[original.id] }>{ original.status  }</StatusIcon>
        </div>
      ),
    },
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableDocuments` })} />
      ),
      accessor: 'documents',
      className: 'cy-text',
      Cell: ({ original }) => (
        <div>
          <DocumentList>
            <ul>
            { 
              original.documents && original.documents.array ? 
              original.documents.array.filter(({purpose}) => purpose === 'tariff_change_letter').map(({id, filename}, index) => (
                <li 
                  key={index} 
                  onClick={() => getContractPDFData({ groupId, contractId: original.id, documentId: id, fileName: filename })}
                >{filename}</li>
              )) : ''  
            }
            </ul>
          </DocumentList>
        </div>
      ),
    },
    {
      accessor: 'tariffs',
      Cell: ({ original }) => (
        <div onClick={() => apply(original)}>
          {selected[original.id] ? <i className="fa fa-check" /> : <i className="fa fa-remove" />}
        </div>
      ),
    },
  ];

  return (
    <NestedDetailsWrapper>
      <ToolBar>
        <ul>
          <li>
            <SwitchButton>
              <input type="checkbox" id="filterActive" />
              <label htmlFor="filterActive" onClick={filterActive}>show applied</label>  
            </SwitchButton>
          </li>
          <li>
            <SwitchButton>
              <input type="checkbox" id="applyAll" checked={appliedAll} onChange={applyAll}/>
              <label htmlFor="applyAll" >apply all</label>  
            </SwitchButton>
          </li>
          <li>
            <button onClick={handleUpdate} className="btn btn-primary">
              Update
            </button>
          </li>
          <li style={{ marginLeft: '10px' }}>
            <SpanClick data-cy="add tariff CTA" onClick={() => handleGeneratePDFs()}>
              <FormattedMessage id="admin.tariffs.generateTariffChangeLetter" /> <i className="fa fa-cog" />
            </SpanClick>
          </li>
          <li style={{ marginLeft: '10px' }}>
            <SpanClick data-cy="add tariff CTA" onClick={() => handleSendTariffChangeLetterPDFs()}>
              <FormattedMessage id="admin.tariffs.sendTariffChangeLetter" /> <i className="fa fa-envelope" />
            </SpanClick>
          </li>
        </ul>
      </ToolBar>
      { generationErrors && generationErrors.length ? (
        <ResponseOutputBox>
          <ul>
          { generationErrors.map((error, index) => (
            <li key={index}>{error.contract.fullContractNumber} - { JSON.stringify(error.message) }</li>
          )) }
          </ul>
        </ResponseOutputBox>
      ) : null}
      
      <ReactTableSorted
        {...{
          data: filterShowActive ? data.filter((d) => d.status === 'active' && selected[d.id]) : data,
          columns,
          uiSortPath: `groups.${groupId}.tariffs.${tariffId}.powertakers`,
        }}
      />
      <br/>
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
    loadingGroupPowertakers: Contracts.actions.loadingGroupPowertakers,
    loadedGroupPowertakers: Contracts.actions.loadedGroupPowertakers,
    loadGroupPowertakers: Contracts.actions.loadGroupPowertakers,
    updateContract: Contracts.actions.updateContract,
    getContractPDFData: Contracts.actions.getContractPDFData,
    attachContractPDF: Contracts.actions.attachContractPDF,
    generateContractPDF: Contracts.actions.generateContractPDF,
    sendTariffChangeLetterPDF: Contracts.actions.sendTariffChangeLetterPDF,
  },
)(injectIntl(NestedDetails));
