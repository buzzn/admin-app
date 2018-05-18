import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

interface Props {}

class ScrollToTop extends React.Component<RouteComponentProps<any> & Props> {
  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(ScrollToTop);
