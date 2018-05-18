import * as React from 'react';
import { connect } from 'react-redux';
import Bubbles from '@buzzn/module_bubbles';
import BubblesLayout from './bubbles_layout';

export class LocalpoolOverview extends React.Component {
  componentDidMount() {
    const { loadBubbles, match: { params: { groupId } } } = this.props;
    loadBubbles(groupId);
  }

  componentDidUpdate(prevProps) {
    const { loadBubbles, match: { params: { groupId } } } = prevProps;
    const { match: { params: { groupId: newGroupId } } } = this.props;
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
        <Bubbles.container Layout={BubblesLayout} />
      </div>
    );
  }
}

export default connect(() => ({}), {
  loadBubbles: Bubbles.actions.setGroupId,
  stopBubbles: Bubbles.actions.stopRequests,
})(LocalpoolOverview);
