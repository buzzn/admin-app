import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '../../actions';
import Profile from '../../profiles';

export class User extends Component {
  componentWillReceiveProps(nextProps) {
    const { setUserId } = this.props;
    const { userId } = nextProps;
    setUserId(userId);
  }

  render() {
    const { userId } = this.props;

    return (
      <div>
        <Profile.ProfileContainer userId={ userId } />
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const userId = props.params.id || state.app.userMe;
  return {
    userId,
  };
}

export default connect(mapStateToProps, { setUserId: actions.setUserId })(User);
