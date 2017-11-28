// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { intlShape } from 'react-intl';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';
import chunk from 'lodash/chunk';
import sample from 'lodash/sample';
import { CardDeck } from 'reactstrap';
import Groups from 'groups';
import type { GroupsStats } from 'groups/reducers';
import { tableParts as TableParts } from 'react_table_config';
import withHover from 'components/with_hover';
import LocalpoolCard from './localpool_card';

const HoverCard = withHover(LocalpoolCard);

import DefaultImage1 from 'images/energygroup_noimage_01.jpg';
import DefaultImage2 from 'images/energygroup_noimage_03.jpg';
import DefaultImage3 from 'images/energygroup_noimage_06.jpg';
import DefaultImage4 from 'images/energygroup_noimage_09.jpg';

type Props = {
  // TODO: proper action type
  loadGroups: Function,
  groups: Array<Object>,
  groupsStats: GroupsStats,
  intl: intlShape,
  history: Object,
  match: { url: string },
};

type State = {
  cardView: boolean,
};

class LocalpoolsList extends React.Component<Props, State> {
  static defaultProps = {
    groups: [],
  };

  state = {
    cardView: false,
  };

  componentWillMount() {
    this.props.loadGroups();
  }

  switchView(cardView) {
    this.setState({ cardView });
  }

  render() {
    const { groups, groupsStats, intl, history, match: { url } } = this.props;
    const { cardView } = this.state;

    const data = groups.map(g => ({
      ...g,
      nameWithImage: { value: g.name, image: g.image, type: 'group' },
      energyTypes: groupsStats[g.id] || {},
      incomplete: g.incompleteness && Object.keys(g.incompleteness).length,
    }));

    const columns = [
      {
        Header: () => <TableParts.components.headerCell title={ intl.formatMessage({ id: 'admin.groups.tableName' }) }/>,
        accessor: 'nameWithImage',
        resizable: true,
        filterMethod: TableParts.filters.filterByValue,
        sortMethod: TableParts.sort.sortByValue,
        Cell: TableParts.components.iconNameCell,
      },
      {
        Header: () => <FormattedMessage id="admin.groups.tableEnergyType"/>,
        accessor: 'energyTypes',
        Cell: TableParts.components.energyTypesCell,
        sortable: false,
        filterable: false,
        resizable: true,
      },
      {
        Header: '',
        accessor: 'incomplete',
        sortable: false,
        filterable: false,
        resizable: true,
        Cell: TableParts.components.incompleteCell,
      },
    ];

    return (
      <div>
        <div className="center-content-header">
          <span className="h3" style={{ lineHeight: '68px', margin: 0 }}><FormattedMessage id="admin.groups.headerGroupsList"/></span>
          <div className="float-right" style={{ fontSize: '1.2rem', margin: '1.5rem 0 0 0' }}>
            <i
              className="fa fa-th-large"
              onClick={ this.switchView.bind(this, true) }
              style={{ marginRight: '0.5rem', color: cardView ? 'black' : '#afafaf', cursor: 'pointer' }}/>
            <i
              className="fa fa-th-list"
              onClick={ this.switchView.bind(this, false) }
              style={{ color: !cardView ? 'black' : '#afafaf', cursor: 'pointer' }}/>
          </div>
        </div>
        {
          cardView ?
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
          )) :
          <ReactTable {...{
            data,
            columns,
            getTrProps: (state, rowinfo) => ({
              onClick: () => {
                history.push(`${url}/${rowinfo.original.id}`);
              },
              style: {
                cursor: 'pointer',
              },
            }),
          }} />
        }
      </div>
    );
  }
}

export const LocalpoolsListIntl = injectIntl(LocalpoolsList);

function mapStateToProps(state) {
  const groups = filter(state.groups.groups.array, group => group.type === 'group_localpool')
    .map(g => ({ ...g, image: sample([DefaultImage1, DefaultImage2, DefaultImage3, DefaultImage4]) }));

  return {
    groups: sortBy(groups, 'name'),
    groupsStats: state.groups.groupsStats,
  };
}

export default connect(mapStateToProps, {
  loadGroups: Groups.actions.loadGroups,
})(LocalpoolsListIntl);
