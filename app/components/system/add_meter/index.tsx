import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
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
  createMeterValidationRules,
  initMeter = {},
  cb,
}: ExtProps & StateProps & DispatchProps) => {
  const [initialMeter, setInitialMeter] = useState({});
  useEffect(
    () => {
      setInitialMeter(initMeter);
    },
    [initMeter],
  );
  useEffect(
    () => {
      if (!marketLocations._status && !marketLocations.array.length) loadMarketLocations(groupId);
    },
    [marketLocations],
  );
  const submitForm = (values, selectedRegisters) => {
    const params = { ...values };
    params.registers = Object.values(params.registers);
    selectedRegisters.forEach((s, i) => {
      // @ts-ignore
      if (s && s.value) params.registers[i] = { id: s.value };
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
  marketLocations: { _status: null | number; array: Array<any> };
  loading: boolean;
  createMeterValidationRules: any;
}

interface DispatchProps {
  loadMarketLocations: Function;
  addRealMeter: Function;
}

function mapStateToProps(state: StatePart) {
  return {
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
