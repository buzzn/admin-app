import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '../actions';

export class Group extends Component {
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
        <p>{ group.attributes.description }</p>
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
