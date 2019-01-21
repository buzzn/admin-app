import React, { useContext, useState } from 'react';
import moment from 'moment';
import get from 'lodash/get';
import Alert from 'react-s-alert';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import LabeledValue from 'components/labeled_value';
import AddReading from 'components/add_reading';
import { ItemDetailsWrapper, ItemErrors, ReadingAction } from './style';

const ItemDetails = ({ item, prefix = 'admin.billingItems', tariffPrefix = 'admin.tariffs', ManageReadingContext }) => {
  const { attachReading, groupId, contractId, billingId } = useContext(ManageReadingContext);
  const [isOpen, switchAddReading] = useState(false);
  const [date, setDate] = useState({});
  const checkReading = (date, begin) => {
    const reading = get(item, 'register.readings.array', []).find(r => r.date === date);
    if (reading) {
      return (
        <ReadingAction
          onClick={() => handleAttachReading({ [begin ? 'beginReadingId' : 'endReadingId']: reading.id, updatedAt: item.updatedAt })
          }
        >
          Attach reading
        </ReadingAction>
      );
    }
    return (
      <ReadingAction
        onClick={() => {
          setDate({ begin, date });
          switchAddReading(true);
        }}
      >
        Add reading
      </ReadingAction>
    );
  };
  const handleAttachReading = params => new Promise((resolve, reject) => {
    attachReading({
      params,
      resolve,
      reject,
      groupId,
      contractId,
      billingId,
      billingItemId: item.id,
    });
  })
    .then(() => Alert.success('Attached'))
    .catch(err => Alert.error(JSON.stringify(err)));

  return (
    <ItemDetailsWrapper className="cy-item-details">
      {!!item.incompleteness && (
        <Row>
          <Col xs={12}>
            <ItemErrors>
              {Object.keys(item.incompleteness).reduce(
                (err, key) => `${err ? `${err}, ` : ''}${key}: ${item.incompleteness[key].join(', ')}`,
                '',
              )}
            </ItemErrors>
          </Col>
        </Row>
      )}
      <Row>
        <Col xs={6}>
          <LabeledValue
            {...{
              label: <FormattedMessage id={`${prefix}.beginDate`} />,
              value: moment(item.beginDate).format('DD.MM.YYYY'),
              valueClassName: 'cy-item-begin-date',
            }}
          />
        </Col>
        <Col xs={6}>
          <LabeledValue
            {...{
              label: <FormattedMessage id={`${prefix}.lastDate`} />,
              value: moment(item.lastDate).format('DD.MM.YYYY'),
              valueClassName: 'cy-item-last-date',
            }}
          />
        </Col>
        <Col xs={6}>
          <LabeledValue
            {...{
              label: <FormattedMessage id={`${prefix}.beginReadingKwh`} />,
              value: item.beginReadingKwh || checkReading(item.beginDate, true),
            }}
          />
        </Col>
        <Col xs={6}>
          <LabeledValue
            {...{
              label: <FormattedMessage id={`${prefix}.endReadingKwh`} />,
              value: item.endReadingKwh || checkReading(item.lastDate, false),
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
              value: item.basePriceCents ? (
                <React.Fragment>
                  <FormattedNumber value={item.basePriceCents} style="decimal" maximumFractionDigits={1} /> ¢
                </React.Fragment>
              ) : (
                ''
              ),
            }}
          />
        </Col>
        <Col xs={6}>
          <LabeledValue
            {...{
              label: <FormattedMessage id={`${prefix}.energyPriceCents`} />,
              value: item.energyPriceCents ? (
                <React.Fragment>
                  <FormattedNumber value={item.energyPriceCents} style="decimal" maximumFractionDigits={1} /> ¢
                </React.Fragment>
              ) : (
                ''
              ),
            }}
          />
        </Col>
      </Row>
      <div className="sub-header">
        <FormattedMessage id={`${prefix}.headerTariff`} />:
      </div>
      <Row>
        <Col xs={6}>
          <LabeledValue
            {...{
              label: <FormattedMessage id={`${tariffPrefix}.name`} />,
              value: item.tariff.name,
              valueClassName: 'cy-item-tariff-name',
            }}
          />
        </Col>
        <Col xs={6}>
          <LabeledValue
            {...{
              label: <FormattedMessage id={`${tariffPrefix}.energypriceCentsPerKwh`} />,
              value: item.tariff.energypriceCentsPerKwh ? (
                <React.Fragment>
                  <FormattedNumber
                    value={item.tariff.energypriceCentsPerKwh}
                    style="decimal"
                    maximumFractionDigits={1}
                  />{' '}
                  ¢
                </React.Fragment>
              ) : (
                ''
              ),
            }}
          />
        </Col>
        <Col xs={6}>
          <LabeledValue
            {...{
              label: <FormattedMessage id={`${tariffPrefix}.basepriceCentsPerMonth`} />,
              value: item.tariff.basepriceCentsPerMonth ? (
                <React.Fragment>
                  <FormattedNumber
                    value={item.tariff.basepriceCentsPerMonth}
                    style="decimal"
                    maximumFractionDigits={1}
                  />{' '}
                  ¢
                </React.Fragment>
              ) : (
                ''
              ),
            }}
          />
        </Col>
      </Row>
      <div className="sub-header">Meter info:</div>
      <Row>
        <Col xs={6}>
          <LabeledValue
            {...{
              label: 'Meter id',
              value: <Link to={`/groups/${groupId}/market-locations/meters/${item.meter.id}`}>{item.meter.id}</Link>,
            }}
          />
        </Col>
        <Col xs={6}>
          <LabeledValue
            {...{
              label: 'Meter serial',
              value: (
                <Link to={`/groups/${groupId}/market-locations/meters/${item.meter.id}`}>
                  {item.meter.productSerialnumber}
                </Link>
              ),
            }}
          />
        </Col>
      </Row>
      <div className="sub-header">Register info:</div>
      <Row>
        <Col xs={6}>
          <LabeledValue
            {...{
              label: 'Register id',
              value: (
                <Link to={`/groups/${groupId}/market-locations/registers/${item.register.id}`}>{item.register.id}</Link>
              ),
            }}
          />
        </Col>
        <Col xs={6}>
          <LabeledValue
            {...{
              label: 'Register obis',
              value: (
                <Link to={`/groups/${groupId}/market-locations/registers/${item.register.id}`}>
                  {item.register.obis}
                </Link>
              ),
            }}
          />
        </Col>
      </Row>
      {isOpen && (
        <AddReading
          {...{
            edifactMeasurementMethod: item.meter.edifactMeasurementMethod,
            isOpen,
            switchAddReading,
            groupId,
            meterId: item.meter.id,
            registerId: item.register.id,
            date: date['date'],
            billingItem: {
              begin: date['begin'],
              contractId,
              billingId,
              billingItemId: item.id,
              updatedAt: item.updatedAt,
            },
          }}
        />
      )}
    </ItemDetailsWrapper>
  );
};

export default ItemDetails;
