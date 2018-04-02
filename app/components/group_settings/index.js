import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { intlShape } from 'react-intl';
import { reduxForm, Field } from 'redux-form';
import { Col, Row } from 'reactstrap';
import moment from 'moment';
import pick from 'lodash/pick';
import get from 'lodash/get';
import map from 'lodash/map';
import isEqual from 'lodash/isEqual';
import Groups from 'groups';
import { actions } from 'actions';
import PageTitle from 'components/page_title';
import FieldToggle from 'components/field_toggle';
import Owner from './owner';

import './style.scss';

import DefaultImage from 'images/energygroup_noimage_01.jpg';

class GroupSettings extends React.Component {
  setIncompletness(group) {
    const { setIncompleteScreen } = this.props;
    if (group.incompleteness && Object.keys(group.incompleteness).length) {
      setIncompleteScreen(map(group.incompleteness, (v, k) => ({ title: `admin.groups.${k}`, errors: v })));
    }
  }

  componentDidMount() {
    const { loadGroup, group, match: { params: { groupId } } } = this.props;
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

      gap,
      gapAddress,
      gapBankAccounts,
      gapContact,
      gapContactAddress,
      gapContactBankAccounts,

      setGroup,
      updateGroup,
      handleSubmit,
      intl,
    } = this.props;

    if (group._status === 404 || group._status === 403) {
      setGroup({ _status: null });
      return <Redirect to="/groups" />;
    }

    const prefix = 'admin.groups';
    const addressPrefix = 'admin.addresses';

    const breadcrumbs = [
      { id: 0, link: '/groups', title: intl.formatMessage({ id: `${prefix}.breadcrumbsMyLocalpools` }) },
      { id: group.id || 1, title: group.name },
    ];

