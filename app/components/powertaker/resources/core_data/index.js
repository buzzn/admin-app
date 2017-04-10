import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export const CoreData = ({ profile: { firstName, title, loading } }) => (
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
  profile: PropTypes.object,
};

CoreData.defaultProps = {
  profile: {},
};

function mapStateToProps(state, props) {
  const { userId } = props;

  return {
    profile: state.profiles.profiles[userId],
  };
}

export default connect(mapStateToProps)(CoreData);
