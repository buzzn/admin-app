import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';

import Groups from 'groups';
import MarketLocations from 'market_locations';
import Registers from 'registers';

import Loading from 'components/loading';
import MarketLocationsList from './market_locations_list';
import RegisterData from './register_data';
import MeterData from './meter_data';
import MarketLocationData from './market_location_data';
import AddMeter from './add_meter';

export class System extends React.Component {
  state = { initialMeter: {} };

  duplicateMeter = (original) => {
    const {
      history,
      match: { url },
    } = this.props;
    const { meter, ...malo } = original;
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
      marketLocations,
      setMarketLocations,
      updateRegisterMeta,
      updateMaLoValidationRules,
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
          path={`${url}/:maloType(consumption|production|system|all-meters)`}
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
              initMeter: this.state.initialMeter,
              url,
              groupId,
              cb: this.clearInitMeter,
            }}
          />
        </Route>
        <Route
          path={`${url}/meters/:meterId`}
          render={({ match: { params: { meterId } } }) => <MeterData {...{ url, breadcrumbs, meterId, groupId, history }} />}
        />
        <Route
          path={`${url}/registers/:meterId/:registerId`}
          render={({
            match: {
              url: registerUrl,
              params: { meterId, registerId },
            },
          }) => {
            return (
              <RegisterData
                {...{
                  url,
                  registerUrl,
                  breadcrumbs,
                  registerId,
                  meterId,
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
            return (
              <MarketLocationData
                {...{
                  breadcrumbs,
                  url,
                  groupId,
                  locationUrl,
                  marketLocation,
                  updateRegisterMeta,
                  updateMaLoValidationRules,
                }}
              />
            );
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
  const { marketLocations } = state.marketLocations;
  return {
    devMode: state.app.ui.devMode,
    group: state.groups.group,
    loading: state.marketLocations.loadingMarketLocations || !state.groups.group.id,
    marketLocations,
    updateMaLoValidationRules: state.registers.validationRules.metaUpdate,
  };
}

export default connect(
  mapStateToProps,
  {
    loadMarketLocations: MarketLocations.actions.loadMarketLocations,
    setMarketLocations: MarketLocations.actions.setMarketLocations,
    loadGroup: Groups.actions.loadGroup,
    updateRegisterMeta: Registers.actions.updateRegisterMeta,
  },
)(System);
