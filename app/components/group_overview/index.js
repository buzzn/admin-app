import React, { Component } from 'react';
import { connect } from 'react-redux';
import Bubbles from '@buzzn/module_bubbles';
import Groups from '../../groups';

import './style.scss';

export class GroupOverview extends Component {
  static propTypes = {
    group: React.PropTypes.object,
    loading: React.PropTypes.bool.isRequired,
  };

  componentWillMount() {
    const { loadGroup, loadBubbles, match: { params: { groupId } } } = this.props;
    loadGroup(groupId);
    loadBubbles(groupId);
  }

  render() {
    const { group, loading } = this.props;

    if (loading) return (<div>Loading...</div>);

    if (!group) return (<div>404</div>);

    return (
      <div className="row">
        <div className="col-12"><div className="title">{ group.attributes.name }</div></div>
        <div className="col-6">Info</div>
        <div className="col-6"><Bubbles.container /></div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    group: state.groups.group,
    loading: state.groups.loadingGroup,
  };
}

export default connect(mapStateToProps, {
  loadGroup: Groups.actions.loadGroup,
  loadBubbles: Bubbles.actions.setGroup,
})(GroupOverview);
