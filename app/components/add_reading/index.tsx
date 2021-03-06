import React, { useState } from 'react';
import Alert from 'react-s-alert';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import Readings from 'readings';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import AddReadingForm from './form';
import { numberParse } from '_util';

interface Props {
  addReading: Function;
  groupId: string;
  meterId: string;
  registerId: string;
  getAutoReadingValue: Function;
  addReadingFormValues: any;
  edifactMeasurementMethod: string;
  addReadingFormName: string;
  readingsValidationRules: any;
  switchAddReading: Function;
  isOpen: boolean;
  cb?: () => void;
  billingItem?: {
    begin: boolean;
    contractId: string;
    billingId: string;
    billingItemId: string;
    updatedAt: string;
  };
  date?: string;
}

const AddReading = ({
  addReading,
  groupId,
  meterId,
  registerId,
  getAutoReadingValue,
  calculateReading,
  addReadingFormValues,
  edifactMeasurementMethod,
  addReadingFormName,
  readingsValidationRules,
  switchAddReading,
  isOpen,
  billingItem,
  date,
  cb,
  intl
}: Props & InjectedIntlProps) => {
  const defaultAddReading: any = { status: 'Z86', reason: 'PMR', readBy: 'SG', quality: '220', unit: 'Wh', source: 'MAN' };
  const [addReadingInit, setAddReadingInit] = useState(defaultAddReading);
  const handleAddReading = params => new Promise((resolve, reject) => {
    addReading({
      groupId,
      meterId,
      registerId,
      params: { 
        ...params, 
        rawValue: numberParse(intl.locale, params.rawValue.toString()) * 1000 
      },
      resolve,
      reject,
      billingItem,
    });
  }).then(() => {
    cb && cb();
  });
  const handleCalculateReading = () => {
    new Promise((resolve, reject) => {
      let params: {
        updated_at: string,
        begin_date?: string,
        end_date?: string,
      } = { updated_at: billingItem.updatedAt };

      if (billingItem.begin) {
        params.begin_date = addReadingFormValues.date
      } else {
        params.end_date = addReadingFormValues.date
      }
      calculateReading({
        groupId,
        contractId: billingItem.contractId,
        billingId: billingItem.billingId,
        billingItemId: billingItem.billingItemId,
        resolve,
        reject,
        params,
      });
    }).then((res: { _status: null | number; [key: string]: any }) => {
      if (res._status === 404) {
        Alert.warning('<h4>No reading for this date</h4>');
      } else if (res._status === 422) {
        Alert.error(`<h4>${Object.keys(res.errors).map(key => res.errors[key].join('<br>')).join('<br>')}</h4>`);
      } else if (res._status === 409) {
        Alert.error(`<h4>Conflict</h4>`);
      } else {
        let kwh = 0;
        if (billingItem.begin) {
          kwh = res.beginReadingKwh
        } else {
          kwh = res.endReadingKwh
        }
        setAddReadingInit({
          ...addReadingInit,
          unit: 'Wh',
          rawValue: kwh /1000,
        });
        
        cb && cb();

        location.reload();
      }
    });
  };

  const handleGetAutoReadingValue = () => {
    new Promise((resolve, reject) => {
      getAutoReadingValue({
        groupId,
        meterId,
        registerId,
        resolve,
        reject,
        params: { date: addReadingFormValues.date },
      });
    }).then((res: { _status: null | number; [key: string]: any }) => {
      if (res._status === 404) {
        Alert.warning('<h4>No reading for this date</h4>');
      } else if (res._status === 422) {
        Alert.warning(JSON.stringify(res));
      } else {
        const { _status, ...addReadingInit } = res;
        setAddReadingInit({
          ...addReadingInit,
          unit: 'Wh',
          rawValue: addReadingInit.rawValue / 1000,
        });
      }
    });
  };
  const initialValues = addReadingInit;
  if (date) initialValues.date = date;
  return (
    <AddReadingForm
      {...{
        toggle: switchAddReading,
        isOpen,
        validationRules: readingsValidationRules,
        form: addReadingFormName,
        initialValues: addReadingInit,
        addReadingFormValues,
        edifactMeasurementMethod,
        onSubmit: handleAddReading,
        getAutoReadingValue: handleGetAutoReadingValue,
        calculateReading: handleCalculateReading,
        hasBillingItem: !!billingItem
      }}
    />
  );
};

function mapStateToProps(state) {
  const addReadingFormName = 'addReading';
  return {
    readingsValidationRules: state.readings.validationRules,
    addReadingFormName,
    addReadingFormValues: getFormValues(addReadingFormName)(state) || {},
  };
}

export default connect(
  mapStateToProps,
  { 
    addReading: Readings.actions.addReading, 
    getAutoReadingValue: Readings.actions.getAutoReadingValue, 
    calculateReading: Readings.actions.calculateReading 
  }
)(injectIntl(AddReading));
