import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Meters from 'meters';
import Loading from 'components/loading';
import RealMeterDataForm from './real_form';
import VirtualMeterDataForm from './virtual_form';
import { BreadcrumbsProps } from 'components/breadcrumbs';
import { CenterContent } from 'components/style';
import PageTitle from 'components/page_title';

class MeterData extends React.Component<ExtProps & DispatchProps & StateProps & BreadcrumbsProps> {
  componentDidMount() {
    const { loadMeter, groupId, meterId } = this.props;
    loadMeter({ groupId, meterId });
  }

  componentWillUnmount() {
    this.props.setMeter({ _status: null });
  }

  render() {
    const { url, breadcrumbs, meter, realValidationRules, virtualValidationRules, loading } = this.props;

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
            <RealMeterDataForm {...{ meter, realValidationRules, initialValues: meter }} />
          ) : (
            <VirtualMeterDataForm {...{ meter, virtualValidationRules, initialValues: meter }} />
          )}
        </CenterContent>
      </React.Fragment>
    );
  }
}

interface StatePart {
  meters: {
    loadingMeter: boolean;
    meter: { _status: null | number; [key: string]: any };
    virtualValidationRules: any;
    realValidationRules: any;
  };
}

interface ExtProps {
  url: string;
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
}

function mapStateToProps(state: StatePart) {
  return {
    meter: state.meters.meter,
    loading: state.meters.loadingMeter,
    realValidationRules: state.meters.realValidationRules,
    virtualValidationRules: state.meters.virtualValidationRules,
  };
}

export default connect<StateProps, DispatchProps, ExtProps>(mapStateToProps, {
  loadMeter: Meters.actions.loadMeter,
  setMeter: Meters.actions.setMeter,
})(MeterData);
