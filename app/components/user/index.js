import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '../../actions';
import Profile from '../../profiles';
import Groups from '../../groups';

export class User extends Component {
  componentDidMount() {
    const { setUserId, userId } = this.props;
    setUserId(userId);
  }

  componentWillReceiveProps(nextProps) {
    const { setUserId, userId } = this.props;
    const { userId: newUserId } = nextProps;
    if (userId !== newUserId) setUserId(newUserId);
  }

  shouldComponentUpdate(nextProps) {
    const { userId } = this.props;
    const { userId: newUserId } = nextProps;
    return userId !== newUserId;
  }

  render() {
    const { userId, friends } = this.props;

    return (
      <div>
        <Profile.ProfileContainer userId={ userId } />
        <Groups.ListConnected userId={ userId } pathPrefix="/groups" />
        { friends.length > 0 &&
          <div>
            <h4>Friends:</h4>
            <Profile.ListContainer userIds={ friends.map(f => f.id) } pathPrefix="/user" />
          </div>
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
