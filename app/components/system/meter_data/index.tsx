import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Meters from 'meters';
import Loading from 'components/loading';
import { BreadcrumbsProps } from 'components/breadcrumbs';
import { CenterContent } from 'components/style';
import PageTitle from 'components/page_title';
import Comments from 'components/comments';

import VirtualMeterDataForm from './virtual_form';
import RealMeterDataForm from './real_form';

class MeterData extends React.Component<ExtProps & DispatchProps & StateProps & BreadcrumbsProps> {
  componentDidMount() {
    const { loadMeter, groupId, meterId } = this.props;
    loadMeter({ groupId, meterId });
  }

  componentWillUnmount() {
    this.props.setMeter({ _status: null });
  }

  render() {
    const {
      url,
      history,
      breadcrumbs,
      meter,
      realValidationRules,
      virtualValidationRules,
      loading,
      updateMeter,
      groupId,
    } = this.props;

    if (loading || meter._status === null) return <Loading minHeight={40} />;
    if (meter._status && meter._status !== 200) return <Redirect to={url} />;

    return (
      <React.Fragment>
        <PageTitle
          {...{
            breadcrumbs: breadcrumbs.concat([
              {
                id: meter.id,
                type: 'meter',
                title: meter.productSerialnumber,
                link: undefined,
              },
            ]),
            title: `Meter ${meter.productSerialnumber}`,
          }}
        />
        <CenterContent>
          {meter.type === 'meter_real' ? (
            <RealMeterDataForm
              {...{ meter, validationRules: realValidationRules, initialValues: meter, updateMeter, groupId, url }}
            />
          ) : (
            <VirtualMeterDataForm
              {...{ meter, validationRules: virtualValidationRules, initialValues: meter, url, history }}
            />
          )}
          <Comments {...{ ids: { type: 'meter', groupId, meterId: meter.id } }} />
        </CenterContent>
      </React.Fragment>
    );
  }
}

interface StatePart {
  meters: {
    loadingMeter: boolean;
    meter: { _status: null | number; [key: string]: any };
    validationRules: {
      realUpdate: any;
      virtualUpdate: any;
    };
  };
}

interface ExtProps {
  url: string;
  history: any;
  meterId: string;
  groupId: string;
}

interface StateProps {
  loading: boolean;
  meter: { _status: null | number; [key: string]: any };
  realValidationRules: any;
  virtualValidationRules: any;
}

interface DispatchProps {
  loadMeter: Function;
  setMeter: Function;
  updateMeter: Function;
}

function mapStateToProps(state: StatePart) {
  return {
    meter: state.meters.meter,
    loading: state.meters.loadingMeter,
    realValidationRules: state.meters.validationRules.realUpdate,
    virtualValidationRules: state.meters.validationRules.virtualUpdate,
  };
}

export default connect<StateProps, DispatchProps, ExtProps>(
  mapStateToProps,
  {
    loadMeter: Meters.actions.loadMeter,
    setMeter: Meters.actions.setMeter,
    updateMeter: Meters.actions.updateMeter,
  },
)(MeterData);