    const submit = (values) => {
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

    const submitForm = handleSubmit(submit);

    return (
      <React.Fragment>
        <PageTitle {...{ breadcrumbs, title: intl.formatMessage({ id: `${prefix}.headerSettings` }), thin: 'true' }} />
        <div className="center-content group-settings">
          <div className="group-image">
            <img src={DefaultImage} />
          </div>
          <form
            onSubmit={() => setTimeout(submitForm)}
            onBlur={(event) => {
              if (event.target.type !== 'checkbox') setTimeout(submitForm);
            }}
            onChange={(event) => {
              if (event.target.type === 'checkbox') setTimeout(submitForm);
            }}
          >
            <Row>
              <Col xs="6">
                <p className="h5 grey-underline header text-uppercase">
                  <FormattedMessage id={`${prefix}.headerGroup`} />
                </p>
                <Row className="fieldgroup">
                  <Col xs="4" className="fieldname">
                    <FormattedMessage id={`${prefix}.name`} />
                  </Col>
                  <Col xs="8" className="grey-underline fieldvalue">
                    {group.name}
                  </Col>
                </Row>
                <Row className="fieldgroup">
                  <Col xs="4" className="fieldname">
                    <FormattedMessage id={`${addressPrefix}.address`} />
                  </Col>
                  <Col xs="8" className="grey-underline fieldvalue">
                    {address.street}
                  </Col>
                </Row>
                <Row className="fieldgroup">
                  <Col xs="4" className="fieldname" />
                  <Col xs="2" className="grey-underline fieldvalue">
                    {address.zip}
                  </Col>
                  <Col xs="6" className="grey-underline fieldvalue">
                    {address.city}
                  </Col>
                </Row>
                <Row className="fieldgroup">
                  <Col xs="4" className="fieldname">
                    <FormattedMessage id={`${prefix}.startDate`} />
                  </Col>
                  <Col xs="8" className="grey-underline fieldvalue">
                    {group.startDate ? moment(group.startDate).format('DD.MM.YYYY') : ''}
                  </Col>
                </Row>
                <Row className="fieldgroup">
                  <Col xs="4" className="fieldname">
                    <FormattedMessage id={`${prefix}.transmissionSystemOperator`} />
                  </Col>
                  <Col xs="8" className="grey-underline fieldvalue">
                    {transmissionSystemOperator.name}
                  </Col>
                </Row>
                <Row className="fieldgroup">
                  <Col xs="4" className="fieldname">
                    <FormattedMessage id={`${prefix}.distributionSystemOperator`} />
                  </Col>
                  <Col xs="8" className="grey-underline fieldvalue">
                    {distributionSystemOperator.name}
                  </Col>
                </Row>
                <Row className="fieldgroup">
                  <Col xs="4" className="fieldname">
                    <FormattedMessage id={`${prefix}.electricitySupplier`} />
                  </Col>
                  <Col xs="8" className="grey-underline fieldvalue">
                    {electricitySupplier.name}
                  </Col>
                </Row>
                <Row className="fieldgroup">
                  <Col xs="4" className="fieldname">
                    <FormattedMessage id={`${prefix}.visibility`} />
                  </Col>
                  <Col xs="8" className="grey-underline fieldvalue">
                    <FormattedMessage id={`${prefix}.showObject`} />
                    <Field className="float-right" name="showObject" component={FieldToggle} submitForm={submitForm} />
                  </Col>
                </Row>
                <Row className="fieldgroup">
                  <Col xs="4" className="fieldname" />
                  <Col xs="8" className="grey-underline fieldvalue">
                    <FormattedMessage id={`${prefix}.showProduction`} />
                    <Field
                      className="float-right"
                      name="showProduction"
                      component={FieldToggle}
                      submitForm={submitForm}
                    />
                  </Col>
                </Row>
                <Row className="fieldgroup">
                  <Col xs="4" className="fieldname" />
                  <Col xs="8" className="grey-underline fieldvalue">
                    <FormattedMessage id={`${prefix}.showEnergy`} />
                    <Field className="float-right" name="showEnergy" component={FieldToggle} submitForm={submitForm} />
                  </Col>
                </Row>
                <Row className="fieldgroup">
                  <Col xs="4" className="fieldname" />
                  <Col xs="8" className="grey-underline fieldvalue">
                    <FormattedMessage id={`${prefix}.showContact`} />
                    <Field className="float-right" name="showContact" component={FieldToggle} submitForm={submitForm} />
                  </Col>
                </Row>
                <Row className="fieldgroup">
                  <Col xs="4" className="fieldname" />
                  <Col xs="8" className="grey-underline fieldvalue">
                    <FormattedMessage id={`${prefix}.showDisplayApp`} />
                    <Field
                      className="float-right"
                      name="showDisplayApp"
                      component={FieldToggle}
                      submitForm={submitForm}
                    />
                  </Col>
                </Row>
                {group.showDisplayApp && (
                  <Row className="fieldgroup">
                    <Col xs="4" className="fieldname" />
                    <Col xs="8" className="grey-underline fieldvalue">
                      <a href={group.displayAppUrl} target="_blank">
                        <span style={{ textDecoration: 'underline' }}>{group.slug}</span>&nbsp;&nbsp;&nbsp;<i className="fa fa-s fa-external-link" />
                      </a>
                    </Col>
                  </Row>
                )}
              </Col>
              <Col xs="6">
                <p className="h5 grey-underline header text-uppercase">
                  <FormattedMessage id={`${prefix}.headerPowergiver`} />
                </p>
                {owner.type === 'person' ? (
                  <Owner {...{ address: ownerAddress, owner }} />
                ) : (
                  <React.Fragment>
                    <Owner {...{ address: ownerAddress, owner }} />
                    {!!ownerContact.id && (
                      <Owner {...{ contact: true, address: ownerContactAddress, owner: ownerContact }} />
                    )}
                  </React.Fragment>
                )}
                <Row className="fieldgroup">
                  <Col xs="4" className="fieldname">
                    <FormattedMessage id={`${prefix}.customerNumber`} />
                  </Col>
                  <Col xs="8" className="grey-underline fieldvalue">
                    {owner.customerNumber}
                  </Col>
                </Row>
                <Row className="fieldgroup">
                  <Col xs="4" className="fieldname">
                    <FormattedMessage id={`${prefix}.bankAccount`} />
                  </Col>
                  <Col xs="8" className="grey-underline fieldvalue">
                    {bankAccount.holder}
                  </Col>
                </Row>
                <Row className="fieldgroup">
                  <Col xs="4" className="fieldname" />
                  <Col xs="8" className="grey-underline fieldvalue">
                    {bankAccount.bankName}
                  </Col>
                </Row>
                <Row className="fieldgroup">
                  <Col xs="4" className="fieldname" />
                  <Col xs="8" className="grey-underline fieldvalue">
                    {bankAccount.iban}
                  </Col>
                </Row>
                {!!gap.id && (
                  <React.Fragment>
                    <p className="h5 grey-underline header text-uppercase mt-4">
                      <FormattedMessage id={`${prefix}.headerGapCustomer`} />
                    </p>
                    {gap.type === 'person' ? (
                      <Owner {...{ address: gapAddress, owner: gap }} />
                    ) : (
                      <React.Fragment>
                        <Owner {...{ address: gapAddress, owner: gap }} />
                        {!!gapContact.id && (
                          <Owner {...{ contact: true, address: gapContactAddress, owner: gapContact }} />
                        )}
                      </React.Fragment>
                    )}
                  </React.Fragment>
                )}
              </Col>
            </Row>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export const GroupSettingsForm = reduxForm({
  form: 'groupUpdateForm',
  enableReinitialize: true,
})(injectIntl(GroupSettings));

const mapStateToProps = state => ({
  group: state.groups.group,
  initialValues: pick(state.groups.group, [
    'showObject',
    'showProduction',
    'showEnergy',
    'showContact',
    'showDisplayApp',
    'updatedAt',
  ]),
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

  gap: state.groups.group.gapContractCustomer || {},
  gapAddress: get(state.groups.group, 'gapContractCustomer.address') || {},
  gapBankAccounts: get(state.groups.group, 'gapContractCustomer.bankAccounts.array') || [],
  gapContact: get(state.groups.group, 'gapContractCustomer.contact') || {},
  gapContactAddress: get(state.groups.group, 'gapContractCustomer.contact.address') || {},
  gapContactBankAccounts: get(state.groups.group, 'gapContractCustomer.contact.bankAccounts.array') || [],

  loading: state.groups.loadingGroup,
});

export default connect(mapStateToProps, {
  loadGroup: Groups.actions.loadGroup,
  setGroup: Groups.actions.setGroup,
  updateGroup: Groups.actions.updateGroup,
  setIncompleteScreen: actions.setIncompleteScreen,
})(GroupSettingsForm);
