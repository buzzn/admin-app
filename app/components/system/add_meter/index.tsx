import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getFormValues } from 'redux-form';

import Meters from 'meters';
import MarketLocations from 'market_locations';
import AddMeterForm from './form';

const AddMeter = ({
  // @ts-ignore
  history,
  groupId,
  url,
  addRealMeter,
  loadMarketLocations,
  marketLocations,
  loading,
  form,
  formValues,
  createMeterValidationRules,
  initMeter = {},
  cb,
}: ExtProps & StateProps & DispatchProps) => {
  const [initialMeter, setInitialMeter] = useState({});
  useEffect(() => {
    setInitialMeter(initMeter);
  }, [initMeter]);
  useEffect(() => {
    if (!marketLocations._status && !marketLocations.array.length) loadMarketLocations(groupId);
  }, [marketLocations, groupId]);
  const submitForm = (values, selectedRegisters) => {
    const params = JSON.parse(JSON.stringify(values));
    params.registers.forEach((r, i) => {
      if (selectedRegisters[i] && selectedRegisters[i].value) params.registers[i] = { id: selectedRegisters[i].value };
      if (r && r.emptyRegister) params.registers[i] = {};
    });

    return new Promise((resolve, reject) => {
      addRealMeter({
        groupId,
        params,
        resolve,
        reject,
      });
    }).then(() => {
      cb && cb();
      history.push(url);
    });
  };

  return (
    <AddMeterForm
      {...{
        history,
        url,
        onSubmit: submitForm,
        initialValues: initialMeter,
        loading,
        form,
        formValues,
        validationRules: createMeterValidationRules,
        marketLocations,
      }}
    />
  );
};

interface ExtProps {
  groupId: string;
  url: string;
  initMeter?: any;
  cb?: Function;
}

interface StatePart {
  marketLocations: {
    loadingMarketLocations: boolean;
    marketLocations: { _status: null | number; array: Array<any> };
  };
  meters: {
    validationRules: {
      realCreate: any;
    };
  };
}

interface StateProps {
  form: string;
  formValues: any;
  marketLocations: { _status: null | number; array: Array<any> };
  loading: boolean;
  createMeterValidationRules: any;
}

interface DispatchProps {
  loadMarketLocations: Function;
  addRealMeter: Function;
}

function mapStateToProps(state: StatePart) {
  const form = 'addMeter';
  return {
    form,
    formValues: getFormValues(form)(state),
    marketLocations: state.marketLocations.marketLocations,
    loading: state.marketLocations.loadingMarketLocations,
    createMeterValidationRules: state.meters.validationRules.realCreate,
  };
}

export default withRouter(
  // @ts-ignore
  connect<StateProps, DispatchProps, ExtProps>(
    mapStateToProps,
    {
      loadMarketLocations: MarketLocations.actions.loadMarketLocations,
      addRealMeter: Meters.actions.addRealMeter,
    },
  )(AddMeter),
);
