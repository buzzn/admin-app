import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import Groups from 'groups';
import MarketLocations from 'market_locations';
import Meters from 'meters';
import Loading from 'components/loading';
import MarketLocationsList from './market_locations_list';
import RegisterData from './register_data';
import MeterData from './meter_data';
import MarketLocationData from './market_location_data';
import AddMeter from './add_meter';

export class System extends React.Component {
  state = { initialMeter: {} };

  duplicateMeter = (original) => {
    const { history, match: { url } } = this.props;
    const {
      register: { meter },
      ...malo
    } = original;
    this.setState({ initialMeter: { ...meter, registers: [malo] } });
    history.push(`${url}/add-meter`);
  };

  clearInitMeter = () => this.setState({ initialMeter: {} });

  componentDidMount() {
    const {
      loadMarketLocations,
      loadGroup,
      match: { params: { groupId } },
    } = this.props;
    loadGroup(groupId);
    loadMarketLocations(groupId);
  }

  componentWillUnmount() {
    this.props.setMarketLocations({ _status: null, array: [] });
  }

  render() {
    const {
      devMode,
      loading,
      loadMarketLocations,
      marketLocations,
      setMarketLocations,
      createMeterValidationRules,
      addRealMeter,
      registers,
      meters,
      group,
      history,
      match: {
        url,
        params: { groupId },
      },
    } = this.props;

    if (marketLocations._status === 404 || marketLocations._status === 403) {
      setMarketLocations({ _status: null, array: [] });
      return <Redirect to="/groups" />;
    }

    if (marketLocations._status === null || loading) return <Loading minHeight={40} />;

    const breadcrumbs = [
      { id: 0, link: '/groups', title: 'My groups' },
      { id: group.id || 1, link: url, title: group.name },
    ];

    return (
      <Switch>
        <Route
          path={`${url}/:maloType(consumption|production|system)`}
          render={({ match: { params: { maloType } } }) => (
            <MarketLocationsList
              {...{
                marketLocations: marketLocations.array,
                url,
                history,
                groupId,
                breadcrumbs,
                maloType,
                duplicateMeter: this.duplicateMeter,
              }}
            />
          )}
        />
        <Route path={`${url}/add-meter`}>
          <AddMeter
            {...{
              history,
              url,
              clearInitMeter: this.clearInitMeter,
              initialValues: this.state.initialMeter,
              addMeter: params => addRealMeter({ groupId, ...params }),
              validationRules: createMeterValidationRules,
              loadMarketLocations: () => loadMarketLocations(groupId),
              marketLocations,
            }}
          />
        </Route>
        <Route
          path={`${url}/meters/:meterId`}
          render={({ match: { params: { meterId } } }) => {
            const meter = meters.find(m => m.id === meterId);
            if (!meter) return <Redirect to={url} />;
            return <MeterData {...{ url, breadcrumbs, meterId, groupId, history }} />;
          }}
        />
        <Route
          path={`${url}/registers/:registerId`}
          render={({
            match: {
              url: registerUrl,
              params: { registerId },
            },
          }) => {
            const register = registers.find(r => r.id === registerId);
            if (!register) return <Redirect to={url} />;
            return (
              <RegisterData
                {...{
                  url,
                  registerUrl,
                  breadcrumbs,
                  registerId,
                  meterId: register.meterId,
                  devMode,
                  groupId: group.id,
                }}
              />
            );
          }}
        />
        <Route
          path={`${url}/:locationId`}
          render={({
            match: {
              url: locationUrl,
              params: { locationId },
            },
          }) => {
            const marketLocation = marketLocations.array.find(m => m.id === locationId);
            if (!marketLocation) return <Redirect to={url} />;
            return <MarketLocationData {...{ breadcrumbs, url, groupId, locationUrl, marketLocation }} />;
          }}
        />
        <Route path={url}>
          <Redirect to={`${url}/consumption`} />
        </Route>
      </Switch>
    );
  }
}

function mapStateToProps(state) {
  const getRegisters = malo => (malo._status === 200 ? malo.array.map(m => m.register) : []);
  const getMeters = malo => (malo._status === 200 ? malo.array.map(m => m.register.meter) : []);
  return {
    devMode: state.app.ui.devMode,
    group: state.groups.group,
    loading: state.marketLocations.loadingMarketLocations || !state.groups.group.id,
    marketLocations: state.marketLocations.marketLocations,
    registers: getRegisters(state.marketLocations.marketLocations),
    meters: getMeters(state.marketLocations.marketLocations),
    createMeterValidationRules: state.meters.validationRules.realCreate,
  };
}

export default connect(
  mapStateToProps,
  {
    loadMarketLocations: MarketLocations.actions.loadMarketLocations,
    setMarketLocations: MarketLocations.actions.setMarketLocations,
    loadGroup: Groups.actions.loadGroup,
    addRealMeter: Meters.actions.addRealMeter,
  },
)(System);
