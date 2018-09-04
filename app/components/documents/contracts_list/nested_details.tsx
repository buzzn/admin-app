import * as React from 'react';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Row, Col, UncontrolledTooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import Alert from 'react-s-alert';
import LabeledValue from 'components/labeled_value';
import UploadModal from './upload_modal';

import { DocumentsListHeader, NestedDetailsWrapper } from './style';

interface Props {
  contract: { [key: string]: any };
  groupName: string;
  groupId: string;
  groupOwner: string;
  generateContractPDF: (any) => void;
  loadGroupContracts: (string) => void;
  deleteContractPDF: (any) => void;
  getContractPDFData: (any) => void;
  attachContractPDF: (any) => void;
  url: string;
}

interface State {
  isOpen: boolean;
}

class NestedDetails extends React.Component<Props, State> {
  state = { isOpen: false };

  switchUpload = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  handleGeneratePDF = async (contractId) => {
    const { generateContractPDF, groupId, loadGroupContracts } = this.props;
    const res = await new Promise((resolve, reject) => generateContractPDF({ groupId, contractId, resolve, reject }));
    if (res) {
      Alert.error(JSON.stringify(res));
    } else {
      Alert.success('Document generated');
      loadGroupContracts(groupId);
    }
  };

  handleDeletePDF = async ({ contractId, documentId }) => {
    const { deleteContractPDF, groupId, loadGroupContracts } = this.props;
    if (!confirm('Delete?')) return;
    const res = await new Promise((resolve, reject) => deleteContractPDF({ groupId, contractId, documentId, resolve, reject }));
    if (res) {
      Alert.error(JSON.stringify(res));
    } else {
      Alert.success('Document deleted');
      loadGroupContracts(groupId);
    }
  };

  render() {
    const {
      contract,
      groupName,
      groupId,
      groupOwner,
      getContractPDFData,
      attachContractPDF,
      loadGroupContracts,
      url,
    } = this.props;

    const prefix = 'admin.contracts';

    const PDFdisabled = !!contract.allowedActions && contract.allowedActions.documentLocalpoolProcessingContract !== true;

    return (
      <NestedDetailsWrapper>
        <Row>
          <Col xs={12}>
            <h6>
              <FormattedMessage id="admin.groups.name" />: {groupName}
            </h6>
          </Col>
          <Col xs={12}>
            <LabeledValue
              {...{
                label: <FormattedMessage id="admin.groups.owner" />,
                value: (
                  <Link
                    to={`${url
                      .split('/')
                      .slice(0, -1)
                      .join('/')}/settings/powergiver`}
                  >
                    {groupOwner}
                  </Link>
                ),
              }}
            />
          </Col>
          <Col xs={8}>
            <LabeledValue
              {...{
                label: <FormattedMessage id={`${prefix}.contractNumber`} />,
                value: (
                  <Link
                    to={`${url
                      .split('/')
                      .slice(0, -1)
                      .join('/')}/contracts/${contract.id}`}
                  >
                    {contract.fullContractNumber}
                  </Link>
                ),
              }}
            />
          </Col>
          <Col xs={4}>
            <LabeledValue {...{ label: <FormattedMessage id={`${prefix}.status`} />, value: contract.status }} />
          </Col>
          <Col xs={8}>
            <LabeledValue
              {...{
                label: <FormattedMessage id={`${prefix}.createdAt`} />,
                value: moment(contract.createdAt).format('DD.MM.YYYY'),
              }}
            />
          </Col>
          <Col xs={4}>
            <LabeledValue
              {...{
                label: <FormattedMessage id={`${prefix}.updatedAt`} />,
                value: moment(contract.updatedAt).format('DD.MM.YYYY'),
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <br />
            {!!contract.allowedActions && (
              <span id="generate-pdf">
                <button
                  className="btn btn-dark btn-sm"
                  onClick={() => this.handleGeneratePDF(contract.id)}
                  disabled={PDFdisabled}
                >
                  <FormattedMessage id="admin.buttons.generatePDF" />
                </button>
              </span>
            )}
            {PDFdisabled && (
              <UncontrolledTooltip target="generate-pdf">Please, fill the group owner</UncontrolledTooltip>
            )}
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <DocumentsListHeader>
              Documents:
              <span style={{ cursor: 'pointer' }} className="upload-button" onClick={this.switchUpload}>
                <FormattedMessage id="admin.buttons.buttonUploadDocument" /> <i className="fa fa-plus-circle" />
              </span>
            </DocumentsListHeader>
            {contract.documents.array.map(d => (
              <Row key={d.id}>
                <Col xs={8}>
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => getContractPDFData({ groupId, contractId: contract.id, documentId: d.id, fileName: d.filename })
                    }
                  >
                    {d.filename}
                  </span>
                </Col>
                <Col xs={3}>{moment(d.createdAt).format('DD.MM.YYYY')}</Col>
                <Col xs={1}>
                  <i
                    style={{ cursor: 'pointer' }}
                    className="fa fa-remove"
                    onClick={() => this.handleDeletePDF({ contractId: contract.id, documentId: d.id })}
                  />
                </Col>
              </Row>
            ))}
          </Col>
        </Row>
        <UploadModal
          {...{
            attachContractPDF,
            loadGroupContracts,
            groupId,
            contractId: contract.id,
            isOpen: this.state.isOpen,
            toggle: this.switchUpload,
          }}
        />
      </NestedDetailsWrapper>
    );
  }
}

export default NestedDetails;
