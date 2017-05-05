import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ContractingParty = ({ loading, contractingParty, partyType, groupId, contractId }) => {
  if (contractingParty.status === 404) {
    return (<div className="row"><div className="col-12">Contracting party not found</div></div>);
  }

  if (loading || !contractingParty.id) {
    return (<div className="row"><div className="col-12">Loading...</div></div>);
  }

  const { address } = contractingParty;
  const cpType = type => (type === 'organization' ? 'Organization' : 'Person');
  const addressString = attributes => (`${attributes.zip} ${attributes.country} ${attributes.city} ${attributes.streetName} ${attributes.streetNumber}`);

  return (
    <div className="row">
      <div className="col-6">
        <div className="row">
          <div className="col-6"><span className="title">Name:</span></div>
          <div className="col-6">{ contractingParty.attributes.name }</div>
          <div className="col-6"><span className="title">Type:</span></div>
          <div className="col-6">{ cpType(contractingParty.attributes.type) }</div>
          <div className="col-6"><span className="title">Address:</span></div>
          <div className="col-6">{ address && address.attributes && `${addressString(address.attributes)}` }</div>
          <div className="col-6"><span className="title">Email:</span></div>
          <div className="col-6">{ contractingParty.attributes.email }</div>
          <div className="col-6"><span className="title">Phone:</span></div>
          <div className="col-6">{ contractingParty.attributes.phone }</div>
          <div className="col-6"><span className="title">Fax:</span></div>
          <div className="col-6">{ contractingParty.attributes.fax }</div>
        </div>
      </div>
      <div className="col-6">
        <Link
          to={ `/localpools/${groupId}/contracts/${contractId}/${partyType}/show` }
          className="btn btn-outline-secondary"
          style={{ float: 'right', marginRight: '15px' }}>
          View
        </Link>
      </div>
    </div>
  );
};

ContractingParty.propTypes = {
  loading: PropTypes.bool.isRequired,
  contractingParty: PropTypes.object.isRequired,
  partyType: PropTypes.string.isRequired,
  groupId: PropTypes.string.isRequired,
  contractId: PropTypes.string.isRequired,
};

export default ContractingParty;
