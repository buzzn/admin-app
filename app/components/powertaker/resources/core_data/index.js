import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export const CoreData = ({ groupPowertaker }) => (
  <div className="row">
    <div className="col-12">
      <h5>Core Data:</h5>
      <b>Title:</b> { groupPowertaker.type === 'person' ? `${groupPowertaker.firstName} ${groupPowertaker.lastName}` : groupPowertaker.name }
      <br/>
    </div>
  </div>
);

CoreData.propTypes = {
  groupPowertaker: PropTypes.object,
};

CoreData.defaultProps = {
  groupPowertaker: {},
};

function mapStateToProps(state) {
  return {
    groupPowertaker: state.contracts.groupPowertaker,
  };
}

export default connect(mapStateToProps)(CoreData);
