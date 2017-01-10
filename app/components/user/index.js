import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '../../actions';
import Profile from '../../profiles';
import Groups from '../../groups';

export class User extends Component {
  componentWillReceiveProps(nextProps) {
    const { setUserId, userId } = this.props;
    const { userId: newUserId } = nextProps;
    if (userId !== newUserId) setUserId(newUserId);
  }

  render() {
    const { userId, friends } = this.props;

    return (
      <div>
        <Profile.ProfileContainer userId={ userId } />
        <Groups.ListConnected userId={ userId } pathPrefix="/groups" />
        { friends.length > 0 && <h4>Friends:</h4> }
        { friends.map(friend => (
          <Profile.ProfileContainer key={ friend.id } userId={ friend.id } />
        ))
        }
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const userId = props.params.id || state.app.userMe;
  return {
    userId,
    friends: state.friends.friends,
  };
}

export default connect(mapStateToProps, { setUserId: actions.setUserId })(User);
