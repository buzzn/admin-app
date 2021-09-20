import React, { useState } from 'react';
import { connect } from 'react-redux';
import Groups from 'reports';
import { FormattedMessage, injectIntl } from 'react-intl';
import Loading from 'components/loading';
import { ReportsState } from 'reports';
import { Row, Col } from 'reactstrap';
import Alert from 'react-s-alert';

/**
 * A widget to request all the group's tariff change letters.
 * @param getTariffChangeLetters A method which triggers the export of the group's tariff change letters.
 * @param sendTariffChangeLettersEmails A method which triggers the sending of the group's tariff change letters via email.
 * @param groupId The group which tariff change letters are to be exported.
 * @param groupName The group's name. 
 */
const HistoricalReadingsExport = ({
  getHistoricalReadingsExportId,
  getHistoricalReadingsExport,
  groupId,
  groupName,
}) => {
  const loadExport = async () => {
    new Promise((resolve, reject) => {
      getHistoricalReadingsExportId({
        groupId: groupId,
        groupName: groupName,
        resolve,
        reject,
      });
    }).then((id) => {
      // this.setState({ hackLoading: true });
      const now = Date.now();
      const timeout = 1000 * 180; // 3 minutes
      const checkEvery = 3000;
      const loopReportRequest = async () => {
        if (timeout + now < Date.now()) {
          //this.setState({ hackLoading: false });
          Alert.error('Could not be generated during Timeout of 3 minutes.');
          return;
        }
        
        try {
          (new Promise((resolve, reject) => {
            getHistoricalReadingsExport({
              groupId: groupId,
              groupName: groupName,
              reportId: id,
              resolve,
              reject,
            });
          })).then(() => {
            //this.setState({ hackLoading: false });
            Alert.success('Report was successfully generated.');
          }).catch((e) => {
            setTimeout(() => loopReportRequest(), checkEvery);
          });
          
        } catch (e) {
          setTimeout(() => loopReportRequest(), checkEvery);
        }
      };
      loopReportRequest();
    });
  }
  
  return (
    <React.Fragment>
      <div className="controls">
        <Row className="fieldgroup">
          <Col xs={12} className="fieldname">
            <FormattedMessage id={`Zählerliste herunterladen`} />
          </Col>
        </Row>
        <Row className="fieldgroup">
          <Col className="fieldname">
            <button
              className="btn btn-primary"
              onClick={() => loadExport()}
            >
              <FormattedMessage id={`Download`} />
            </button>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};


type StatePart = {
  getHistoricalReadingsExportId: Function;
  getHistoricalReadingsExport: Function;
  reports: ReportsState;
};

const mapStateToProps = (state: StatePart) => {
  return {
    //getHistoricalReadingsExportId: state.getHistoricalReadingsExportId,
    //getHistoricalReadingsExport: state.getHistoricalReadingsExport,
  };
};

export default connect(
  mapStateToProps,
  { getHistoricalReadingsExportId: Groups.actions.getHistoricalReadingsExportId,
    getHistoricalReadingsExport: Groups.actions.getHistoricalReadingsExport },
)(injectIntl(HistoricalReadingsExport));
