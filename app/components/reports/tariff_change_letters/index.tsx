import React, { useState } from 'react';
import { connect } from 'react-redux';
import Groups from 'reports';
import { FormattedMessage, injectIntl } from 'react-intl';
import Loading from 'components/loading';
import { ReportsState } from 'reports';
import { Row, Col } from 'reactstrap';

/**
 * A widget to request all the group's tariff change letters.
 * @param getTariffChangeLetters A method which triggers the export of the group's tariff change letters.
 * @param sendTariffChangeLettersEmails A method which triggers the sending of the group's tariff change letters via email.
 * @param groupId The group which tariff change letters are to be exported.
 * @param groupName The group's name. 
 */
const TariffChangeLetters = ({
  getTariffChangeLetters,
  sendTariffChangeLettersEmails,
  groupId,
  groupName,
}) => {

  const loadExport = (groupId, groupName) => {
    getTariffChangeLetters(groupId, groupName);
  }

  const sendLetters = (groupId) => {
    sendTariffChangeLettersEmails(groupId);
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
          <Col className="fieldname">
            <button
              className="btn btn-primary"
              onClick={() => sendLetters(groupId)}
            >
              <FormattedMessage id={`Send E-Mails`} />
            </button>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

type StatePart = {
  getTariffChangeLetters: Function;
  sendTariffChangeLettersEmails: Function;
  reports: ReportsState;
};

const mapStateToProps = (state: StatePart) => {
  return {
    getTariffChangeLetters: state.getTariffChangeLetters,
    sendTariffChangeLettersEmails: state.sendTariffChangeLettersEmails,
  };
};

export default connect(
  mapStateToProps,
  { getTariffChangeLetters: Groups.actions.getTariffChangeLetters,
    sendTariffChangeLettersEmails: Groups.actions.sendTariffChangeLettersEmails },
)(injectIntl(TariffChangeLetters));
