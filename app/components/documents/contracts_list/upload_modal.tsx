import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import Dropzone from 'react-dropzone';
import Alert from 'react-s-alert';

import { DropzoneWrapper } from './style';

interface Props {
  isOpen: boolean;
  toggle: () => void;
  attachContractPDF: (any) => void;
  loadGroupContracts: (string) => void;
  groupId: string;
  contractId: string;
}

class UploadModal extends React.Component<Props> {
  handleFileUpload = async (files) => {
    const { attachContractPDF, loadGroupContracts, groupId, contractId, toggle } = this.props;
    const params = new FormData();
    params.append('file', files[0]);
    const res = await new Promise((resolve, reject) => attachContractPDF({ groupId, contractId, params, resolve, reject }));
    if (res) {
      Alert.error(JSON.stringify(res));
    } else {
      Alert.success('Document attached');
      loadGroupContracts(groupId);
      toggle();
    }
  };

  render() {
    const { isOpen, toggle } = this.props;
    const prefix = 'admin.contracts';

    return (
      <Modal {...{ isOpen, toggle }}>
        <ModalHeader toggle={toggle}>
          <FormattedMessage id={`${prefix}.modalHeaderUpload`} />
        </ModalHeader>
        <ModalBody>
          <DropzoneWrapper>
            <Dropzone
              {...{
                multiple: false,
                accept: 'application/pdf',
                name: 'file',
                onDropRejected: () => {
                  Alert.error('Only PDFs');
                },
                onDropAccepted: this.handleFileUpload,
                className: 'dropzone',
              }}
            >
              <div className="dropzone-text"><FormattedMessage id={`${prefix}.dropDocumentsHere`} /></div>
            </Dropzone>
          </DropzoneWrapper>
        </ModalBody>
      </Modal>
    );
  }
}
export default UploadModal;
