import React from 'react';
import { connect } from 'react-redux';
import Groups from 'groups';

type PropsT = {
  loadGroupMembersExport: Function;
  groupId: String;
  groupName: String;
};

/**
 * A widget to request all the group's members in a csv dtfv-format.
 * @param groupId The group which members are to be exported.
 * @param groupName The group's name. This is used to generate the default file name of the generated file.
 */
function GroupMembersExport({loadGroupMembersExport, groupId, groupName}: PropsT) {
  return (<p>
            This exports all the group's members as a dtfv/csv file.
            <br />
            <br />
            <button className="btn btn-primary" onClick={() => loadGroupMembersExport(groupId, groupName)}>Export group's members</button>
          </p>);
}

type StatePart = {
  loadGroupMembersExport: Function;
}

function mapStateToProps(state: StatePart) {
  return {
    loadGroupMembersExport: state.loadGroupMembersExport,
  };
}

export default connect(
  mapStateToProps,
  // @ts-ignore
  { loadGroupMembersExport: Groups.actions.loadGroupMembersExport },
)(GroupMembersExport);
