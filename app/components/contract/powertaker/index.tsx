import * as React from 'react';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { Link } from 'react-router-dom';
import { Row, Col, UncontrolledTooltip } from 'reactstrap';
import truncate from 'lodash/truncate';
import get from 'lodash/get';
import uniqBy from 'lodash/uniqBy';
import sortBy from 'lodash/sortBy';
import moment from 'moment';
import { reduxForm } from 'redux-form';
import Alert from 'react-s-alert';
import withEditOverlay from 'components/with_edit_overlay';
import FormPanel from 'components/form_panel';
import ContractStatus from 'components/contract_status';
import ContractType from 'components/contract_type';
import TwoColView from 'components/two_col_view';
import TwoColField from 'components/two_col_field';
import EditableInput from 'components/editable_input';
import EditableDate from 'components/editable_date';
import EditableCheckbox from 'components/editable_checkbox';
import EditableSelect from 'components/editable_select';
import { PlainList } from 'components/style';
import { dateNormalizer, numberNormalizer } from 'validation_normalizers';

import {
  ContractHeader,
  BigLink,
  BigSpan,
  LinkType,
  InnerRow,
  InnerBorderRow,
  BorderCol,
  StatusCol,
  TypeCol,
  LinkCol,
} from '../style';

interface Props {
  contract: { _status: null | number; [key: string]: any };
  prefix: string;
  registerMeta: any;
  contractor: any;
}

