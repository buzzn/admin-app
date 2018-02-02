import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, NavLink, RouteComponentProps } from 'react-router-dom';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { Nav } from 'reactstrap';
import get from 'lodash/get';
import Groups from 'groups';
import Breadcrumbs from 'components/breadcrumbs';
import LinkBack from 'components/link_back';
import Loading from 'components/loading';

class Tariffs extends React.Component<StateProps & DispatchProps & ExtProps & InjectedIntlProps> {
  componentWillMount() {
    const { loadGroup, match: { params: { groupId } } } = this.props;
    loadGroup(groupId);
  }

  render() {
    const { loading, tariffs, intl } = this.props;

    return <div>Tariffs</div>;
  }
}

interface TariffsRouterProps {
  groupId: string;
}

interface ExtProps extends RouteComponentProps<TariffsRouterProps> {}

// FIXME: put it to groups types
interface StatePart {
  groups: {
    loadingGroup: boolean;
    group: { _status: null | number; [key: string]: any };
  };
}

interface StateProps {
  tariffs: Array<any>;
  loading: boolean;
}

interface DispatchProps {
  loadGroup: Function;
}

function mapStateToProps(state: StatePart) {
  return {
    loading: state.groups.loadingGroup,
    tariffs: get(state.groups.group, 'tariffs.array', []),
  };
}

export default connect<StateProps, DispatchProps>(mapStateToProps, { loadGroup: Groups.actions.loadGroup })(injectIntl(Tariffs));
