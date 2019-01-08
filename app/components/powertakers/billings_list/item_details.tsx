import React from 'react';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
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
            value: `i18n!!! ${item.basePriceCents}`,
          }}
        />
      </Col>
      <Col xs={6}>
        <LabeledValue
          {...{
            label: <FormattedMessage id={`${prefix}.energyPriceCents`} />,
            value: `i18n!!! ${item.energyPriceCents}`,
          }}
        />
      </Col>
    </Row>
    Tariff:::::::
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
            value: `i18n!!! ${item.tariff.energypriceCentsPerKwh}`,
          }}
        />
      </Col>
      <Col xs={6}>
        <LabeledValue
          {...{
            label: <FormattedMessage id={`${tariffPrefix}.basepriceCentsPerMonth`} />,
            value: `i18n!!! ${item.tariff.basepriceCentsPerMonth}`,
          }}
        />
      </Col>
    </Row>
  </ItemDetailsWrapper>
);

export default ItemDetails;
