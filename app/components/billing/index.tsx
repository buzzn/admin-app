import * as React from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router';
import BillingList from './billing_list';

class Billing extends React.Component<{} & RouteComponentProps<{ groupId: string }>, null> {
  render() {
    const { match: { url, params: { groupId } } } = this.props;
    const breadcrumbs = [
      { id: 0, link: '/groups', title: 'My groups' },
    ];

    return (
      <Switch>
        <Route path={url}>
          <BillingList {...{ groupId, breadcrumbs }} />
        </Route>
      </Switch>
    );
  }
}

export default Billing;
