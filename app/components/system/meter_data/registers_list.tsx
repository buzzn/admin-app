import * as React from 'react';
import ReactTable from 'react-table';
import moment from 'moment';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { Row, Col } from 'reactstrap';

interface Props {
  registers: Array<any>;
  history: any;
  url: string;
}

interface State {
  expanded: { [key: number]: boolean };
}

class RegistersList extends React.Component<Props & InjectedIntlProps, State> {
  state = { expanded: {} };

  handleRowClick(rowNum) {
    this.setState(state => ({ expanded: { ...state.expanded, [rowNum]: !state.expanded[rowNum] } }));
  }

  render() {
    const { registers, intl, history, url } = this.props;

    const data = get(registers, 'array', []).map(r => ({
      ...r,
      lastReading: get(r.readings, 'array[0]', {}),
    }));

    const columns = [
      {
        Header: () => <FormattedMessage id="admin.registers.tableName" />,
        accessor: 'marketLocation.name',
        filterable: false,
        sortable: false,
      },
      {
        Header: () => <FormattedMessage id="admin.readings.tableDate" />,
        accessor: 'lastReading.date',
        filterable: false,
        sortable: false,
        Cell: ({ value }) => <span>{value ? moment(value).format('DD.MM.YYYY') : ''}</span>,
      },
      {
        Header: () => <FormattedMessage id="admin.readings.tableValue" />,
        accessor: 'lastReading.value',
        filterable: false,
        sortable: false,
        Cell: row => <span>{row.value ? `${intl.formatNumber(row.value / 1000)} kWh` : ''}</span>,
      },
      {
        Header: () => <FormattedMessage id="admin.readings.tableReason" />,
        accessor: 'lastReading.reason',
        filterable: false,
        sortable: false,
        Cell: row => <span>{row.value ? <FormattedMessage id={`admin.readings.${row.value}`} /> : ''}</span>,
      },
      {
        expander: true,
        Expander: row => (row.original.lastReading.value ? (
            <div>{row.isExpanded ? <i className="fa fa-chevron-up" /> : <i className="fa fa-chevron-down" />}</div>
        ) : (
          ''
        )),
        style: { color: '#bdbdbd' },
      },
    ];

    return (
      <ReactTable
        {...{
          data: orderBy(data, 'lastReading.date', 'desc'),
          columns,
          SubComponent: row => (
            <Row
              style={{
                backgroundColor: '#F5F5F5',
                boxShadow: 'inset 0 1px 8px 0 rgba(0,0,0,0.07)',
                padding: '20px 10px',
                margin: 0,
              }}
            >
              <Col sm="4">
                <b>
                  <FormattedMessage id={'admin.readings.status'} />:
                </b>{' '}
                <FormattedMessage id={`admin.readings.${row.original.lastReading.status}`} />
              </Col>
              <Col sm="4">
                <b>
                  <FormattedMessage id={'admin.readings.quality'} />:
                </b>{' '}
                <FormattedMessage id={`admin.readings.${row.original.lastReading.quality}`} />
              </Col>
              <Col sm="4">
                <b>
                  <FormattedMessage id={'admin.readings.readBy'} />:
                </b>{' '}
                <FormattedMessage id={`admin.readings.${row.original.lastReading.readBy}`} />
              </Col>
              {row.original.lastReading.comment && (
                <Col sm="12" style={{ marginTop: '10px' }}>
                  <b>
                    <FormattedMessage id={'admin.readings.comment'} />:
                  </b>{' '}
                  {row.original.lastReading.comment}
                </Col>
              )}
            </Row>
          ),
          expanded: this.state.expanded,
          getTdProps: (_state, rowInfo, col) => ({
            onClick: (_event, handleOriginal) => {
              if (col.id === 'marketLocation.name') history.push(`${url}/${rowInfo.original.marketLocation.id}`);
              handleOriginal && handleOriginal();
            },
          }),
          getTrProps: (_state, rowInfo) => ({
            onClick: (_event, handleOriginal) => {
              rowInfo.original.lastReading.value && this.handleRowClick(rowInfo.viewIndex);
              handleOriginal && handleOriginal();
            },
          }),
        }}
      />
    );
  }
}

export default injectIntl(RegistersList);
