import React from 'react';
import { connect } from 'react-redux';
import Groups from 'reports';
import { FormattedMessage, injectIntl } from 'react-intl';
import Loading from 'components/loading';
import { ReportsState } from 'reports';
import { Row, Col } from 'reactstrap';

/**
 * A widget to request all the group's members in a csv dtfv-format.
 * @param loadGroupMembersExport A method which triggers the export of the group's members.
 * @param loading Indicating whether data is being loaded.
 * @param groupId The group which members are to be exported.
 * @param groupName The group's name. This is used to generate the default file name of the generated file.
 */
const GroupMembersExport = ({
  loadGroupMembersExport,
  loading,
  groupId,
  groupName,
}) => {
  if (loading) {
    return <Loading minHeight={40} />;
  }

  const prefix = 'admin.reports.groupsMembersExport';
  return (
    <React.Fragment>
      <div className="controls">
        <Row className="fieldgroup">
          <Col xs={12} className="fieldname">
            <FormattedMessage id={`${prefix}.Text`} />
          </Col>
        </Row>
        <Row className="fieldgroup">
          <Col className="fieldname">
            <button
              className="btn btn-primary"
              onClick={() => loadGroupMembersExport(groupId, groupName)}
            >
              <FormattedMessage id={`${prefix}.Submit`} />
            </button>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

type StatePart = {
  reports: ReportsState;
};

const mapStateToProps = (state: StatePart) => {
  return {
    loading: state.reports.loadingGroupMembersExport,
  };
};

export default connect(
  mapStateToProps,
  { loadGroupMembersExport: Groups.actions.loadGroupMembersExport },
)(injectIntl(GroupMembersExport));
