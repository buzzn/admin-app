import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router-dom';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import Groups from 'groups';
import Tariffs from 'tariffs';
import Loading from 'components/loading';
import AttachedTariffs from 'components/attached_tariffs';
import TariffsList from './tariffs_list';
import AddTariff from './add_tariff';
import { numberParse } from '_util';

class TariffsComponent extends React.Component<
  StateProps & DispatchProps & ExtProps & InjectedIntlProps,
  ComponentState
  > {
  state = { isOpen: false };

  switchAddTariff = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  addTariff = (params) => {
    const {
      addTariff,
      match: { params: { groupId } },
    } = this.props;

    return new Promise((resolve, reject) => {
      addTariff({
        groupId,
        params: {
          ...params,
          energypriceCentsPerKwh: numberParse(this.props.intl.locale, params.energypriceCentsPerKwh),
          basepriceCentsPerMonth: numberParse(this.props.intl.locale, params.basepriceCentsPerMonth) * 100,
        },
        resolve,
        reject,
      });
    }).then((res) => {
      this.switchAddTariff();
      return res;
    });
  };

  componentDidMount() {
    const {
      loadGroup,
      loadTariffs,
      match: { params: { groupId } },
    } = this.props;
    loadGroup(groupId);
    loadTariffs(groupId);
  }

  componentWillUnmount() {
    this.props.setGroup({ _status: null });
    this.props.setTariffs({ tariffs: { _status: null, array: [] }, gapTariffs: { _status: null, array: [] } });
  }

  render() {
    const {
      loading,
      intl,
      group,
      tariffs,
      gapTariffs,
      setGapTariffs,
      setGroup,
      setTariffs,
      validationRules,
      match: {
        url,
        params: { groupId },
      },
    } = this.props;
    const { isOpen } = this.state;

    if (
      group._status === 404
      || group._status === 403
      || tariffs._status === 404
      || tariffs._status === 403
      || gapTariffs._status === 404
      || gapTariffs._status === 403
    ) {
      setGroup({ _status: null });
      setTariffs({ tariffs: { _status: null, array: [] }, gapTariffs: { _status: null, array: [] } });
      return <Redirect to="/groups" />;
    }

    if (group._status === null || tariffs._status === null || gapTariffs._status === null || loading) return <Loading minHeight={40} />;

    const breadcrumbs = [
      { id: 0, link: '/groups', title: intl.formatMessage({ id: 'admin.breadcrumbs.myGroups' }) },
      { id: group.id || 1, link: url, title: group.name },
    ];

    return (
      <React.Fragment>
        <Switch>
          <Route path={url} exact>
            <Redirect to={`${url}/active`} />
          </Route>

          <Route
            path={`${url}/:tType(active|past)`}
            render={({ match: { params: { tType } } }) => (
              <TariffsList
                {...{ tariffs: tariffs.array, groupId, breadcrumbs, tType, url, switchAddTariff: this.switchAddTariff }}
              />
            )}
          />
        </Switch>

        <AttachedTariffs
          {...{
            title: 'Gap tariffs',
            tariffs: tariffs.array,
            attachedTariffs: gapTariffs.array,
            updateList: ({ resolve, reject, tariffIds }) => setGapTariffs({ resolve, reject, params: { tariffIds, updatedAt: group.updatedAt }, groupId }),
          }}
        />
        <AddTariff {...{ toggle: this.switchAddTariff, isOpen, validationRules, onSubmit: this.addTariff }} />
      </React.Fragment>
    );
  }
}

interface TariffsRouterProps {
  groupId: string;
}

interface ComponentState {
  isOpen: boolean;
}

interface ExtProps extends RouteComponentProps<TariffsRouterProps> {}

// FIXME: put it to groups types
interface StatePart {
  groups: {
    loadingGroup: boolean;
    group: { _status: null | number; [key: string]: any };
  };
  tariffs: {
    loadingTariffs: boolean;
    tariffs: { _status: null | number; array: Array<{ [key: string]: any }> };
    gapTariffs: { _status: null | number; array: Array<{ [key: string]: any }> };
    validationRules: any;
  };
}

interface StateProps {
  loading: boolean;
  group: { _status: null | number; [key: string]: any };
  tariffs: { _status: null | number; array: Array<{ [key: string]: any }> };
  gapTariffs: { _status: null | number; array: Array<{ [key: string]: any }> };
  validationRules: any;
}

interface DispatchProps {
  loadGroup: Function;
  setGroup: Function;
  loadTariffs: Function;
  setTariffs: Function;
  addTariff: Function;
  setGapTariffs: Function;
}

function mapStateToProps(state: StatePart) {
  return {
    loading: state.groups.loadingGroup || state.tariffs.loadingTariffs,
    group: state.groups.group,
    tariffs: state.tariffs.tariffs,
    gapTariffs: state.tariffs.gapTariffs,
    validationRules: state.tariffs.validationRules,
  };
}

export default connect<StateProps, DispatchProps, ExtProps>(
  mapStateToProps,
  {
    loadGroup: Groups.actions.loadGroup,
    setGroup: Groups.actions.setGroup,
    loadTariffs: Tariffs.actions.loadTariffs,
    setTariffs: Tariffs.actions.setTariffs,
    addTariff: Tariffs.actions.addTariff,
    setGapTariffs: Tariffs.actions.setGapTariffs,
  },
)(injectIntl(TariffsComponent));
