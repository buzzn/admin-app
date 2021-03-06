import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, NavLink, Switch, Route } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'reactstrap';
import { confirmAlert } from 'react-confirm-alert';
import get from 'lodash/get';
import map from 'lodash/map';
import flattenDeep from 'lodash/flattenDeep';
import isEqual from 'lodash/isEqual';
import Groups from 'groups';
import Users from 'users';
import Organizations from 'organizations';
import Contracts from 'contracts';
import { actions } from 'actions';
import { SubNav } from 'components/style';
import PageTitle from 'components/page_title';
import BankAccounts from 'components/bank_accounts';
import BankAccount from 'components/powertakers/payments/bank_account';
import Comments from 'components/comments';
import Group from './group';
import Powergiver from './powergiver';
import FakeStats from './fake_stats';

import './style.scss';

import DefaultImage from 'images/energygroup_noimage_01.jpg';

const GapWrap = props => <React.Fragment>{props.children}</React.Fragment>;

class GroupSettings extends React.Component {
  setIncompletness(group) {
    const { setIncompleteScreen } = this.props;
    const flattenErrors = ({ prefix = 'admin.groups', errObj }) => flattenDeep(
      map(errObj, (v, k) => {
        if (Array.isArray(v)) return { title: `${prefix}.${k}`, errors: v };
        return flattenErrors({ prefix: `${prefix}.${k}`, errObj: v });
      }),
    );

    if (group.incompleteness && Object.keys(group.incompleteness).length) {
      setIncompleteScreen(flattenErrors({ errObj: group.incompleteness }));
    }
  }

  componentDidMount() {
    const {
      loadGroup,
      group,
      readingsResponse,
      match: { params: { groupId } },
    } = this.props;
    loadGroup(groupId);
    this.setIncompletness(group);
  }

  componentWillUnmount() {
    this.props.setIncompleteScreen([]);
    this.props.setGroup({ _status: null });
  }

  componentDidUpdate(prevProps) {
    const { group: newGroup } = this.props;
    const { group } = prevProps;
    if (!isEqual(group.incompleteness, newGroup.incompleteness)) this.setIncompletness(newGroup);
  }

  deleteGroup = () => {
    const {
      group: { id: groupId, name },
      deleteGroup,
      history: { push },
      intl,
    } = this.props;

    confirmAlert({
      message: intl.formatMessage({ id: 'admin.groups.confirmDeleteGroup' }, { name }),
      buttons: [
        {
          label: intl.formatMessage({ id: 'admin.buttons.delete' }),
          onClick: () => {
            deleteGroup({ groupId });
            push('/');
          },
        },
        {
          label: intl.formatMessage({ id: 'admin.buttons.cancel' }),
          onClick: () => false,
        },
      ],
    });
  };

