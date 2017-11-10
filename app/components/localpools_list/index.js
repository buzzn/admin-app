// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { CardDeck } from 'reactstrap';
import filter from 'lodash/filter';
import chunk from 'lodash/chunk';
import Groups from 'groups';
import withHover from 'components/with_hover';
import type { GroupsStats } from 'groups/reducers';
import LocalpoolCard from './localpool_card';

const HoverCard = withHover(LocalpoolCard);

type Props = {
  // TODO: proper action type
  loadGroups: Function,
  myProfile: { firstName: string, lastName: string },
  groups: Array<Object>,
  groupsStats: GroupsStats,
  match: { url: string },
};

export class LocalpoolsList extends React.Component<Props> {
  static defaultProps = {
    groups: [],
    myProfile: { firstName: '', lastName: '' },
  };

  componentWillMount() {
    this.props.loadGroups();
  }

  render() {
    const { myProfile: { firstName, lastName }, groups, groupsStats, match: { url } } = this.props;

    return (
      <div>
        <p className="h4">{ `${firstName} ${lastName}` }</p>
        {
          chunk(groups, 2).map(groupPair => (
            <CardDeck key={ groupPair[0].id }>
              {
                groupPair.map(group => <HoverCard
                  key={ group.id }
                  group={ group }
                  groupStats={ groupsStats[group.id] }
                  url={ url }/>)
              }
            </CardDeck>
          ))
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    myProfile: state.app.userMe,
    groups: filter(state.groups.groups.array, group => group.type === 'group_localpool'),
    groupsStats: state.groups.groupsStats,
  };
}

export default connect(mapStateToProps, {
  loadGroups: Groups.actions.loadGroups,
})(LocalpoolsList);
