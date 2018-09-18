import * as React from 'react';
import get from 'lodash/get';
import ReactTable from 'react-table';
import { injectIntl, FormattedMessage } from 'react-intl';
import { UncontrolledTooltip } from 'reactstrap';
import { tableParts as TableParts } from 'react_table_config';
import { SpanClick } from 'components/style';
import AddContract from '../add_contract';
import NestedDetails from './nested_details';

class ContractsList extends React.Component {
  state = { isOpen: false, expanded: {} };

  handleRowClick = (rowNum) => {
    this.setState(state => ({ expanded: { ...state.expanded, [rowNum]: !state.expanded[rowNum] } }));
  };

  switchAddContract = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  addContract = async (params) => {
    const { addContract, groupId, generateContractPDF, loadGroupContracts } = this.props;

    return new Promise((resolve, reject) => {
      addContract({ resolve, reject, params, groupId });
    })
      .then((res) => {
        if (params.generatePDF) {
          return new Promise((resolve, reject) => generateContractPDF({ groupId, contractId: res.id, resolve, reject })).then(loadGroupContracts(groupId));
        }
        return res;
      })
      .then(() => this.switchAddContract());
  };

  render() {
    const {
      contracts,
      url,
      intl,
      getContractPDFData,
      attachContractPDF,
      generateContractPDF,
      deleteContractPDF,
      loadGroupContracts,
      addContractFormValues,
      groupId,
      group,
      loading,
    } = this.props;
    const { isOpen } = this.state;

    const contractTypes = [];
    if (
      get(group.allowedActions, 'createLocalpoolProcessingContract')
      && !get(group.allowedActions, 'createLocalpoolProcessingContract.localpoolProcessingContract', []).find(
        e => e === 'cannot be defined',
      )
    ) {
      contractTypes.push({
        value: 'contract_localpool_processing',
        label: 'LPC',
      });
    }
    if (get(group.allowedActions, 'createMeteringPointOperatorContract') === true) {
      contractTypes.push({
        value: 'contract_metering_point_operator',
        label: 'MPO',
      });
    }

    const data = contracts.filter(c => !!c.id).map(c => ({
      ...c,
      typeIntl: intl.formatMessage({ id: `admin.contracts.${c.type}` }),
      ownerChanged: !['contract_localpool_power_taker', 'contract_localpool_third_party'].includes(c.type)
        ? c.customer.id !== get(group.owner, 'id')
        : false,
      since: c.signingDate,
      number: c.fullContractNumber,
      link: `${url}/${c.id}`,
    }));

    const columns = [
      {
        Header: () => (
          <TableParts.components.headerCell title={intl.formatMessage({ id: 'admin.contracts.tableType' })} />
        ),
        accessor: 'typeIntl',
        minWidth: 200,
      },
      {
        Header: () => <i className="fa fa-warning" />,
        accessor: 'ownerChanged',
        width: 40,
        Cell: ({ value, original }) => (value ? (
            <React.Fragment>
              <i id={`owner-changed-${original.id}`} className="fa fa-warning" style={{ color: 'red' }} />
              <UncontrolledTooltip target={`owner-changed-${original.id}`}>
                The group owner was changed
              </UncontrolledTooltip>
            </React.Fragment>
        ) : (
          ''
        )),
      },
      {
        Header: () => (
          <TableParts.components.headerCell title={intl.formatMessage({ id: 'admin.contracts.tableSince' })} />
        ),
        accessor: 'since',
        minWidth: 100,
      },
      {
        Header: () => (
          <TableParts.components.headerCell title={intl.formatMessage({ id: 'admin.contracts.tableNumber' })} />
        ),
        accessor: 'number',
        minWidth: 60,
      },
      {
        expander: true,
        Expander: row => (
          <div>{row.isExpanded ? <i className="fa fa-chevron-up" /> : <i className="fa fa-chevron-down" />}</div>
        ),
        style: { color: '#bdbdbd' },
      },
    ];

    return (
      <div className="p-0">
        {!!contractTypes.length && (
          <SpanClick onClick={this.switchAddContract} className="float-right">
            <FormattedMessage id="admin.contracts.addNew" /> <i className="fa fa-plus-circle" />
          </SpanClick>
        )}
        <AddContract
          {...{
            loading,
            toggle: this.switchAddContract,
            isOpen,
            addContractFormValues,
            // TODO: replace with real validationRules
            validationRules: {},
            onSubmit: this.addContract,
            contractTypes,
            initialValues: { type: get(contractTypes[0], 'value') },
            groupName: group.name,
            groupOwner: group.owner,
            groupOwnerErrors: get(group.incompleteness, 'owner'),
            url,
          }}
        />
        <br />
        <ReactTable
          {...{
            data,
            columns,
            expanded: this.state.expanded,
            getTrProps: (_state, rowInfo) => ({
              onClick: (_event, handleOriginal) => {
                this.handleRowClick(rowInfo.viewIndex);
                handleOriginal && handleOriginal();
              },
            }),
            SubComponent: row => (
              <NestedDetails
                {...{
                  contract: row.original,
                  groupName: group.name,
                  groupId,
                  groupOwner: group.owner.name || `${group.owner.firstName} ${group.owner.lastName}`,
                  generateContractPDF,
                  loadGroupContracts,
                  deleteContractPDF,
                  getContractPDFData,
                  attachContractPDF,
                  url,
                }}
              />
            ),
          }}
        />
      </div>
    );
  }
}

export default injectIntl(ContractsList);
