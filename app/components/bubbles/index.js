// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import Bubbles from '@buzzn/module_bubbles';
import BubblesLayout from './bubbles_layout';

type Props = {
  loadBubbles: Function,
  stopBubbles: Function,
  match: { params: { groupId: string } },
};

export class LocalpoolOverview extends React.Component<Props> {
  componentWillMount() {
    const { loadBubbles, match: { params: { groupId } } } = this.props;
    loadBubbles(groupId);
  }

  componentWillReceiveProps(nextProps: Props) {
    const { loadBubbles, match: { params: { groupId } } } = this.props;
    const { match: { params: { groupId: newGroupId } } } = nextProps;
    if (groupId !== newGroupId) {
      loadBubbles(newGroupId);
    }
  }

  componentWillUnmount() {
    this.props.stopBubbles();
  }

  render() {
    return (
      <div className="center-content">
        <Bubbles.container Layout={ BubblesLayout } />
      </div>
    );
  }
}

export default connect(() => ({}), {
  loadBubbles: Bubbles.actions.setGroupId,
  stopBubbles: Bubbles.actions.stopRequests,
})(LocalpoolOverview);
