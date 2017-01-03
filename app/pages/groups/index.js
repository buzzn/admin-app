import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '../../actions';

class Groups extends Component {
  componentWillReceiveProps(nextProps) {
    console.log(this.props);

  }

  render() {

    console.log(this.props);

    return (
      <div>

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    groups: state.app.groups,
  };
}

export default connect(mapStateToProps, { setGroups: actions.setGroups })(Groups);
