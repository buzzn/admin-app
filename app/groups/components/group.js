import React, { Component } from 'react';
import { connect } from 'react-redux';
import Bubbles from '@buzzn/module_bubbles';
import { actions } from '../actions';
import Registers from '../../registers';
import Users from '../../users';

export class Group extends Component {
  static propTypes = {
    group: React.PropTypes.object,
    loading: React.PropTypes.bool,
    loadGroup: React.PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { loadGroup, params: { id } } = this.props;
    loadGroup(id);
  }

  render() {
    const { group, loading } = this.props;

    if (loading) return (<div>Loading...</div>);

    if (!group) return (<div>Group not found</div>);

    return (
      <div className="group">
        <h4>{ group.attributes.name }</h4>
        <span>Readable: { group.attributes.readable }</span>
        <Registers.ListContainer groupId={ group.id } />
        <Users.ListContainer type="groupMembers" groupId={ group.id } />
        <Bubbles.container />
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

export default connect(mapStateToProps, { loadGroup: actions.loadGroup })(Group);
