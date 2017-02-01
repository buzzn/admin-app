import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '../actions';
import Profile from '../../profiles';

export class List extends Component {
  static propTypes = {
    users: React.PropTypes.array.isRequired,
    usersPathPrefix: React.PropTypes.string,
    loadUsers: React.PropTypes.func.isRequired,
    loadGroupMembers: React.PropTypes.func.isRequired,
    groupId: React.PropTypes.string,
    type: React.PropTypes.string,
  };

  static defaultProps = {
    users: [],
    usersPathPrefix: '/users',
    type: 'users',
  };

  componentWillMount() {
    const { loadUsers, loadGroupMembers, type, groupId } = this.props;

    if (type === 'groupMembers') {
      loadGroupMembers(groupId);
    } else {
      loadUsers();
    }
  }

  render() {
    const { users, usersPathPrefix } = this.props;

    return (
      <div>
        <h4>Users:</h4>
        <Profile.ListContainer userIds={ users.map(u => u.id) } pathPrefix={ usersPathPrefix } />
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    users: props.type === 'groupMembers' ? state.users.groupMembers : state.users.users,
  };
}

export default connect(mapStateToProps, {
  loadUsers: actions.loadUsers,
  loadGroupMembers: actions.loadGroupMembers,
})(List);
