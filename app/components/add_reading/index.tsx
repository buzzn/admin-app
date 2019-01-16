import React, { useState } from 'react';
import Alert from 'react-s-alert';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import Readings from 'readings';
import AddReadingForm from './form';

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
  addReadingFormValues,
  edifactMeasurementMethod,
  addReadingFormName,
  readingsValidationRules,
  switchAddReading,
  isOpen,
  billingItem,
  date,
}: Props) => {
  const defaultAddReading: any = { status: 'Z86', reason: 'PMR', readBy: 'SG', quality: '220', unit: 'Wh' };
  const [addReadingInit, setAddReadingInit] = useState(defaultAddReading);
  const handleAddReading = params => new Promise((resolve, reject) => {
    addReading({
      groupId,
      meterId,
      registerId,
      params: { ...params, value: params.value * 1000, rawValue: params.rawValue * 1000 },
      resolve,
      reject,
      billingItem,
    });
  }).then(() => {
    switchAddReading();
  });
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
          value: addReadingInit.value / 1000,
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
  { addReading: Readings.actions.addReading, getAutoReadingValue: Readings.actions.getAutoReadingValue },
)(AddReading);
