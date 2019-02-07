import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, NavLink, Switch, Route } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row } from 'reactstrap';
import { confirmAlert } from 'react-confirm-alert';
import get from 'lodash/get';
import map from 'lodash/map';
import flattenDeep from 'lodash/flattenDeep';
import isEqual from 'lodash/isEqual';
import Groups from 'groups';
import Users from 'users';
import Organizations from 'organizations';
import { actions } from 'actions';
import { SubNav } from 'components/style';
import PageTitle from 'components/page_title';
import Group from './group';
import Powergiver from './powergiver';
import Bank from './bank';

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
      distributionSystemOperator,
      transmissionSystemOperator,
      electricitySupplier,
      bankAccount,

      owner,
      availableUsers,
      loadAvailableUsers,
      availableOrganizations,
      loadAvailableOrganizations,
      updateGroupContact,

      gap,
      gapAddress,
      gapBankAccounts,
      gapContact,
      gapContactAddress,
      gapContactBankAccounts,

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
              {!!owner.id && (
                <NavLink to={`${url}/bank`} exact className="nav-link">
                  <FormattedMessage id="admin.groups.navBank" />
                </NavLink>
              )}
              <NavLink to={`${url}/gapcontact`} exact className="nav-link">
                <FormattedMessage id="admin.groups.navGapContact" />
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
                      updateGroup,
                      group,
                      deleteGroup: this.deleteGroup,
                      address,
                      transmissionSystemOperator,
                      distributionSystemOperator,
                      validationRules,
                      initialValues: group,
                      electricitySupplier,
                    }}
                  />
                )}
              />
              <Route
                path={`${url}/powergiver`}
                render={() => (
                  <Powergiver
                    {...{
                      updatable: group.updatable,
                      owner,
                      loadAvailableUsers,
                      availableUsers,
                      availableOrganizations,
                      loadAvailableOrganizations,
                      validationRules,
                      updateGroupContact: params => updateGroupContact({ groupId: group.id, isGap: false, ...params }),
                      // HACK: nested objects can be null on server after beekeeper import in some cases
                      initialValues: ownerValues,
                      form: 'groupOwnerForm',
                    }}
                  />
                )}
              />
              {!!owner.id && <Route path={`${url}/bank`} render={() => <Bank {...{ bankAccount }} />} />}
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
                        validationRules,
                        updateGroupContact: params => updateGroupContact({ groupId: group.id, isGap: true, ...params }),
                        // HACK: nested objects can be null on server after beekeeper import in some cases
                        initialValues: gapValues,
                        isGap: true,
                        form: 'groupGapForm',
                      }}
                    />
                  </GapWrap>
                )}
              />
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
  distributionSystemOperator: state.groups.group.distributionSystemOperator || {},
  transmissionSystemOperator: state.groups.group.transmissionSystemOperator || {},
  electricitySupplier: state.groups.group.electricitySupplier || {},
  bankAccount: state.groups.group.bankAccount || {},

  owner: state.groups.group.owner || {},
  availableUsers: state.users.availableUsers,
  availableOrganizations: state.organizations.availableOrganizations,

  gap: state.groups.group.gapContractCustomer || {},
  gapAddress: get(state.groups.group, 'gapContractCustomer.address') || {},
  gapBankAccounts: get(state.groups.group, 'gapContractCustomer.bankAccounts.array') || [],
  gapContact: get(state.groups.group, 'gapContractCustomer.contact') || {},
  gapContactAddress: get(state.groups.group, 'gapContractCustomer.contact.address') || {},
  gapContactBankAccounts: get(state.groups.group, 'gapContractCustomer.contact.bankAccounts.array') || [],

  loading: state.groups.loadingGroup,

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
    setIncompleteScreen: actions.setIncompleteScreen,
    loadAvailableUsers: Users.actions.loadAvailableUsers,
    loadAvailableOrganizations: Organizations.actions.loadAvailableOrganizations,
  },
)(GroupSettingsIntl);
