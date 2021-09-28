import React, { useEffect } from 'react';
import { SubNav } from 'components/style';
import { NavLink, Redirect, Route, Switch } from 'react-router-dom';
import { Row } from 'reactstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import PageTitle from 'components/page_title';
import { connect } from 'react-redux';
import Groups from 'groups';
import ReportsUI from './eeg';
import AnnualReport from './annual';
import GroupMembersExport from '../reports/group_members_export';
import HistoricalReadingsExport from '../reports/historical_readings_export';
import ThirdPartyExport from '../reports/third_party_export';
import TariffChangeLetters from '../reports/tariff_change_letters';

/**
 * Provides ui to generate various reports about the group and an export of its members.
 * @param groupId The id of the group which the report is about.
 * @return A component which lets the user decide which report to create.
 */
const Reports = ({
  group,
  loadGroup,
  intl,
  match: {
    url,
    params: { groupId },
  }
}) => {
  const prefix = 'admin.reports';

  useEffect(() => {
    loadGroup(groupId);
  }, []);

  const breadcrumbs = [
    {
      id: 0, link: '/groups',
      title: intl.formatMessage({ id: `admin.groups.breadcrumbsMyLocalpools` })
    },
    { id: group.id || 1, title: group.name }
  ];

  return (
    <React.Fragment>
      <PageTitle {...{ breadcrumbs, title: intl.formatMessage({ id: `${prefix}.header` }), thin: 'true' }} />
      <Row>
        <SubNav>
          <NavLink to={`${url}/eeg`} exact className="nav-link">
            <FormattedMessage id={`${prefix}.tabs.eeg`} />
          </NavLink>
          <NavLink to={`${url}/annual`} exact className="nav-link">
            <FormattedMessage id={`${prefix}.tabs.annual`} />
          </NavLink>
          <NavLink to={`${url}/group-members-export`} exact className="nav-link">
            <FormattedMessage id={`${prefix}.tabs.groupsMembersExport`} />
          </NavLink>
          <NavLink to={`${url}/historical-readings-export`} exact className="nav-link">
            <FormattedMessage id={`Meter Report`} />
          </NavLink>
          <NavLink to={`${url}/third_party_export`} exact className="nav-link">
            <FormattedMessage id={`Third Party Export`} />
          </NavLink>
          <NavLink to={`${url}/tariff-change-letters`} exact className="nav-link">
            <FormattedMessage id={`Tariff change letters`} />
          </NavLink>
        </SubNav>
      </Row>
      <Row>
        <Switch>
          <Route
            path={`${url}/eeg`}
            // @ts-ignore
            render={() => <ReportsUI {...{ groupId: groupId }} />}
          />
          <Route
            path={`${url}/annual`}
            render={() => <AnnualReport {...{ groupId, groupName: group.name }} />}
          />
          <Route path={`${url}/group-members-export`}
            render={() => <GroupMembersExport {...{ groupId: group.id, groupName: group.name }} />}
          />
          <Route path={`${url}/historical-readings-export`}
            render={() => <HistoricalReadingsExport {...{ groupId: group.id, groupName: group.name }} />}
          />
          <Route path={`${url}/third_party_export`}
            render={() => <ThirdPartyExport {...{ groupId: group.id, groupName: group.name }} />}
          />
          <Route path={`${url}/tariff-change-letters`}
            render={() => <TariffChangeLetters {...{ groupId: group.id, groupName: group.name }} />}
          />
          <Redirect to={`${url}/eeg`} />
        </Switch>
      </Row>
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  group: state.groups.group
});

export default connect(
  mapStateToProps,
  { loadGroup: Groups.actions.loadGroup, },
)(injectIntl(Reports));