const PowertakerContract = ({
  contract,
  prefix,
  registerMeta,
  contractor,
  intl,
  updateContract,
  groupId,
  switchEditMode,
  handleSubmit,
  editMode,
  pristine,
  reset,
  submitting,
  validationRules,
}: Props & InjectedIntlProps) => {
  const submit = values =>
    new Promise((resolve, reject) => {
      // HACK: backend validation hack
      const {
        contractor,
        customer,
        customerBankAccount,
        documents,
        payments,
        tariffs,
        registerMeta,
        ...params
      } = values;
      params.registerMeta = {
        name: registerMeta.name,
        label: registerMeta.label,
        updatedAt: registerMeta.updatedAt,
      };
      if (!params.shareRegisterWithGroup) params.shareRegisterWithGroup = false;
      if (!params.shareRegisterPublicly) params.shareRegisterPublicly = false;
      if (!params.confirmPricingModel) params.confirmPricingModel = false;
      if (!params.powerOfAttorney) params.powerOfAttorney = false;
      if (!params.otherContract) params.otherContract = false;
      if (!params.moveIn) params.moveIn = false;
      if (!params.authorization) params.authorization = false;

      updateContract({
        groupId,
        contractId: contract.id,
        resolve,
        reject,
        params,
        updateType: 'contract',
      });
    })
      .then(() => {
        Alert.success('Saved!');
        switchEditMode();
      })
      .catch(e => {
        console.log('This is catch error \n', e);
      });

  const contractorName =
    contractor.type === 'person'
      ? `${contractor.firstName} ${contractor.lastName}`
      : contractor.name;
  const customerName =
    contract.customer.type === 'person'
      ? `${contract.customer.firstName} ${contract.customer.lastName}`
      : contract.customer.name;

  return (
    <div className="contract-data">
      <ContractHeader>
        <BorderCol xs="11">
          <InnerBorderRow>
            <LinkCol xs="6">
              <BigLink
                to={`/groups/${groupId}/powertakers/${contract.id}/powertaker`}
              >
                {truncate(customerName, { length: 25 })} &gt;
              </BigLink>
              <LinkType>
                <FormattedMessage id={`${prefix}.objectTypePowerTaker`} />
              </LinkType>
            </LinkCol>
            <LinkCol xs="6">
              <BigLink
                to={`/groups/${groupId}/market-locations/${registerMeta.id}`}
              >
                {truncate(registerMeta.name, { length: 25 })} &gt;
              </BigLink>
              <LinkType>
                <FormattedMessage id={`${prefix}.objectTypeMarketLocation`} />
              </LinkType>
            </LinkCol>
          </InnerBorderRow>
          <InnerRow>
            <LinkCol xs="6">
              <BigSpan>{truncate(contractorName, { length: 25 })}</BigSpan>
              <LinkType>
                <FormattedMessage id={`${prefix}.objectTypePowerGiver`} />
              </LinkType>
            </LinkCol>
            <Col xs="6" />
          </InnerRow>
        </BorderCol>
        <Col xs="1">
          <InnerRow>
            <StatusCol xs="12">
              <ContractStatus status={contract.status} size="large" />
            </StatusCol>
          </InnerRow>
          <InnerRow>
            <TypeCol xs="12">
              <ContractType type={contract.type} size="large" />
            </TypeCol>
          </InnerRow>
        </Col>
      </ContractHeader>
      <form onSubmit={handleSubmit(submit)} data-cy="powertaker contract form">
        <FormPanel
          {...{
            editMode,
            dirty: !pristine,
            onCancel: () => {
              reset();
              switchEditMode();
            },
            cancelDisabled: submitting,
            onSave: handleSubmit(submit),
            saveDisabled: pristine || submitting,
          }}
        >
          <Row>
            <Col xs="12">
              <h5 className="grey-underline mt-5 pb-2">
                <FormattedMessage id={`${prefix}.headerContractsDetails`} />
                {!editMode && contract.updatable && (
                  <i
                    data-cy="contract edit switch"
                    className="buzzn-pencil"
                    style={{ float: 'right' }}
                    onClick={switchEditMode}
                  />
                )}
              </h5>
              <TwoColView {...{ prefix, field: 'marketLocation' }}>
                <Link
                  to={`/groups/${groupId}/market-locations/${registerMeta.id}`}
                >
                  {registerMeta.name}
                </Link>
              </TwoColView>
              <TwoColView {...{ prefix, field: 'meterSerial' }}>
                {get(registerMeta, 'registers.array', []).length ? (
                  <PlainList>
                    {uniqBy(
                      get(registerMeta, 'registers.array', []),
                      'meterId',
                    ).map(r => (
                      <li key={r.meterId}>
                        <Link
                          to={`/groups/${groupId}/market-locations/meters/${
                            r.meterId
                          }`}
                        >
                          {r.meter.productSerialnumber}
                          {!!r.readings.array.length && (
                            <React.Fragment>
                              , Last reading:{' '}
                              {
                                sortBy(r.readings.array, reading =>
                                  moment(reading.date).toDate(),
                                ).reverse()[0].date
                              }
                            </React.Fragment>
                          )}
                        </Link>
                      </li>
                    ))}
                  </PlainList>
                ) : (
                  <React.Fragment>
                    <i
                      id="no-meter"
                      className="fa fa-warning"
                      style={{ color: 'red' }}
                    />
                    <UncontrolledTooltip target="no-meter">
                      No meter/register attached
                    </UncontrolledTooltip>
                  </React.Fragment>
                )}
              </TwoColView>
              <TwoColView {...{ prefix, field: 'renewableEnergyLawTaxation' }}>
                {contract.renewableEnergyLawTaxation
                  ? intl.formatMessage({
                      id: `${prefix}.${contract.renewableEnergyLawTaxation}`,
                    })
                  : ''}
              </TwoColView>
              <TwoColView {...{ prefix, field: 'customer' }}>
                <Link
                  to={`/groups/${groupId}/powertakers/${
                    contract.id
                  }/powertaker`}
                >
                  {contract.customer.name ||
                    `${contract.customer.firstName} ${
                      contract.customer.lastName
                    }`}
                </Link>
              </TwoColView>
              <TwoColView {...{ prefix, field: 'customerNumber' }}>
                {contract.customer.customerNumber}
              </TwoColView>
              <TwoColView {...{ prefix, field: 'contractor' }}>
                {contractor.name ||
                  `${contractor.firstName} ${contractor.lastName}`}
              </TwoColView>
              <TwoColField
                {...{
                  prefix,
                  name: 'forecastKwhPa',
                  editMode,
                  validationRules,
                  component: EditableInput,
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'originalSigningUser',
                  editMode,
                  validationRules,
                  component: EditableInput,
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'mandateReference',
                  editMode,
                  validationRules,
                  component: EditableInput,
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'confirmPricingModel',
                  editMode,
                  validationRules,
                  component: EditableCheckbox,
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'powerOfAttorney',
                  editMode,
                  validationRules,
                  component: EditableCheckbox,
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'otherContract',
                  editMode,
                  validationRules,
                  component: EditableCheckbox,
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'moveIn',
                  editMode,
                  validationRules,
                  component: EditableCheckbox,
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'authorization',
                  editMode,
                  validationRules,
                  component: EditableCheckbox,
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'creditorIdentification',
                  editMode,
                  validationRules,
                  component: EditableInput,
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'meteringPointOperatorName',
                  editMode,
                  validationRules,
                  component: EditableInput,
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'oldSupplierName',
                  editMode,
                  validationRules,
                  component: EditableInput,
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'oldCustomerNumber',
                  editMode,
                  validationRules,
                  component: EditableInput,
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'oldAccountNumber',
                  editMode,
                  validationRules,
                  component: EditableInput,
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'energyConsumptionBeforeKwhPa',
                  editMode,
                  validationRules,
                  component: EditableInput,
                  normalize: numberNormalizer,
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'thirdPartyBillingNumber',
                  editMode,
                  validationRules,
                  component: EditableInput,
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'thirdPartyRenterNumber',
                  editMode,
                  validationRules,
                  component: EditableInput,
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'shareRegisterWithGroup',
                  editMode,
                  validationRules,
                  component: EditableCheckbox,
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'shareRegisterPublicly',
                  editMode,
                  validationRules,
                  component: EditableCheckbox,
                }}
              />
              <TwoColField
                {...{
                  prefix: 'admin.register_metas',
                  name: 'registerMeta.name',
                  editMode,
                  validationRules,
                  component: EditableInput,
                }}
              />
              <TwoColField
                {...{
                  prefix: 'admin.register_metas',
                  name: 'registerMeta.label',
                  editMode,
                  validationRules,
                  component: EditableSelect,
                }}
              />
              <h5 className="grey-underline mt-5 pb-2">
                <FormattedMessage id={`${prefix}.headerDates`} />
              </h5>
              <TwoColView {...{ prefix, field: 'status' }}>
                <FormattedMessage id={`${prefix}.${contract.status}`} />
                <ContractStatus status={contract.status} size="large" />
              </TwoColView>
              <TwoColField
                {...{
                  prefix,
                  name: 'signingDate',
                  editMode,
                  validationRules,
                  component: EditableDate,
                  normalize: dateNormalizer('YYYY-MM-DD'),
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'beginDate',
                  editMode,
                  validationRules,
                  component: EditableDate,
                  normalize: dateNormalizer('YYYY-MM-DD'),
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'terminationDate',
                  editMode,
                  validationRules,
                  component: EditableDate,
                  normalize: dateNormalizer('YYYY-MM-DD'),
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'lastDate',
                  editMode,
                  validationRules,
                  component: EditableDate,
                  normalize: dateNormalizer('YYYY-MM-DD'),
                }}
              />
            </Col>
          </Row>
        </FormPanel>
      </form>
    </div>
  );
};

export default injectIntl(
  withEditOverlay(reduxForm({ form: 'LPTUpdateForm', enableReinitialize: true })(PowertakerContract))
);
