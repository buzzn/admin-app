import * as React from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router';
import BillingList from './billing_list';
import BillingData from './billing_data';

class Billing extends React.Component<{} & RouteComponentProps<{ groupId: string }>, null> {
  render() {
    const { history, match: { url, params: { groupId } } } = this.props;
    const breadcrumbs = [{ id: 0, link: '/groups', title: 'My groups' }];

    return (
      <Switch>
        <Route
          path={`${url}/:billingCycleId`}
          render={({ match: { params: { billingCycleId } } }) => (
            <BillingData {...{ billingCycleId, groupId, breadcrumbs, url }} />
          )}
        />
        <Route path={url}>
          <BillingList {...{ groupId, breadcrumbs, url, history }} />
        </Route>
      </Switch>
    );
  }
}

export default Billing;
