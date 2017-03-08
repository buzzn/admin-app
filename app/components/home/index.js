import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import filter from 'lodash/filter';
import Groups from '../../groups';

export class Home extends Component {
  componentWillMount() {
    const { loadGroups } = this.props;
    loadGroups();
  }

  render() {
    const { configured, loading, groups } = this.props;

    if (!configured || loading) return (<div>Loading...</div>);

    if (groups.length === 0) return (<div>No groups found.</div>);

    return (<Redirect to={ `/localpools/${groups[0].id}` } />);
  }
}

function mapStateToProps(state) {
  return {
    configured: state.groups.configured,
    loading: state.groups.loadingGroups,
    groups: filter(state.groups.groups, group => group.type === 'localpools'),
  };
}

export default connect(mapStateToProps, { loadGroups: Groups.actions.loadGroups })(Home);
