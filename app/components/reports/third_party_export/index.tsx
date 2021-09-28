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
 * @param getThirdPartyExportId A method which triggers the generating of the group's third party export.
 * @param getThirdPartyExport A method which triggers the returning of the group's third party export.
 * @param groupId The group which third party export to be exported.
 * @param groupName The group's name. 
 */
const ThirdPartyExport = ({
  getThirdPartyExportId,
  getThirdPartyExport,
  groupId,
  groupName,
}) => {
  const loadExport = async () => {
    new Promise((resolve, reject) => {
      getThirdPartyExportId({
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
            getThirdPartyExport({
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
            <FormattedMessage id={`Liste der Drittbelieferten herunterladen`} />
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
  getThirdPartyExportId: Function;
  getThirdPartyExport: Function;
  reports: ReportsState;
};

const mapStateToProps = (state: StatePart) => {
  return {
    //getThirdPartyExportId: state.getThirdPartyExportId,
    //getThirdPartyExport: state.getThirdPartyExport,
  };
};

export default connect(
  mapStateToProps,
  { getThirdPartyExportId: Groups.actions.getThirdPartyExportId,
    getThirdPartyExport: Groups.actions.getThirdPartyExport },
)(injectIntl(ThirdPartyExport));
