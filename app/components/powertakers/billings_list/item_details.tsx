import React from 'react';
import moment from 'moment';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Row, Col } from 'reactstrap';
import LabeledValue from 'components/labeled_value';
import { ItemDetailsWrapper } from './style';

const ItemDetails = ({ item, prefix = 'admin.billingItems', tariffPrefix = 'admin.tariffs' }) => (
  <ItemDetailsWrapper>
    <Row>
      <Col xs={6}>
        <LabeledValue
          {...{
            label: <FormattedMessage id={`${prefix}.beginDate`} />,
            value: moment(item.beginDate).format('DD.MM.YYYY'),
          }}
        />
      </Col>
      <Col xs={6}>
        <LabeledValue
          {...{
            label: <FormattedMessage id={`${prefix}.lastDate`} />,
            value: moment(item.lastDate).format('DD.MM.YYYY'),
          }}
        />
      </Col>
      <Col xs={6}>
        <LabeledValue
          {...{
            label: <FormattedMessage id={`${prefix}.beginReadingKwh`} />,
            value: item.beginReadingKwh,
          }}
        />
      </Col>
      <Col xs={6}>
        <LabeledValue
          {...{
            label: <FormattedMessage id={`${prefix}.endReadingKwh`} />,
            value: item.endReadingKwh,
          }}
        />
      </Col>
      <Col xs={6}>
        <LabeledValue
          {...{
            label: <FormattedMessage id={`${prefix}.consumedEnergyKwh`} />,
            value: item.consumedEnergyKwh,
          }}
        />
      </Col>
      <Col xs={6}>
        <LabeledValue
          {...{
            label: <FormattedMessage id={`${prefix}.basePriceCents`} />,
            value: <><FormattedNumber value={item.basePriceCents} style="decimal" maximumFractionDigits={1} /> ¢</>,
          }}
        />
      </Col>
      <Col xs={6}>
        <LabeledValue
          {...{
            label: <FormattedMessage id={`${prefix}.energyPriceCents`} />,
            value: <><FormattedNumber value={item.energyPriceCents} style="decimal" maximumFractionDigits={1} /> ¢</>,
          }}
        />
      </Col>
    </Row>
    <div className="tariff-header"><FormattedMessage id={`${prefix}.headerTariff`} />:</div>
    <Row>
      <Col xs={6}>
        <LabeledValue
          {...{
            label: <FormattedMessage id={`${tariffPrefix}.name`} />,
            value: item.tariff.name,
          }}
        />
      </Col>
      <Col xs={6}>
        <LabeledValue
          {...{
            label: <FormattedMessage id={`${tariffPrefix}.energypriceCentsPerKwh`} />,
            value: <><FormattedNumber value={item.tariff.energypriceCentsPerKwh} style="decimal" maximumFractionDigits={1} /> ¢</>,
          }}
        />
      </Col>
      <Col xs={6}>
        <LabeledValue
          {...{
            label: <FormattedMessage id={`${tariffPrefix}.basepriceCentsPerMonth`} />,
            value: <><FormattedNumber value={item.tariff.basepriceCentsPerMonth} style="decimal" maximumFractionDigits={1} /> ¢</>,
          }}
        />
      </Col>
    </Row>
  </ItemDetailsWrapper>
);

export default ItemDetails;