  render() {
    const {
      group,
      address,
      bankAccount,
      loadGroup,

      owner,
      availableUsers,
      loadAvailableUsers,
      availableOrganizations,
      availableOrganizationMarkets,
      loadAvailableOrganizations,
      loadAvailableOrganizationMarkets,
      loadingOptions,
      updateGroupContact,

      deleteGapContact,

      gap,
      attachBankAccount,
      loadContract,

      addReadings,
      readingsResponse,
      getAnnualReadingsTable,

      setGroup,
      updateGroup,
      intl,

      validationRules,

      match: { url },
    } = this.props;

    if (group._status === 404 || group._status === 403) {
      setGroup({ _status: null });
      return <Redirect to="/groups" />;
    }

    const prefix = 'admin.groups';

    const breadcrumbs = [
      { id: 0, link: '/groups', title: intl.formatMessage({ id: `${prefix}.breadcrumbsMyLocalpools` }) },
      { id: group.id || 1, title: group.name },
    ];

    // HACK: there was inconsistent data in the past
    const ownerValues = { ...owner };
    if (!ownerValues.address) ownerValues.address = {};
    if (!ownerValues.contact) ownerValues.contact = { address: {} };
    if (ownerValues.contact && !ownerValues.contact.address) ownerValues.contact.address = {};
    if (!ownerValues.legalRepresentation) ownerValues.legalRepresentation = { address: {} };
    if (ownerValues.legalRepresentation && !ownerValues.legalRepresentation.address) ownerValues.legalRepresentation.address = {};
    if (ownerValues.additionalLegalRepresentation) ownerValues.additionalLegalRepresentation = ownerValues.additionalLegalRepresentation.split('$#$');

    const gapValues = { ...gap };
    if (!gapValues.address) gapValues.address = {};
    if (!gapValues.contact) gapValues.contact = { address: {} };
    if (gapValues.contact && !gapValues.contact.address) gapValues.contact.address = {};
    if (!gapValues.legalRepresentation) gapValues.legalRepresentation = { address: {} };
    if (gapValues.legalRepresentation && !gapValues.legalRepresentation.address) gapValues.legalRepresentation.address = {};
    if (gapValues.additionalLegalRepresentation) gapValues.additionalLegalRepresentation = gapValues.additionalLegalRepresentation.split('$#$');

    return (
      <React.Fragment>
        <PageTitle {...{ breadcrumbs, title: intl.formatMessage({ id: `${prefix}.headerSettings` }), thin: 'true' }} />
        <div className="center-content group-settings">
          <div className="group-image">
            <img src={DefaultImage} />
          </div>
          <Row>
            <SubNav>
              <NavLink to={`${url}/group`} exact className="nav-link" data-cy="group settings tab">
                <FormattedMessage id="admin.groups.navGroupSettings" />
              </NavLink>
              <NavLink to={`${url}/powergiver`} exact className="nav-link" data-cy="group owner tab">
                <FormattedMessage id="admin.groups.navPowergiver" />
              </NavLink>
              <NavLink to={`${url}/gapcontact`} exact className="nav-link">
                <FormattedMessage id="admin.groups.navGapContact" />
              </NavLink>
              <NavLink to={`${url}/fake-stats`} exact className="nav-link">
                <FormattedMessage id="admin.groups.navFakeStats" />
              </NavLink>
              <NavLink to={`${url}/comments`} exact className="nav-link">
                <FormattedMessage id="admin.groups.navComments" />
              </NavLink>
            </SubNav>
          </Row>
          <Row>
            <Switch>
              <Route
                path={`${url}/group`}
                render={() => (
                  <Group
                    {...{
                      addReadings,
                      updateGroup,
                      group,
                      deleteGroup: this.deleteGroup,
                      address,
                      validationRules,
                      initialValues: group,
                      loadAvailableOrganizationMarkets,
                      availableOrganizationMarkets,
                      loadingOptions,
                      loadGroup,
                    }}
                  />
                )}
              />
              <Route
                path={`${url}/powergiver`}
                render={() => (
                  <React.Fragment>
                    <Powergiver
                      {...{
                        groupId: group.id,
                        updatable: group.updatable,
                        owner,
                        loadAvailableUsers,
                        availableUsers,
                        availableOrganizations,
                        loadAvailableOrganizations,
                        loadingOptions,
                        validationRules,
                        updateGroupContact: params => updateGroupContact({ groupId: group.id, isGap: false, ...params }),
                        // HACK: nested objects can be null on server after beekeeper import in some cases
                        initialValues: ownerValues,
                        form: 'groupOwnerForm',
                      }}
                    />
                    {!!owner.id && (
                      <Col xs={12}>
                        <BankAccounts
                          {...{
                            bankAccounts: get(owner, 'bankAccounts.array', []),
                            groupId: group.id,
                            partyId: owner.id,
                            partyType: owner.type,
                            reloadCb: () => loadGroup(group.id),
                          }}
                        />
                      </Col>
                    )}
                  </React.Fragment>
                )}
              />
              <Route
                path={`${url}/gapcontact`}
                render={() => (
                  <GapWrap>
                    <Powergiver
                      {...{
                        updatable: group.updatable,
                        owner: gap,
                        loadAvailableUsers,
                        availableUsers,
                        availableOrganizations,
                        loadAvailableOrganizations,
                        loadingOptions,
                        validationRules,
                        updateGroupContact: params => updateGroupContact({ groupId: group.id, isGap: true, ...params }),
                        deleteGapContact: () => deleteGapContact({ groupId: group.id }),
                        // HACK: nested objects can be null on server after beekeeper import in some cases
                        initialValues: gapValues,
                        isGap: true,
                        form: 'groupGapForm',
                      }}
                    />
                    {!!gap.id && (
                      <React.Fragment>
                        <Col xs={12}>
                          <BankAccounts
                            {...{
                              bankAccounts: get(gap, 'bankAccounts.array', []),
                              groupId: group.id,
                              partyId: gap.id,
                              partyType: gap.type,
                              reloadCb: () => loadGroup(group.id),
                            }}
                          />
                        </Col>
                        <Col xs={12}>
                          <BankAccount
                            {...{
                              title: 'GCC bank account',
                              bankAccount: group.gapContractCustomerBankAccount || {},
                              bankAccounts: get(gap, 'bankAccounts.array', []),
                              attachBankAccount,
                              groupId: group.id,
                              reloadCb: () => loadGroup(group.id),
                              updatedAt: group.updatedAt,
                              // HACK
                              contractId: '',
                              partyType: '',
                            }}
                          />
                        </Col>
                      </React.Fragment>
                    )}
                  </GapWrap>
                )}
              />
              <Route path={`${url}/fake-stats`}>
                <FakeStats {...{ group, updateGroup, addReadings, readingsResponse, getAnnualReadingsTable }} />
              </Route>
              <Route path={`${url}/comments`}>
                <Comments {...{ ids: { type: 'group', groupId: group.id } }} />
              </Route>
              <Route path={url}>
                <Redirect to={`${url}/group`} />
              </Route>
            </Switch>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export const GroupSettingsIntl = injectIntl(GroupSettings);

const mapStateToProps = state => ({
  group: state.groups.group,
  address: state.groups.group.address || {},
  bankAccount: state.groups.group.bankAccount || {},

  owner: state.groups.group.owner || {},
  availableUsers: state.users.availableUsers,
  availableOrganizations: state.organizations.availableOrganizations,

  availableOrganizationMarkets: state.organizations.availableOrganizationMarkets,

  gap: state.groups.group.gapContractCustomer || {},
  readingsResponse: state.groups.readingsResponse,
  loading: state.groups.loadingGroup || state.groups.loadingReadingsResult,
  loadingOptions:
    state.users.loadingAvailableUsers
    || state.organizations.loadingAvailableOrganizations
    || state.organizations.loadingAvailableOrganizationMarkets,

  validationRules: state.groups.validationRules,
});

export default connect(
  mapStateToProps,
  {
    loadGroup: Groups.actions.loadGroup,
    setGroup: Groups.actions.setGroup,
    updateGroup: Groups.actions.updateGroup,
    deleteGroup: Groups.actions.deleteGroup,
    updateGroupContact: Groups.actions.updateGroupContact,
    deleteGapContact: Groups.actions.deleteGapContact,
    setIncompleteScreen: actions.setIncompleteScreen,
    loadAvailableUsers: Users.actions.loadAvailableUsers,
    loadAvailableOrganizations: Organizations.actions.loadAvailableOrganizations,
    loadAvailableOrganizationMarkets: Organizations.actions.loadAvailableOrganizationMarkets,
    attachBankAccount: Contracts.actions.attachBankAccount,
    loadContract: Contracts.actions.loadContract,
    addReadings: Groups.actions.addReadings,
    getAnnualReadingsTable: Groups.actions.getAnnualReadingsTable,
  },
)(GroupSettingsIntl);
