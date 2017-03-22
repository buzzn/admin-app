import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Users from 'users';

import './style.scss';

export class Powertakers extends Component {
  static propTypes = {
    loadGroupPowertakers: React.PropTypes.func.isRequired,
    groupId: React.PropTypes.string.isRequired,
    users: React.PropTypes.array.isRequired,
    profiles: React.PropTypes.object.isRequired,
    loading: React.PropTypes.bool.isRequired,
  };

  static defaultProps = {
    users: [],
    profiles: {},
  };

  componentWillMount() {
    const { loadGroupPowertakers, groupId } = this.props;
    loadGroupPowertakers(groupId);
  }

  render() {
    const { users, profiles, groupId, loading } = this.props;

    if (loading) return (<div>Loading...</div>);

    return (
      <div className="row">
        <div className="col-12">
          <h5>Powertakers</h5>
          <p>{ users.length } powertakers</p>
        </div>
        <div className="col-12 no-padding">
          <table className="table">
            <thead className="thead-default">
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              { users.map((user) => {
                const profile = profiles[user.id];

                if (!profile || profile.loading) {
                  return (
                    <tr key={ user.id }><td colSpan="3">Loading...</td></tr>
                  );
                }

                return (
                  <tr key={ user.id }>
                    <td>
                      <img src={ profile.mdImg } className="table-avatar"/>
                      { `${profile.firstName} ${profile.lastName}` }
                    </td>
                    <td>Location</td>
                    <td>
                      <Link
                        to={ `/localpools/${groupId}/powertakers/${user.id}` }
                        className="btn btn-secondary btn-beige"
                        style={{ float: 'right', marginRight: '15px' }}>
                        View
                      </Link>
                    </td>
                  </tr>
                );
              }) }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    users: state.users.groupPowertakers,
    profiles: state.profiles.profiles,
    loading: state.users.loadingGroupPowertakers,
  };
}

export default connect(mapStateToProps, { loadGroupPowertakers: Users.actions.loadGroupPowertakers })(Powertakers);
