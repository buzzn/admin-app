import * as React from 'react';
import moment from 'moment';
import snakeCase from 'lodash/snakeCase';
import capitalize from 'lodash/capitalize';
import { FormattedMessage } from 'react-intl';
import { Row, Col, UncontrolledTooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import Alert from 'react-s-alert';
import LabeledValue from 'components/labeled_value';
import Loading from 'components/loading';
import { NestedDetailsWrapper } from 'components/style';
import { formatErrMessage } from '_util';
import UploadModal from './upload_modal';

import { DocumentsListHeader, TemplateDropdown } from './style';

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
  generatingPDF: boolean;
  selectedTemplate: string;
}

class NestedDetails extends React.Component<Props, State> {
  state = { isOpen: false, generatingPDF: false, selectedTemplate: '' };

  switchUpload = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  handleTemplateSelect = ({ target: { value } }) => {
    this.setState({ selectedTemplate: value });
  };

  handleGeneratePDF = async ({ contractId, template }) => {
    const { generateContractPDF, groupId, loadGroupContracts } = this.props;
    this.setState({ generatingPDF: true });
    try {
      const res = await new Promise((resolve, reject) => generateContractPDF({ groupId, contractId, resolve, reject, template }));
      if (res) {
        Alert.error(JSON.stringify(res));
      } else {
        Alert.success('Document generated');
        loadGroupContracts(groupId);
      }
    } catch (error) {
      Alert.error(JSON.stringify(error));
    }
    this.setState({ generatingPDF: false });
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

    const { generatingPDF, selectedTemplate } = this.state;

    const prefix = 'admin.contracts';

    const availableTemplates = (contract.allowedActions || {}).document || {};

    return (
      <NestedDetailsWrapper>
        {generatingPDF && <Loading absolute={true} />}
        <Row>
          <Col xs={12}>
            <h6>
              <FormattedMessage id="admin.groups.name" />: {groupName}
            </h6>
          </Col>
          <Col xs={12}>
            {['contract_localpool_power_taker', 'contract_localpool_third_party'].includes(contract.type) ? (
              <LabeledValue
                {...{
                  label: <FormattedMessage id="admin.groups.customer" />,
                  value:
                    contract.type === 'contract_localpool_power_taker' ? (
                      <Link
                        to={`${url
                          .split('/')
                          .slice(0, -1)
                          .join('/')}/powertakers/${contract.id}/powertaker`}
                      >
                        {contract.customer.type === 'person' ? `${contract.customer.firstName} ${contract.customer.lastName}` : contract.customer.name}
                      </Link>
                    ) : (
                      'Third party'
                    ),
                }}
              />
            ) : (
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
            )}
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
            {!!Object.keys(availableTemplates).length && (
              <React.Fragment>
                <span id="generate-pdf">
                  <TemplateDropdown
                    className="custom-select form-control"
                    onChange={this.handleTemplateSelect}
                    value={selectedTemplate}
                  >
                    <option value="">-----</option>
                    {Object.keys(availableTemplates).map(t => (
                      <option key={t} value={t}>
                        {snakeCase(t)
                          .split('_')
                          .map(s => capitalize(s))
                          .join(' ')}
                      </option>
                    ))}
                  </TemplateDropdown>
                  <button
                    className="btn btn-dark btn-sm"
                    onClick={() => this.handleGeneratePDF({ contractId: contract.id, template: selectedTemplate })}
                    disabled={availableTemplates[selectedTemplate] !== true}
                  >
                    <FormattedMessage id="admin.buttons.generatePDF" />
                  </button>
                </span>
                {!!selectedTemplate && availableTemplates[selectedTemplate] !== true && (
                  <UncontrolledTooltip target="generate-pdf">
                    {JSON.stringify(formatErrMessage(availableTemplates[selectedTemplate]))}
                  </UncontrolledTooltip>
                )}
              </React.Fragment>
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
