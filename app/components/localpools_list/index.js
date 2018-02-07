import * as React from 'react';
import { connect } from 'react-redux';
import ReactTableSorted from 'components/react_table_sorted';
import { injectIntl, FormattedMessage } from 'react-intl';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';
import chunk from 'lodash/chunk';
import sample from 'lodash/sample';
import { CardDeck } from 'reactstrap';
import Groups from 'groups';
import { actions } from 'actions';
import { tableParts as TableParts } from 'react_table_config';
import withHover from 'components/with_hover';
import LocalpoolCard from './localpool_card';

const HoverCard = withHover(LocalpoolCard);

import DefaultImage1 from 'images/energygroup_noimage_01.jpg';
import DefaultImage2 from 'images/energygroup_noimage_03.jpg';
import DefaultImage3 from 'images/energygroup_noimage_06.jpg';
import DefaultImage4 from 'images/energygroup_noimage_09.jpg';

class LocalpoolsList extends React.Component {
  static defaultProps = { groups: [] };

  state = { groupsListTiles: false };

  componentWillMount() {
    this.setState({ groupsListTiles: this.props.groupsListTiles });
    this.props.loadGroups();
  }

  switchView(groupsListTiles) {
    this.setState({ groupsListTiles });
    this.props.setUI({ groupsListTiles });
  }

  render() {
    const { groups, intl, history, match: { url } } = this.props;
    const { groupsListTiles } = this.state;

    const data = groups.map(g => ({
      ...g,
      nameWithImage: { value: g.name, image: g.image, type: 'group' },
      incomplete: g.incompleteness && Object.keys(g.incompleteness).length,
    }));

    const columns = [
      {
        Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: 'admin.groups.tableName' })} />,
        accessor: 'nameWithImage',
        resizable: true,
        filterMethod: TableParts.filters.filterByValue,
        sortMethod: TableParts.sort.sortByValue,
        Cell: TableParts.components.iconNameCell,
      },
      {
        Header: () => <FormattedMessage id="admin.groups.tableEnergyType" />,
        accessor: 'powerSources',
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
          <span className="h3" style={{ lineHeight: '68px', margin: 0 }}>
            <FormattedMessage id="admin.groups.headerGroupsList" />
          </span>
          <div className="float-right" style={{ fontSize: '1.2rem', margin: '1.5rem 0 0 0' }}>
            <i
              className="fa fa-th-large"
              onClick={this.switchView.bind(this, true)}
              style={{ marginRight: '0.5rem', color: groupsListTiles ? 'black' : '#afafaf', cursor: 'pointer' }}
            />
            <i
              className="fa fa-th-list"
              onClick={this.switchView.bind(this, false)}
              style={{ color: !groupsListTiles ? 'black' : '#afafaf', cursor: 'pointer' }}
            />
          </div>
        </div>
        {groupsListTiles ? (
          chunk(groups, 2).map(groupPair => (
            <CardDeck key={groupPair[0].id}>
              {groupPair.map(group => <HoverCard key={group.id} group={group} url={url} />)}
            </CardDeck>
          ))
        ) : (
          <ReactTableSorted
            {...{
              data,
              columns,
              filterable: true,
              getTrProps: (state, rowinfo) => ({
                onClick: () => {
                  history.push(`${url}/${rowinfo.original.id}`);
                },
                style: { cursor: 'pointer' },
              }),
              uiSortPath: 'localpoolList',
            }}
          />
        )}
      </div>
    );
  }
}

export const LocalpoolsListIntl = injectIntl(LocalpoolsList);

function mapStateToProps(state) {
  const groups = filter(state.groups.groups.array, group => group.type === 'group_localpool').map(g => ({
    ...g,
    image: sample([DefaultImage1, DefaultImage2, DefaultImage3, DefaultImage4]),
  }));

  return {
    groups: sortBy(groups, 'name'),
    groupsListTiles: state.app.ui.groupsListTiles,
  };
}

export default connect(mapStateToProps, {
  loadGroups: Groups.actions.loadGroups,
  setUI: actions.setUI,
})(LocalpoolsListIntl);
