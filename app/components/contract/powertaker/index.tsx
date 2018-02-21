import * as React from 'react';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import truncate from 'lodash/truncate';
import moment from 'moment';
import { formatLabel } from '_util';
import ContractStatus from 'components/contract_status';
import ContractType from 'components/contract_type';
import TwoColView from 'components/two_col_view';
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
  url: string;
  contract: { _status: null | number; [key: string]: any };
  prefix: string;
  register: any;
  contractor: any;
}

const PowertakerContract = ({ url, contract, prefix, register, contractor, intl }: Props & InjectedIntlProps) => (
  <div className="contract-data">
    <ContractHeader>
      <BorderCol xs="11">
        <InnerBorderRow>
          <LinkCol xs="6">
            <BigLink to={`${url}/${contract.id}/powertaker`}>
              {truncate(contract.customer.name || `${contract.customer.firstName} ${contract.customer.lastName}`, { length: 25 })}{' '}
              >
            </BigLink>
            <LinkType>
              <FormattedMessage id={`${prefix}.objectTypePowerTaker`} />
            </LinkType>
          </LinkCol>
          <LinkCol xs="6">
            <BigLink
              to={`${url
                .split('/')
                .slice(0, -1)
                .join('/')}/system/registers/${register.id}/readings`}
            >
              {truncate(register.name, { length: 25 })} >
            </BigLink>
            <LinkType>
              <FormattedMessage id={`${prefix}.objectTypeMarketLocation`} />
            </LinkType>
          </LinkCol>
        </InnerBorderRow>
        <InnerRow>
          <LinkCol xs="6">
            <BigSpan>
              {truncate(contractor.name || `${contractor.firstName} ${contractor.lastName}`, { length: 25 })}
            </BigSpan>
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
    <Row>
      <Col xs="12">
        <h5 className="grey-underline mt-5 pb-2">
          <FormattedMessage id={`${prefix}.headerContractsDetails`} />
        </h5>
        <TwoColView {...{ prefix, field: 'marketLocation' }}>
          <Link
            to={`${url
              .split('/')
              .slice(0, -1)
              .join('/')}/system/${register.meterId}/registers/${register.id}/readings`}
          >
            {register.name}
          </Link>
        </TwoColView>
        <TwoColView {...{ prefix, field: 'meterSerial' }}>
          <Link
            to={`${url
              .split('/')
              .slice(0, -1)
              .join('/')}/system/${register.meterId}`}
          >
            {register.meter.productSerialnumber}
          </Link>
        </TwoColView>
        <TwoColView {...{ prefix, field: 'renewableEnergyLawTaxation' }}>
          {contract.renewableEnergyLawTaxation
            ? intl.formatMessage({ id: `${prefix}.${contract.renewableEnergyLawTaxation}` })
            : ''}
        </TwoColView>
        <TwoColView {...{ prefix, field: 'customer' }}>
          <Link to={`${url}/${contract.id}/powertaker`}>
            {contract.customer.name || `${contract.customer.firstName} ${contract.customer.lastName}`}
          </Link>
        </TwoColView>
        <TwoColView {...{ prefix, field: 'customerNumber' }}>{contract.customer.customerNumber}</TwoColView>
        <TwoColView {...{ prefix, field: 'contractor' }}>
          {contractor.name || `${contractor.firstName} ${contractor.lastName}`}
        </TwoColView>
        <TwoColView {...{ prefix, field: 'forecastKwhPa' }}>{formatLabel(contract.forecastKwhPa, 'h')}</TwoColView>
        <TwoColView {...{ prefix, field: 'oldSupplierName' }}>{contract.oldSupplierName}</TwoColView>
        <TwoColView {...{ prefix, field: 'oldCustomerNumber' }}>{contract.oldCustomerNumber}</TwoColView>
        <TwoColView {...{ prefix, field: 'oldAccountNumber' }}>{contract.oldAccountNumber}</TwoColView>
        <TwoColView {...{ prefix, field: 'thirdPartyRenterNumber' }}>{contract.thirdPartyRenterNumber}</TwoColView>
        <TwoColView {...{ prefix, field: 'thirdPartyBillingNumber' }}>{contract.thirdPartyBillingNumber}</TwoColView>
        <h5 className="grey-underline mt-5 pb-2">
          <FormattedMessage id={`${prefix}.headerDates`} />
        </h5>
        <TwoColView {...{ prefix, field: 'status' }}>
          <FormattedMessage id={`${prefix}.${contract.status}`} />
          <ContractStatus status={contract.status} size="large" />
        </TwoColView>
        <TwoColView {...{ prefix, field: 'signingDate' }}>
          {moment(contract.signingDate).format('DD.MM.YYYY')}
        </TwoColView>
        <TwoColView {...{ prefix, field: 'beginDate' }}>{moment(contract.beginDate).format('DD.MM.YYYY')}</TwoColView>
        <TwoColView {...{ prefix, field: 'terminationDate' }}>
          {moment(contract.terminationDate).format('DD.MM.YYYY')}
        </TwoColView>
        <TwoColView {...{ prefix, field: 'lastDate' }}>{contract.lastDate ? moment(contract.lastDate).format('DD.MM.YYYY') : ''}</TwoColView>
      </Col>
    </Row>
  </div>
);

export default injectIntl(PowertakerContract);
