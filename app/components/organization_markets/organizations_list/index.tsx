import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col } from 'reactstrap';

import LabeledValue from 'components/labeled_value';
import Loading from 'components/loading';
import ReactTableSorted from 'components/react_table_sorted';
import { tableParts as TableParts } from 'react_table_config';
import { NestedDetailsWrapper } from 'components/style';

import { MarketFunction } from './style';

const OrganizationsList = ({ availableOrganizationMarkets, intl, loading, urlAdd }) => {
  if (loading || availableOrganizationMarkets._status === null) return <Loading minHeight={40} />;

  if (availableOrganizationMarkets._status === 403 || availableOrganizationMarkets._status === 404) return <Redirect to="/" />;

  const prefix = 'admin.organizations';

  const data = availableOrganizationMarkets.array;

  const columns = [
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableName` })} />,
      accessor: 'name',
    },
    {
      Header: () => <FormattedMessage id={`${prefix}.tableMarketFunctions`} />,
      accessor: 'marketFunctions.array',
      sortable: false,
      Cell: ({ value }) => (
        <React.Fragment>
          {value.map((f, i) => (
            <MarketFunction key={f.id}>
              {i !== 0 && '/'}
              {f.function
                .split('_')
                .map(s => s[0].toUpperCase())
                .join('')}
            </MarketFunction>
          ))}
        </React.Fragment>
      ),
    },
    {
      expander: true,
      Expander: row => (
        <div>{row.isExpanded ? <i className="fa fa-chevron-up" /> : <i className="fa fa-chevron-down" />}</div>
      ),
      style: { color: '#bdbdbd' },
    },
  ];

  return (
    <div className="p-0">
      <Link className="float-right" to={urlAdd}>
        <FormattedMessage id={`${prefix}.addNew`} /> <i className="fa fa-plus-circle" />
      </Link>
      <br />
      <ReactTableSorted
        {...{
          collapseOnDataChange: false,
          columns,
          data,
          SubComponent: ({ original }) => (
            <NestedDetailsWrapper>
              <Row>
                {['name', 'description', 'phone', 'website', 'email'].map(k => (
                  <Col key={k} xs={6}>
                    <LabeledValue {...{ label: <FormattedMessage id={`${prefix}.${k}`} />, value: original[k] }} />
                  </Col>
                ))}
              </Row>
            </NestedDetailsWrapper>
          ),
          uiSortPath: 'organizationMarkets',
        }}
      />
    </div>
  );
};

export default injectIntl(OrganizationsList);
