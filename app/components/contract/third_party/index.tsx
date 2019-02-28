import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
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
import TwoColView from 'components/two_col_view';
import TwoColField from 'components/two_col_field';
import EditableInput from 'components/editable_input';
import EditableDate from 'components/editable_date';
import EditableSelect from 'components/editable_select';
import { dateNormalizer } from 'validation_normalizers';
import { PlainList } from 'components/style';
import { ContractHeader, BigLink, BigSpan, LinkType, InnerRow, BorderCol, StatusCol, LinkCol } from '../style';

interface Props {
  groupId: string;
  contract: { _status: null | number; [key: string]: any };
  prefix: string;
  registerMeta: any;
  updateContract: Function;
  switchEditMode: () => void;
  handleSubmit: Function;
  editMode: boolean;
  pristine: boolean;
  reset: Function;
  submitting: boolean;
  validationRules: any;
}

const ThirdPartyContract = ({
  contract,
  prefix,
  registerMeta,
  groupId,
  updateContract,
  switchEditMode,
  handleSubmit,
  editMode,
  pristine,
  reset,
  submitting,
  validationRules,
}: Props) => {
  const submit = values => new Promise((resolve, reject) => {
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
    params.registerMeta = { name: registerMeta.name, label: registerMeta.label, updatedAt: registerMeta.updatedAt };
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
  }).then(() => {
    Alert.success('Saved!');
    switchEditMode();
  });
  return (
    <div className="contract-data">
      <ContractHeader>
        <BorderCol xs="11">
          <InnerRow>
            <LinkCol xs="6">
              <BigSpan>
                <FormattedMessage id={`${prefix}.thirdPartyContractor`} />
              </BigSpan>
              <LinkType>
                <FormattedMessage id={`${prefix}.objectTypePowerGiver`} />
              </LinkType>
            </LinkCol>
            <LinkCol xs="6">
              <BigLink to={`/groups/${groupId}/market-locations/${registerMeta.id}`}>
                {truncate(registerMeta.name, { length: 25 })} >
              </BigLink>
              <LinkType>
                <FormattedMessage id={`${prefix}.objectTypeMarketLocation`} />
              </LinkType>
            </LinkCol>
          </InnerRow>
        </BorderCol>
        <Col xs="1">
          <InnerRow>
            <StatusCol xs="12">
              <ContractStatus status={contract.status} size="large" />
            </StatusCol>
          </InnerRow>
        </Col>
      </ContractHeader>
      <form onSubmit={handleSubmit(submit)} data-cy="third party contract form">
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
                <Link to={`/groups/${groupId}/market-locations/${registerMeta.id}`}>{registerMeta.name}</Link>
              </TwoColView>
              <TwoColView {...{ prefix, field: 'meterSerial' }}>
                <PlainList>
                  {uniqBy(get(registerMeta, 'registers.array', []), 'meterId').map(r => (
                    <li key={r.meterId}>
                      <Link to={`/groups/${groupId}/market-locations/meters/${r.meterId}`}>
                        {r.meter.productSerialnumber}
                        {!!r.readings.array.length && (
                          <React.Fragment>
                            , Last reading:{' '}
                            {sortBy(r.readings.array, reading => moment(reading.date).toDate()).reverse()[0].date}
                          </React.Fragment>
                        )}
                      </Link>
                    </li>
                  ))}
                </PlainList>
              </TwoColView>
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

export default withEditOverlay(reduxForm({ form: 'LPThirdUpdateForm', enableReinitialize: true })(ThirdPartyContract));

