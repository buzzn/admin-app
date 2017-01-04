import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '../actions';
import List from './list';

export class ListContainer extends Component {
  componentWillMount() {
    const { loadGroups } = this.props;
    loadGroups();
  }

  render() {
    const { groups, pathname } = this.props;

    return (
      <List groups={ groups } pathPrefix={ pathname } />
    );
  }
}

function mapStateToProps(state) {
  return {
    groups: state.groups.groups,
  };
}

export default connect(mapStateToProps, { loadGroups: actions.loadGroups })(ListContainer);
