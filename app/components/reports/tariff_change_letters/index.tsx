import React, { useState } from 'react';
import { connect } from 'react-redux';
import Groups from 'reports';
import { FormattedMessage, injectIntl } from 'react-intl';
import Loading from 'components/loading';
import { ReportsState } from 'reports';
import { Row, Col } from 'reactstrap';

/**
 * A widget to request all the group's members in a csv dtfv-format.
 * @param getTariffChangeLetters A method which triggers the export of the group's members.
 * @param loading Indicating whether data is being loaded.
 * @param groupId The group which members are to be exported.
 * @param groupName The group's name. This is used to generate the default file name of the generated file.
 */
const TariffChangeLetters = ({
  getTariffChangeLetters,
  groupId,
  groupName,
}) => {

  const loadExport = (groupId, groupName) => {
    getTariffChangeLetters(groupId, groupName);
  }

  return (
    <React.Fragment>
      <div className="controls">
        <Row className="fieldgroup">
          <Col xs={12} className="fieldname">
            <FormattedMessage id={`Lade die Preisanpassungsschreiben herunter bevor du sie versendest.`} />
          </Col>
        </Row>
        <Row className="fieldgroup">
          <Col className="fieldname">
            <button
              className="btn btn-primary"
              onClick={() => loadExport(groupId, groupName)}
            >
              <FormattedMessage id={`Load Zip`} />
            </button>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

type StatePart = {
  getTariffChangeLetters: Function;
  reports: ReportsState;
};

const mapStateToProps = (state: StatePart) => {
  return {
    getTariffChangeLetters: state.getTariffChangeLetters,
  };
};

export default connect(
  mapStateToProps,
  { getTariffChangeLetters: Groups.actions.getTariffChangeLetters },
)(injectIntl(TariffChangeLetters));
