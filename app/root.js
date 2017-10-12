import React from 'react';
import { connect } from 'react-redux';
import OldRootContainer from 'old_root';
import NewRootContainer from 'new_root';

export const Root = ({ uiVer }) => {
  if (uiVer === 'old') return <OldRootContainer/>;
  return <NewRootContainer/>;
};

function mapStateToProps(state) {
  return {
    uiVer: state.app.uiVer,
  };
}

export default connect(mapStateToProps)(Root);
