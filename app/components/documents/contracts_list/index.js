import * as React from 'react';
import ReactTable from 'react-table';
import Dropzone from 'react-dropzone';
import Alert from 'react-s-alert';
import { injectIntl } from 'react-intl';
import { tableParts as TableParts } from 'react_table_config';
import PageTitle from 'components/page_title';
import { CenterContent } from 'components/style';

const ContractsList = ({
  breadcrumbs,
  contracts,
  loading,
  url,
  intl,
  getContractPDFData,
  attachContractPDF,
  generateContractPDF,
  deleteContractPDF,
  loadGroupContracts,
  groupId,
}) => {
  const data = contracts.filter(c => !!c.id).map(c => ({
    ...c,
    type: intl.formatMessage({ id: `admin.contracts.${c.type}` }),
    status: c.status,
    documents: c.documents.array,
    since: c.signingDate,
    number: c.fullContractNumber,
    link: `${url}/${c.id}`,
  }));

  const columns = [
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: 'admin.contracts.tableType' })} />
      ),
      accessor: 'type',
      minWidth: 200,
    },
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: 'admin.contracts.tableStatus' })} />
      ),
      accessor: 'status',
      minWidth: 40,
    },
    {
      Header: 'Documents',
      accessor: 'documents',
      minWidth: 200,
      Cell: ({ original, value }) => (
        <React.Fragment>
          {!!original.allowedActions &&
            original.allowedActions.documentLocalpoolProcessingContract && (
              <button
                onClick={async () => {
                  const res = await new Promise((resolve, reject) =>
                    generateContractPDF({ groupId, contractId: original.id, resolve, reject }));
                  if (res) {
                    Alert.error(res);
                  } else {
                    Alert.success('Document generated');
                    loadGroupContracts(groupId);
                  }
                }}
              >
                Generate PDF
              </button>
            )}
          <ul>
            {value.map(d => (
              <li style={{ cursor: 'pointer' }} key={d.id}>
                <i
                  className="fa fa-remove"
                  onClick={async () => {
                    if (!confirm('Delete?')) return;
                    const res = await new Promise((resolve, reject) =>
                      deleteContractPDF({ groupId, contractId: original.id, documentId: d.id, resolve, reject }));
                    if (res) {
                      Alert.error(res);
                    } else {
                      Alert.success('Document deleted');
                      loadGroupContracts(groupId);
                    }
                  }}
                />
                &nbsp;
                <span
                  onClick={() =>
                    getContractPDFData({ groupId, contractId: original.id, documentId: d.id, fileName: d.filename })
                  }
                >
                  {d.filename}
                </span>
              </li>
            ))}
          </ul>
        </React.Fragment>
      ),
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
      Header: 'Dropzone',
      accessor: '',
      width: 200,
      Cell: ({ original }) => (
        <Dropzone
          {...{
            multiple: false,
            accept: 'application/pdf',
            name: 'file',
            onDropRejected: () => {
              Alert.error('Only PDFs');
            },
            onDropAccepted: async (files) => {
              const params = new FormData();
              params.append('file', files[0]);
              const res = await new Promise((resolve, reject) =>
                attachContractPDF({ groupId, contractId: original.id, params, resolve, reject }));
              if (res) {
                Alert.error(res);
              } else {
                Alert.success('Document attached');
                loadGroupContracts(groupId);
              }
            },
          }}
        >
          <p>drop documents here</p>
        </Dropzone>
      ),
    },
  ];

  return (
    <React.Fragment>
      <PageTitle
        {...{
          breadcrumbs: breadcrumbs.concat([{ id: '-----', title: 'Localpool contracts' }]),
          title: 'Localpool contracts',
        }}
      />
      <CenterContent>
        <ReactTable {...{ data, columns }} />
      </CenterContent>
    </React.Fragment>
  );
};

export default injectIntl(ContractsList);
