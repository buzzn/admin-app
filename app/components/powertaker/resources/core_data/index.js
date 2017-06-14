import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export const CoreData = ({ user: { firstName, title } }) => (
  <div className="row">
    <div className="col-12">
      <h5>Core Data:</h5>
      <b>Title:</b> { title }
      <br/>
      <b>First Name:</b> { firstName }
    </div>
  </div>
);

CoreData.propTypes = {
  user: PropTypes.object,
};

CoreData.defaultProps = {
  user: {},
};

function mapStateToProps(state) {
  return {
    user: state.users.user,
  };
}

export default connect(mapStateToProps)(CoreData);
