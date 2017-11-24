// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import type { MapStateToProps } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { intlShape } from 'react-intl';
import { reduxForm, Field } from 'redux-form';
import type { FormProps } from 'redux-form';
import { Col, Row } from 'reactstrap';
import moment from 'moment';
import pick from 'lodash/pick';
import get from 'lodash/get';
import Groups from 'groups';
import type { GroupsState } from 'groups/reducers';
import LinkBack from 'components/link_back';
import Breadcrumbs from 'components/breadcrumbs';
import FieldToggle from 'components/field_toggle';
import Owner from './owner';

import './style.scss';

import DefaultImage from 'images/energygroup_noimage_01.jpg';

type Props = {
  group: Object,
  address: Object,
  distributionSystemOperator: Object,
  transmissionSystemOperator: Object,
  electricitySupplier: Object,
  bankAccount: Object,
  owner: Object,
  ownerAddress: Object,
  ownerBankAccounts: Array<Object>,
  ownerContact: Object,
  ownerContactAddress: Object,
  ownerContactBankAccounts: Array<Object>,
  loading: boolean,
  loadGroup: Function,
  setGroup: Function,
  updateGroup: Function,
  match: { url: string, params: { groupId: string } },
  intl: intlShape,
} & FormProps;

class GroupSettings extends React.Component<Props> {
  componentWillMount() {
    const { loadGroup, group, match: { params: { groupId } } } = this.props;
    if (group.id !== groupId) loadGroup(groupId);
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
      setGroup,
      updateGroup,
      handleSubmit,
      intl,
    } = this.props;

    if (group.status === 404 || group.status === 403) {
      setGroup({ _status: null });
      return <Redirect to="/localpools"/>;
    }

    const prefix = 'admin.groups';
    const addressPrefix = 'admin.addresses';

    const breadcrumbs = [
      { id: 0, link: '/localpools', title: intl.formatMessage({ id: `${prefix}.breadcrumbsMyLocalpools` }) },
      { id: group.id || 1, title: group.name },
    ];

    const submit = (values) => {
      const changed = Object.keys(values).reduce((sum, key) => {
        if (values[key] !== group[key]) {
          return { ...sum, [key]: values[key] };
        } else {
          return sum;
        }
      }, { updatedAt: values.updatedAt });
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

    return [
      <div key={ 1 } className="row center-content-header center-content-header-nomargin-bottom">
        <Col xs="7">
          <Breadcrumbs breadcrumbs={ breadcrumbs }/>
          <LinkBack title={ intl.formatMessage({ id: `${prefix}.headerSettings` }) }/>
        </Col>
      </div>,
      <div className="center-content group-settings" key={ 2 }>
        <div className="group-image">
          <img src={ DefaultImage }/>
        </div>
        <form
          onSubmit={ submitForm }
          onBlur={ (event) => { if (event.target.type !== 'checkbox') setTimeout(submitForm); } }
          onChange={ (event) => { if (event.target.type === 'checkbox') setTimeout(submitForm); } }>
          <Row>
            <Col xs="6">
              <p className="h5 grey-underline header text-uppercase"><FormattedMessage id={ `${prefix}.headerGroup` }/></p>
              <Row className="fieldgroup">
                <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.name` }/></Col>
                <Col xs="8" className="grey-underline">{ group.name }</Col>
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
                <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.startDate` }/></Col>
                <Col xs="8" className="grey-underline">{ group.startDate ? moment(group.startDate).format('DD.MM.YYYY') : '' }</Col>
              </Row>
              <Row className="fieldgroup">
                <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.transmissionSystemOperator` }/></Col>
                <Col xs="8" className="grey-underline">{ transmissionSystemOperator.name }</Col>
              </Row>
              <Row className="fieldgroup">
                <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.distributionSystemOperator` }/></Col>
                <Col xs="8" className="grey-underline">{ distributionSystemOperator.name }</Col>
              </Row>
              <Row className="fieldgroup">
                <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.electricitySupplier` }/></Col>
                <Col xs="8" className="grey-underline">{ electricitySupplier.name }</Col>
              </Row>
              <Row className="fieldgroup">
                <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.visibility` }/></Col>
                <Col xs="8" className="grey-underline">
                  <FormattedMessage id={ `${prefix}.showObject` }/>
                  <Field className="float-right" name="showObject" component={ FieldToggle } submitForm={ submitForm }/>
                </Col>
              </Row>
              <Row className="fieldgroup">
                <Col xs="4" className="fieldname"></Col>
                <Col xs="8" className="grey-underline">
                  <FormattedMessage id={ `${prefix}.showProduction` }/>
                  <Field className="float-right" name="showProduction" component={ FieldToggle } submitForm={ submitForm }/>
                </Col>
              </Row>
              <Row className="fieldgroup">
                <Col xs="4" className="fieldname"></Col>
                <Col xs="8" className="grey-underline">
                  <FormattedMessage id={ `${prefix}.showEnergy` }/>
                  <Field className="float-right" name="showEnergy" component={ FieldToggle } submitForm={ submitForm }/>
                </Col>
              </Row>
              <Row className="fieldgroup">
                <Col xs="4" className="fieldname"></Col>
                <Col xs="8" className="grey-underline">
                  <FormattedMessage id={ `${prefix}.showContact` }/>
                  <Field className="float-right" name="showContact" component={ FieldToggle } submitForm={ submitForm }/>
                </Col>
              </Row>
            </Col>
            <Col xs="6">
              <p className="h5 grey-underline header text-uppercase"><FormattedMessage id={ `${prefix}.headerPowergiver` }/></p>
              {
                owner.type === 'person' ?
                  <Owner {...{ address: ownerAddress, owner }}/> :
                  [
                    <Owner key={ 1 } {...{ address: ownerAddress, owner }}/>,
                    <Owner key={ 2 } {...{ contact: true, address: ownerContactAddress, owner: ownerContact }}/>,
                  ]
              }
              <Row className="fieldgroup">
                <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.customerNumber` }/></Col>
                <Col xs="8" className="grey-underline">{ owner.customerNumber }</Col>
              </Row>
              <Row className="fieldgroup">
                <Col xs="4" className="fieldname"><FormattedMessage id={ `${prefix}.bankAccount` }/></Col>
                <Col xs="8" className="grey-underline">{ bankAccount.holder }</Col>
              </Row>
              <Row className="fieldgroup">
                <Col xs="4" className="fieldname"></Col>
                <Col xs="8" className="grey-underline">{ bankAccount.bankName }</Col>
              </Row>
              <Row className="fieldgroup">
                <Col xs="4" className="fieldname"></Col>
                <Col xs="8" className="grey-underline">{ bankAccount.iban }</Col>
              </Row>
            </Col>
          </Row>
        </form>
      </div>,
    ];
  }
}

export const GroupSettingsForm = reduxForm({
  form: 'groupUpdateForm',
  enableReinitialize: true,
})(injectIntl(GroupSettings));

const mapStateToProps: MapStateToProps<{ groups: GroupsState }, *, *> = (state) => ({
  group: state.groups.group,
  initialValues: pick(state.groups.group, ['showObject', 'showProduction', 'showEnergy', 'showContact', 'updatedAt']),
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
  loading: state.groups.loadingGroup,
});

export default connect(mapStateToProps, {
  loadGroup: Groups.actions.loadGroup,
  setGroup: Groups.actions.setGroup,
  updateGroup: Groups.actions.updateGroup,
})(GroupSettingsForm);
