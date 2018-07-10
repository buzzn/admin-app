import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, NavLink, Switch, Route } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { intlShape } from 'react-intl';
import { Col, Row } from 'reactstrap';
import { confirmAlert } from 'react-confirm-alert';
import pick from 'lodash/pick';
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
import GapContact from './gap_contact';

import './style.scss';

import DefaultImage from 'images/energygroup_noimage_01.jpg';

class GroupSettings extends React.Component {
  setIncompletness(group) {
    const { setIncompleteScreen } = this.props;
    const flattenErrors = ({ prefix = 'admin.groups', errObj }) =>
      flattenDeep(map(errObj, (v, k) => {
        if (Array.isArray(v)) return { title: `${prefix}.${k}`, errors: v };
        return flattenErrors({ prefix: `${prefix}.${k}`, errObj: v });
      }));

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
      message: `${intl.formatMessage({ id: 'admin.messages.confirmDeleteGroup' })} ${name}?`,
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
      ownerAddress,
      ownerBankAccounts,
      ownerContact,
      ownerContactAddress,
      ownerContactBankAccounts,
      availableUsers,
      loadAvailableUsers,
      availableOrganizations,
      loadAvailableOrganizations,
      updateOwner,

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

    const submitGroup = (values) => {
      const changed = Object.keys(values).reduce(
        (sum, key) => {
          if (values[key] !== group[key]) {
            return { ...sum, [key]: values[key] };
          }
          return sum;
        },
        { updatedAt: values.updatedAt },
      );
      return new Promise((resolve, reject) => {
        updateGroup({
          groupId: group.id,
          params: changed,
          resolve,
          reject,
        });
      });
    };

    return (
      <React.Fragment>
        <PageTitle {...{ breadcrumbs, title: intl.formatMessage({ id: `${prefix}.headerSettings` }), thin: 'true' }} />
        <div className="center-content group-settings">
          <div className="group-image">
            <img src={DefaultImage} />
          </div>
          <Row>
            <SubNav>
              <NavLink to={`${url}/group`} exact className="nav-link">
                <FormattedMessage id="admin.groups.navGroupSettings" />
              </NavLink>
              <NavLink to={`${url}/powergiver`} exact className="nav-link">
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
                      submitGroup,
                      group,
                      deleteGroup: this.deleteGroup,
                      address,
                      transmissionSystemOperator,
                      distributionSystemOperator,
                      initialValues: pick(group, [
                        'showObject',
                        'showProduction',
                        'showEnergy',
                        'showContact',
                        'showDisplayApp',
                        'updatedAt',
                      ]),
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
                      ownerAddress,
                      ownerContact,
                      ownerContactAddress,
                      loadAvailableUsers,
                      availableUsers,
                      availableOrganizations,
                      loadAvailableOrganizations,
                      validationRules,
                      updateOwner: params => updateOwner({ groupId: group.id, ...params }),
                      initialValues: {
                        ...owner,
                        address: { ...ownerAddress },
                        contact: { ...ownerContact, address: { ...ownerContactAddress } },
                      },
                    }}
                  />
                )}
              />
              {!!owner.id && <Route path={`${url}/bank`} render={() => <Bank {...{ bankAccount }} />} />}
              <Route
                path={`${url}/gapcontact`}
                render={() => <GapContact {...{ gap, gapAddress, gapContact, gapContactAddress }} />}
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
  ownerAddress: get(state.groups.group, 'owner.address') || {},
  ownerBankAccounts: get(state.groups.group, 'owner.bankAccounts.array') || [],
  ownerContact: get(state.groups.group, 'owner.contact') || {},
  ownerContactAddress: get(state.groups.group, 'owner.contact.address') || {},
  ownerContactBankAccounts: get(state.groups.group, 'owner.contact.bankAccounts.array') || [],
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

export default connect(mapStateToProps, {
  loadGroup: Groups.actions.loadGroup,
  setGroup: Groups.actions.setGroup,
  updateGroup: Groups.actions.updateGroup,
  deleteGroup: Groups.actions.deleteGroup,
  updateOwner: Groups.actions.updateOwner,
  setIncompleteScreen: actions.setIncompleteScreen,
  loadAvailableUsers: Users.actions.loadAvailableUsers,
  loadAvailableOrganizations: Organizations.actions.loadAvailableOrganizations,
})(GroupSettingsIntl);
