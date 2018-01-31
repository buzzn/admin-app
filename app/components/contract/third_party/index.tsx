import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import truncate from 'lodash/truncate';
import moment from 'moment';
import ContractStatus from 'components/contract_status';
import TwoColView from 'components/two_col_view';
import { ContractHeader, BigLink, BigSpan, LinkType, InnerRow, BorderCol, StatusCol, LinkCol } from '../style';

interface Props {
  url: string;
  contract: { _status: null | number; [key: string]: any };
  prefix: string;
  register: any;
  contractor: any;
}

const ThirdPartyContract = ({ url, contract, prefix, register, contractor }: Props) => (
  <div className="contract-data">
    <ContractHeader>
      <BorderCol xs="11">
        <InnerRow>
          <LinkCol xs="6">
            <BigSpan>
              {truncate(contractor.name || `${contractor.firstName} ${contractor.lastName}`, { length: 25 })}
            </BigSpan>
            <LinkType>
              <FormattedMessage id={`${prefix}.objectTypePowerTaker`} />
            </LinkType>
          </LinkCol>
          <LinkCol xs="6">
            <BigLink
              to={`${url
                .split('/')
                .slice(0, -1)
                .join('/')}/system/${register.meterId}/registers/${register.id}/readings`}
            >
              {truncate(register.name, { length: 25 })} >
            </BigLink>
            <LinkType>
              <FormattedMessage id={`${prefix}.objectTypePowerRegister`} />
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
    <Row>
      <Col xs="12">
        <h5 className="grey-underline mt-5 pb-2">
          <FormattedMessage id={`${prefix}.headerContractsDetails`} />
        </h5>
        <TwoColView {...{ prefix, field: 'registerName' }}>
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
        <h5 className="grey-underline mt-5 pb-2">
          <FormattedMessage id={`${prefix}.headerDates`} />
        </h5>
        <TwoColView {...{ prefix, field: 'beginDate' }}>{moment(contract.beginDate).format('DD.MM.YYYY')}</TwoColView>
        <TwoColView {...{ prefix, field: 'endDate' }}>{moment(contract.endDate).format('DD.MM.YYYY')}</TwoColView>
      </Col>
    </Row>
  </div>
);

export default ThirdPartyContract;
