// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { injectIntl } from 'react-intl';
import type { intlShape } from 'react-intl';
import { tableParts as TableParts } from 'react_table_config';
import Meters from 'meters';

type Props = {
  loading: boolean,
  meters: Array<Object>,
  // TODO: replace with action
  loadGroupMeters: Function,
  intl: intlShape,
  match: { params: { groupId: string } },
};

export class System extends React.Component<Props> {
  static defaultProps = {
    meters: [],
  };

  componentWillMount() {
    const { loadGroupMeters, match: { params: { groupId } } } = this.props;
    loadGroupMeters(groupId);
  }

  render() {
    const { loading, meters, match: { params: { groupId } }, intl } = this.props;

    if (loading) return (<div>Loading...</div>);

    const data = meters.map(m => ({
      ...m,
      type: intl.formatMessage({ id: `admin.meters.${m.type}` }),
      meter: m.productSerialnumber,
      link: `/localpools/${groupId}/system/${m.id}`,
    }));

    const columns = [
      {
        Header: () => <TableParts.components.headerCell title="Type"/>,
        accessor: 'type',
        minWidth: 200,
      },
      {
        Header: () => <TableParts.components.headerCell title="Meter"/>,
        accessor: 'meter',
        minWidth: 200,
      },
      {
        Header: '',
        accessor: 'link',
        sortable: false,
        filterable: false,
        resizable: false,
        width: 100,
        Cell: () => <TableParts.components.iconCell icon="cog"/>,
      },
    ];

    return [
      <div key={ 1 }>
        <h5>System setup</h5>
        List of all <strong>meters</strong> in your local pool.
      </div>,
      <div className="p-0" key={ 2 }>
        <ReactTable {...{ data, columns }} />
      </div>,
    ];
  }
}

function mapStateToProps(state) {
  return {
    loading: state.meters.loadingGroupMeters,
    meters: state.meters.groupMeters,
  };
}

export default connect(mapStateToProps, { loadGroupMeters: Meters.actions.loadGroupMeters })(injectIntl(System));
