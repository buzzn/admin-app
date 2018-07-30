import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import ReactTableSorted from 'components/react_table_sorted';
import { injectIntl, FormattedMessage, InjectedIntlProps } from 'react-intl';
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
import Loading from 'components/loading';

const HoverCard = withHover(LocalpoolCard);

const DefaultImage1 = require('images/energygroup_noimage_01.jpg');
const DefaultImage2 = require('images/energygroup_noimage_03.jpg');
const DefaultImage3 = require('images/energygroup_noimage_06.jpg');
const DefaultImage4 = require('images/energygroup_noimage_09.jpg');

class LocalpoolsList extends React.Component<
  ExtProps & StateProps & DispatchProps & InjectedIntlProps & RouteComponentProps<{}>,
  LocalpoolsListState
  > {
  static defaultProps = { groups: [] };

  state = { groupsListTiles: false };

  componentDidMount() {
    this.setState({ groupsListTiles: this.props.groupsListTiles });
    this.props.loadGroups();
  }

  switchView(groupsListTiles) {
    this.setState({ groupsListTiles });
    this.props.setUI({ groupsListTiles });
  }

  render() {
    const { groups, loading, intl, history, match: { url } } = this.props;
    const { groupsListTiles } = this.state;

    if (loading) return <Loading minHeight={40} />;

    const data = groups.map(g => ({
      ...g,
      nameWithImage: { value: g.name, image: g.image, type: 'group' },
      incomplete: g.incompleteness && Object.keys(g.incompleteness).length,
    }));

    const columns = [
      {
        Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: 'admin.groups.tableName' })} />,
        className: 'cy-group-name',
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
        Header: () => <FormattedMessage id="admin.groups.tableDisplayView" />,
        accessor: 'showDisplayApp',
        resizable: false,
        filterable: false,
        width: 100,
        Cell: ({ value }) => <i className="buzzn-television" style={{ color: value ? 'black' : '#BDBDBD' }} />,
      },
      {
        Header: '',
        accessor: 'incomplete',
        width: 50,
        sortable: false,
        filterable: false,
        resizable: false,
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
              getTrProps: (_state, rowinfo) => ({
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

interface StatePart {
  groups: { loadingGroups: boolean; groups: { _status: null | number; array: Array<any> } };
  app: { ui: { groupsListTiles: void | boolean } };
}

interface LocalpoolsListState {
  groupsListTiles: void | boolean;
}

interface ExtProps {}

interface StateProps {
  groups: Array<any>;
  loading: boolean;
  groupsListTiles: void | boolean;
}

interface DispatchProps {
  loadGroups: Function;
  setUI: Function;
}

export const LocalpoolsListIntl = injectIntl(LocalpoolsList);

function mapStateToProps(state: StatePart) {
  const groups = filter(state.groups.groups.array, group => group.type === 'group_localpool').map(g => ({
    ...g,
    image: sample([DefaultImage1, DefaultImage2, DefaultImage3, DefaultImage4]),
  }));

  return {
    groups: sortBy(groups, 'name'),
    loading: state.groups.loadingGroups,
    groupsListTiles: state.app.ui.groupsListTiles,
  };
}

export default connect<StateProps, DispatchProps, ExtProps>(mapStateToProps, {
  loadGroups: Groups.actions.loadGroups,
  setUI: actions.setUI,
})(LocalpoolsListIntl);
