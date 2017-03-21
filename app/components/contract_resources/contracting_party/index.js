import React from 'react';
import { Link } from 'react-router-dom';

const ContractingParty = ({ loading, customer, partyType, groupId, contractId }) => {
  if (loading || !customer.id) {
    return (<div className="row"><div className="col-12">Loading...</div></div>);
  }

  const { address } = customer;
  const customerType = type => (type === 'organizations' ? 'Organization' : 'Person');
  const addressString = attributes => (`${attributes.zip} ${attributes.country} ${attributes.city} ${attributes.streetName} ${attributes.streetNumber}`);

  return (
    <div className="row">
      <div className="col-6">
        <div className="row">
          <div className="col-6"><span className="title">Name:</span></div>
          <div className="col-6">{ customer.attributes.name }</div>
          <div className="col-6"><span className="title">Type:</span></div>
          <div className="col-6">{ customerType(customer.type) }</div>
          <div className="col-6"><span className="title">Address:</span></div>
          <div className="col-6">{ address.attributes && `${addressString(address.attributes)}` }</div>
          <div className="col-6"><span className="title">Email:</span></div>
          <div className="col-6">{ customer.attributes.email }</div>
          <div className="col-6"><span className="title">Phone:</span></div>
          <div className="col-6">{ customer.attributes.phone }</div>
          <div className="col-6"><span className="title">Fax:</span></div>
          <div className="col-6">{ customer.attributes.fax }</div>
        </div>
      </div>
      <div className="col-6">
        <Link
          to={ `/localpools/${groupId}/contracts/${contractId}/${partyType}/show` }
          className="btn btn-secondary btn-beige"
          style={{ float: 'right', marginRight: '15px' }}>
          View
        </Link>
      </div>
    </div>
  );
};

ContractingParty.propTypes = {
  loading: React.PropTypes.bool.isRequired,
  customer: React.PropTypes.object.isRequired,
  partyType: React.PropTypes.string.isRequired,
  groupId: React.PropTypes.string.isRequired,
  contractId: React.PropTypes.string.isRequired,
};

export default ContractingParty;
