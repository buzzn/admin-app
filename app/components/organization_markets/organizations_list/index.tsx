import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';

import Loading from 'components/loading';
import ReactTableSorted from 'components/react_table_sorted';
import { tableParts as TableParts } from 'react_table_config';

import NestedDetails from './nested_details';
import { MarketFunctionType } from './style';

const OrganizationsList = ({
  availableOrganizationMarkets,
  intl,
  loading,
  urlAdd,
  validationRules,
  updateOrganizationMarket,
  addFunctionToOrgMarket,
  updateOrganizationMarketFunction,
  deleteFunctionFromOrgMarket,
}) => {
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
            <MarketFunctionType key={f.id}>
              {i !== 0 && '/'}
              {f.function
                .split('_')
                .map(s => s[0].toUpperCase())
                .join('')}
            </MarketFunctionType>
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
          SubComponent: ({ original: organization }) => (
            <NestedDetails
              {...{
                form: `editOrgMarket${organization.id}`,
                initialValues: organization,
                organization,
                validationRules,
                updateOrganizationMarketFunction,
                updateOrganizationMarket,
                addFunctionToOrgMarket,
                deleteFunctionFromOrgMarket,
              }}
            />
          ),
          uiSortPath: 'organizationMarkets',
        }}
      />
    </div>
  );
};

export default injectIntl(OrganizationsList);
