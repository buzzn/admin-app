import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '../../actions';

import Friends from '../../components/friends';
import Groups from '../../components/groups';

class Profile extends Component {
  componentWillReceiveProps(nextProps) {
    const { params: { id: newUserId } } = nextProps;
    const { userId, myId, setUserId } = this.props;
    if (userId !== newUserId) {
      if (newUserId) {
        setUserId(newUserId);
      } else if (userId !== myId) {
        setUserId(myId);
      }
    }
  }

  render() {
    const { profile, friends, userGroups } = this.props;

    return (
      <div>
        { !!profile &&
        <div>
          <h2>{ profile.firstName } { profile.lastName }</h2>

          { friends.length > 0 &&
            <Friends friends={ friends }/>
          }

          { userGroups.length > 0 &&
            <Groups groups={ userGroups }/>
          }

        </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    myId: state.app.myId,
    userId: state.app.userId,
    profile: state.app.profile,
    friends: state.app.friends,
    userGroups: state.app.userGroups,
  };
}

export default connect(mapStateToProps, { setUserId: actions.setUserId })(Profile);