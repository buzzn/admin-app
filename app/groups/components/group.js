import React from 'react';
import { connect } from 'react-redux';
import find from 'lodash/find';

export const Group = ({ group }) => {
  if (!group) return (<div>Group not found</div>);

  return (
    <div className="group">
      <h4>{ group.attributes.name }</h4>
      <span>Readable: { group.attributes.readable }</span>
      <p>{ group.attributes.description }</p>
    </div>
  );
};

function mapStateToProps(state, props) {
  return {
    group: find(state.groups.groups, group => group.id === props.params.id),
  };
}

export default connect(mapStateToProps)(Group);
