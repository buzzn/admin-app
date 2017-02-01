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
    loadGroupManagers: React.PropTypes.func.isRequired,
    groupId: React.PropTypes.string,
    type: React.PropTypes.string,
  };

  static defaultProps = {
    users: [],
    usersPathPrefix: '/users',
    type: 'users',
  };

  componentWillMount() {
    const { loadUsers, loadGroupMembers, loadGroupManagers, type, groupId } = this.props;

    switch (type) {
      case 'groupMembers':
        loadGroupMembers(groupId);
        break;
      case 'groupManagers':
        loadGroupManagers(groupId);
        break;
      default:
        loadUsers();
        break;
    }
  }

  render() {
    const { users, usersPathPrefix } = this.props;

    if (users.length === 0) return (<div></div>);

    return (
      <div>
        <h4>Users:</h4>
        <Profile.ListContainer userIds={ users.map(u => u.id) } pathPrefix={ usersPathPrefix } />
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  function users({ usersState, type }) {
    switch (type) {
      case 'groupMembers':
        return usersState.groupMembers;
      case 'groupManagers':
        return usersState.groupManagers;
      default:
        return usersState.users;
    }
  }

  return {
    users: users({ usersState: state.users, type: props.type }),
  };
}

export default connect(mapStateToProps, {
  loadUsers: actions.loadUsers,
  loadGroupMembers: actions.loadGroupMembers,
  loadGroupManagers: actions.loadGroupManagers,
})(List);
