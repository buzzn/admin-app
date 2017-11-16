// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import type { MapStateToProps } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { intlShape } from 'react-intl';
import { Col, Row } from 'reactstrap';
import Groups from 'groups';
import type { GroupsState, GroupStats } from 'groups/reducers';
import LinkBack from 'components/link_back';

import './style.scss';

import DefaultImage from 'images/energygroup_noimage_01.jpg';

type Props = {
  group: Object,
  groupStats: Object | GroupStats,
  loading: boolean,
  loadGroup: Function,
  setGroup: Function,
  match: { url: string, params: { groupId: string } },
  intl: intlShape,
};

class GroupSettings extends React.Component<Props> {
  static defaultProps = {
    groupStats: {},
  };

  componentWillMount() {
    const { loadGroup, group, match: { params: { groupId } } } = this.props;
    if (group.id !== groupId) loadGroup(groupId);
  }

  render() {
    const { group, group: { address = {} }, groupStats, setGroup, intl } = this.props;

    if (group.status === 404 || group.status === 403) {
      setGroup({ _status: null });
      return <Redirect to="/localpools"/>;
    }

    const prefix = 'admin.groups';
    const addressPrefix = 'admin.addresses';

    return [
      <div key={ 1 } className="row center-content-header center-content-header-nomargin-bottom center-content-no-breadcrumbs">
        <Col xs="7">
          <LinkBack title={ intl.formatMessage({ id: `${prefix}.headerSettings` }) }/>
        </Col>
      </div>,
      <div className="center-content group-settings" key={ 2 }>
        <div className="group-image">
          <img src={ DefaultImage }/>
        </div>
        <Row>
          <Col xs="6">
            <p className="h5 grey-underline header"><FormattedMessage id={ `${prefix}.headerGroup` }/></p>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.name` }/></Col>
              <Col xs="8" className="grey-underline">{ group.name }</Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.energySources` }/></Col>
              <Col xs="8" className="grey-underline">
                <span>
                  { groupStats.fire && <i className="fa fa-fire" style={{ marginRight: '4px' }} /> }
                  { groupStats.solar && <i className="fa fa-sun-o" /> }
                </span>
              </Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.startDate` }/></Col>
              <Col xs="8" className="grey-underline">{ group.startDate }</Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname"><FormattedMessage id={ `${addressPrefix}.address` }/></Col>
              <Col xs="8" className="grey-underline">{ address.street }</Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname"></Col>
              <Col xs="2" className="grey-underline">{ address.zip }</Col>
              <Col xs="6" className="grey-underline">{ address.city }</Col>
            </Row>
            <Row className="fieldgroup">
              <Col xs="4" className="fieldname"></Col>
              <Col xs="8" className="grey-underline"></Col>
            </Row>
          </Col>
          <Col xs="6"></Col>
        </Row>
      </div>,
    ];
  }
}

export const GroupSettingsIntl = injectIntl(GroupSettings);

const mapStateToProps: MapStateToProps<{ groups: GroupsState }, *, *> = (state, props) => ({
  groupStats: state.groups.groupsStats[props.match.params.groupId] || {},
  group: state.groups.group,
  loading: state.groups.loadingGroup,
});

export default connect(mapStateToProps, {
  loadGroup: Groups.actions.loadGroup,
  setGroup: Groups.actions.setGroup,
})(GroupSettingsIntl);
