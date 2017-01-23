import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '../actions';
import Profile from '../../profiles';

export class List extends Component {
  static propTypes = {
    users: React.PropTypes.array.isRequired,
    usersPathPrefix: React.PropTypes.string,
    loadUsers: React.PropTypes.func.isRequired,
  };

  static defaultProps = {
    users: [],
    usersPathPrefix: '/users',
  };

  componentWillMount() {
    const { loadUsers } = this.props;
    loadUsers();
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

function mapStateToProps(state) {
  return {
    users: state.users.users,
  };
}

export default connect(mapStateToProps, { loadUsers: actions.loadUsers })(List);
