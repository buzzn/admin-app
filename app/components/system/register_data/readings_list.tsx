import * as React from 'react';
import ReactTableSorted from 'components/react_table_sorted';
import moment from 'moment';
import orderBy from 'lodash/orderBy';
import { injectIntl, FormattedMessage, InjectIntlProps } from 'react-intl';
import { Col } from 'reactstrap';
import { tableParts as TableParts } from 'react_table_config';
import { SpanClick } from 'components/style';

import { ReadingDetailsWrapper } from './style';

interface Props {
  readings: Array<any>;
  registerId: string;
  switchAddReading: Function;
  deleteReading: Function;
}

interface State {
  expanded: { [key: number]: boolean };
}

class ReadingsList extends React.Component<Props & InjectIntlProps, State> {
  state = { expanded: {} };

  handleRowClick(rowNum) {
    this.setState(state => ({ expanded: { ...state.expanded, [rowNum]: !state.expanded[rowNum] } }));
  }

  render() {
    const { readings, intl, registerId, switchAddReading, deleteReading } = this.props;
    const prefix = 'admin.readings';

    const data = orderBy(readings, ['date', 'reason'], ['desc', 'asc']).map(r => ({
      ...r,
      date: moment(r.date).format('DD.MM.YYYY'),
      value: `${intl.formatNumber(r.value / 1000)} kWh`,
    }));

    const columns = [
      {
        Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableDate` })} />,
        accessor: 'date',
        className: 'cy-date',
        filterMethod: TableParts.filters.filterByValue,
        sortMethod: TableParts.sort.sortByValue,
      },
      {
        Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableValue` })} />,
        accessor: 'value',
        filterMethod: TableParts.filters.filterByValue,
        sortMethod: TableParts.sort.sortByValue,
      },
      {
        Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableReason` })} />,
        accessor: 'reason',
        className: 'cy-reason',
        filterMethod: TableParts.filters.filterByValue,
        sortMethod: TableParts.sort.sortByValue,
        Cell: ({ value }) => intl.formatMessage({ id: `${prefix}.${value}` }),
      },
      {
        expander: true,
        Expander: ({ isExpanded }) => (
          <div>{isExpanded ? <i className="fa fa-chevron-up" /> : <i className="fa fa-chevron-down" />}</div>
        ),
        style: { color: '#bdbdbd' },
      },
    ];

    return (
      <div className="p-0" style={{ marginBottom: '2rem' }}>
        <SpanClick onClick={switchAddReading} className="float-right" data-cy="add reading CTA">
          <FormattedMessage id={`${prefix}.addNew`} /> <i className="fa fa-plus-circle" />
        </SpanClick>
        <br />
        <ReactTableSorted
          {...{
            data,
            columns,
            SubComponent: row => (
              <ReadingDetailsWrapper>
                <i className="fa fa-remove delete-reading" onClick={() => deleteReading(row.original.id)} />
                <Col sm="4">
                  <b>
                    <FormattedMessage id={`${prefix}.status`} />:
                  </b>{' '}
                  <FormattedMessage id={`${prefix}.${row.original.status}`} />
                </Col>
                <Col sm="4">
                  <b>
                    <FormattedMessage id={`${prefix}.quality`} />:
                  </b>{' '}
                  <FormattedMessage id={`${prefix}.${row.original.quality}`} />
                </Col>
                <Col sm="4">
                  <b>
                    <FormattedMessage id={`${prefix}.readBy`} />:
                  </b>{' '}
                  <FormattedMessage id={`${prefix}.${row.original.readBy}`} />
                </Col>
                {row.original.comment && (
                  <Col sm="12" style={{ marginTop: '10px' }}>
                    <b>
                      <FormattedMessage id={`${prefix}.comment`} />:
                    </b>{' '}
                    {row.original.comment}
                  </Col>
                )}
              </ReadingDetailsWrapper>
            ),
            expanded: this.state.expanded,
            getTrProps: (_state, rowInfo) => ({
              onClick: (_event, handleOriginal) => {
                this.handleRowClick(rowInfo.viewIndex);
                handleOriginal && handleOriginal();
              },
            }),
            uiSortPath: `registers.${registerId}.readings`,
          }}
        />
      </div>
    );
  }
}

export default injectIntl(ReadingsList);
