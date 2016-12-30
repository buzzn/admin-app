import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '../../actions';
import Friends from '../friends';
import Groups from '../groups';

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
    const { profile, friends, groups } = this.props;

    return (
      <div>
        { !!profile &&
        <div>
          <h2>{ profile.firstName } { profile.lastName }</h2>
          { !!friends &&
            <Friends friends={ friends }/>
          }
          { !!groups && groups.length > 0 &&
            <Groups groups={ groups }/>
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
    groups: state.app.groups,
  };
}

export default connect(mapStateToProps, { setUserId: actions.setUserId })(Profile);
