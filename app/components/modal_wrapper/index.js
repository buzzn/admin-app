import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const ModalWrapper = ({ modalTitle, children, isOpen, toggle, buttons }) => (
  <div>
    {/* autoFocus=false is a temporary workaround, see #532 in reactstrap */}
    <Modal size="lg" isOpen={ isOpen } toggle={ toggle } autoFocus={ false }>
      <ModalHeader toggle={ toggle }>{ modalTitle }</ModalHeader>
      <ModalBody>
        { children }
      </ModalBody>
      <ModalFooter>
        {
          buttons.map(button =>
            <button
              key={ button.id }
              type={ button.type }
              form={ button.form }
              className={ `btn ${button.className}` }
              onClick={ button.onClick }>{ button.text }</button>)
        }
      </ModalFooter>
    </Modal>
  </div>
);

ModalWrapper.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  buttons: PropTypes.array.isRequired,
};

export default ModalWrapper;
