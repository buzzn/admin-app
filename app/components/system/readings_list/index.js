import * as React from 'react';
import ReactTable from 'react-table';
import moment from 'moment';
import orderBy from 'lodash/orderBy';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col } from 'reactstrap';
import { tableParts as TableParts } from 'react_table_config';
import { formatLabel } from '_util';

class ReadingsList extends React.Component<Props, State> {
  state = {
    expanded: {},
  }

  handleRowClick(rowNum) {
    this.setState(state => ({ expanded: { ...state.expanded, [rowNum]: !state.expanded[rowNum] } }));
  }

  render() {
    const { readings, intl } = this.props;
    const prefix = 'admin.readings';

    const data = orderBy(readings, ['date', 'reason'], ['desc', 'asc']).map(r => ({
      ...r,
      date: moment(r.date).format('DD.MM.YYYY'),
      value: formatLabel(r.value, 'h'),
    }));

    const columns = [
      {
        Header: () => <TableParts.components.headerCell title={ intl.formatMessage({ id: `${prefix}.tableDate` }) }/>,
        accessor: 'date',
        filterMethod: TableParts.filters.filterByValue,
        sortMethod: TableParts.sort.sortByValue,
      },
      {
        Header: () => <TableParts.components.headerCell title={ intl.formatMessage({ id: `${prefix}.tableValue` }) }/>,
        accessor: 'value',
        filterMethod: TableParts.filters.filterByValue,
        sortMethod: TableParts.sort.sortByValue,
      },
      {
        Header: () => <TableParts.components.headerCell title={ intl.formatMessage({ id: `${prefix}.tableReason` }) }/>,
        accessor: 'reason',
        filterMethod: TableParts.filters.filterByValue,
        sortMethod: TableParts.sort.sortByValue,
      },
      {
        expander: true,
        Expander: ({ isExpanded }) => (
          <div>
            {
              isExpanded
              ? <i className="fa fa-chevron-up"/>
              : <i className="fa fa-chevron-down"/>
            }
          </div>
        ),
        style: {
          color: '#bdbdbd',
        },
      },
    ];

    return (
      <div className="p-0" style={{ marginBottom: '2rem' }} key={ 2 }>
        <ReactTable {...{
          data,
          columns,
          SubComponent: (row) => (
            <Row style={{
              backgroundColor: '#F5F5F5',
              boxShadow: 'inset 0 1px 8px 0 rgba(0,0,0,0.07)',
              padding: '20px 10px',
              margin: 0,
            }}>
              <Col sm="4"><b><FormattedMessage id={ `${prefix}.status` }/>:</b> <FormattedMessage id={ `${prefix}.${row.original.status}` }/></Col>
              <Col sm="4"><b><FormattedMessage id={ `${prefix}.quality` }/>:</b> <FormattedMessage id={ `${prefix}.${row.original.quality}` }/></Col>
              <Col sm="4"><b><FormattedMessage id={ `${prefix}.readBy` }/>:</b> <FormattedMessage id={ `${prefix}.${row.original.readBy}` }/></Col>
              { row.original.comment && <Col sm="12" style={{ marginTop: '10px' }}><b><FormattedMessage id={ `${prefix}.comment` }/>:</b> { row.original.comment }</Col> }
            </Row>
          ),
          expanded: this.state.expanded,
          getTrProps: (state, rowInfo) => ({
            onClick: (event, handleOriginal) => {
              this.handleRowClick(rowInfo.viewIndex);
              handleOriginal && handleOriginal();
            },
          }),
        }} />
      </div>
    );
  }
}

export default injectIntl(ReadingsList);
