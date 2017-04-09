import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions } from '../actions';
import Profile from '../../profiles';
import Groups from '../../groups';
import Meters from '../../meters';

export class User extends Component {
  static propTypes = {
    usersPathPrefix: PropTypes.string,
    metersPathPrefix: PropTypes.string,
    groupsPathPrefix: PropTypes.string,
    friends: PropTypes.array.isRequired,
    userId: PropTypes.string.isRequired,
    setUserId: PropTypes.func.isRequired,
  };

  static defaultProps = {
    usersPathPrefix: '/users',
    metersPathPrefix: '/meters',
    groupsPathPrefix: '/groups',
    friends: [],
  };

  componentDidMount() {
    const { setUserId, userId } = this.props;
    setUserId(userId);
  }

  componentWillReceiveProps(nextProps) {
    const { setUserId, userId } = this.props;
    const { userId: newUserId } = nextProps;
    if (userId !== newUserId) setUserId(newUserId);
  }

  render() {
    const { userId, friends, usersPathPrefix, metersPathPrefix, groupsPathPrefix } = this.props;

    return (
      <div>
        <Profile.ProfileContainer userId={ userId } />
        <Groups.ListConnected userId={ userId } pathPrefix={ groupsPathPrefix } />
        <Meters.ListConnected userId={ userId } pathPrefix={ metersPathPrefix } />

        { friends.length > 0 &&
        <div>
          <h4>Friends:</h4>
          <Profile.ListContainer userIds={ friends.map(f => f.id) } pathPrefix={ usersPathPrefix } />
        </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userId: props.params.id,
    friends: state.friends.friends,
  };
}

export default connect(mapStateToProps, { setUserId: actions.setUserId })(User);
