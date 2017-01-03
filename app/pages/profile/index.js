import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '../../actions';

import Friends from '../../components/friends';
import Groups from '../../components/groups';

class Profile extends Component {
  componentWillReceiveProps(nextProps) {
    const { params: { id: newUserId } } = nextProps;
    const { userId, userMe, setUserId } = this.props;
    if (userId !== newUserId) {
      if (newUserId) {
        setUserId(newUserId);
      } else if (userId !== userMe) {
        setUserId(userMe);
      }
    }
  }

  render() {
    const { userProfile, userFriends, userGroups } = this.props;

    return (
      <div>
        { !!userProfile &&
        <div>
          <h2>{ userProfile.firstName } { userProfile.lastName }</h2>

          { userFriends.length > 0 &&
            <Friends friends={ userFriends }/>
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
    userMe: state.app.userMe,
    userId: state.app.userId,
    userProfile: state.app.userProfile,
    userFriends: state.app.userFriends,
    userGroups: state.app.userGroups,
  };
}

export default connect(mapStateToProps, { setUserId: actions.setUserId })(Profile);
