import * as React from 'react';
import ReactTableSorted from 'components/react_table_sorted';
import orderBy from 'lodash/orderBy';
import moment from 'moment';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import { NavLink, Link } from 'react-router-dom';
import { tableParts as TableParts } from 'react_table_config';
import ContractStatus from 'components/contract_status';
import Loading from 'components/loading';
import PageTitle from 'components/page_title';
import { BreadcrumbsProps } from 'components/breadcrumbs';
import { CenterContent, SubNav, SubNavAddLink } from 'components/style';

const DefaultPerson = require('images/default_person.jpg');
const DefaultOrganisation = require('images/default_organisation.jpg');
const DefaultThirdParty = require('images/default_3rd_party.jpg');

interface Props {
  pType: 'active' | 'past';
  powertakers: Array<any>;
  loading: boolean;
  group: { _status: null | number; [key: string]: any };
  url: string;
  history: any;
}

const PowertakersList = ({
  breadcrumbs,
  pType,
  powertakers,
  loading,
  group,
  url,
  intl,
  history,
}: Props & BreadcrumbsProps & InjectedIntlProps) => {
  if (loading) return <Loading minHeight={40} />;

  const filteredPowertakers = powertakers.filter(o =>
    pType === 'active' ? o.status !== 'ended' : o.status === 'ended',
  );

  const prefix = 'admin.contracts';

  const data = orderBy(
    filteredPowertakers,
    o =>
      o.type === 'contract_localpool_third_party'
        ? null
        : o.customer.name || `${o.customer.lastName} ${o.customer.firstName}`,
    'asc',
  ).map(p => ({
    ...p,
    name:
      p.type === 'contract_localpool_third_party'
        ? { value: 'drittbeliefert', image: DefaultThirdParty, type: 'avatar' }
        : p.customer.type === 'person'
        ? {
            value: `${p.customer.lastName} ${p.customer.firstName}`,
            image: p.customer.image || DefaultPerson,
            type: 'avatar',
            clickable: true,
          }
        : {
            value: p.customer.name,
            image: p.customer.image || DefaultOrganisation,
            type: 'avatar',
            clickable: true,
          },
    linkPowertaker:
      p.type === 'contract_localpool_third_party'
        ? ''
        : `${url}/${p.id}/powertaker`,
    linkContract: `${url}/${p.id}`,
    marketLocationName:
      p && p.registerMeta && p.registerMeta.name
        ? p.registerMeta.name
        : 'NONAME',
    // HACK
    linkMarketLocation: `${url
      .split('/')
      .slice(0, -1)
      .join('/')}/market-locations/${
      p && p.registerMeta && p.registerMeta.id ? p.registerMeta.id : 'NO-ID'
    }`,
    beginDate: moment(p.beginDate).toDate(),
    lastDate: p.lastDate ? moment(p.lastDate).toDate() : p.lastDate,
    status: {
      value: p.status,
      Display: (
        <div>
          <ContractStatus {...{ size: 'small', status: p.status }} />
          <span className="ml-2">
            {intl.formatMessage({ id: `${prefix}.${p.status}` })}
          </span>
        </div>
      ),
    },
  }));
  console.log(data);
  const columns = [
    {
      Header: () => (
        <TableParts.components.headerCell
          title={intl.formatMessage({ id: `${prefix}.tableName` })}
        />
      ),
      accessor: 'name',
      className: 'cy-powertaker',
      filterMethod: TableParts.filters.filterByValue,
      sortMethod: TableParts.sort.sortByValue,
      Cell: TableParts.components.iconNameCell,
    },
    {
      Header: () => (
        <TableParts.components.headerCell
          title={intl.formatMessage({ id: `${prefix}.tableMarketLocation` })}
        />
      ),
      accessor: 'marketLocationName',
      className: 'cy-malo',
      style: {
        cursor: 'pointer',
        textDecoration: 'underline',
      },
    },
    {
      Header: () => (
        <TableParts.components.headerCell
          title={intl.formatMessage({ id: `${prefix}.tableContractNumber` })}
        />
      ),
      accessor: 'fullContractNumber',
      className: 'cy-number',
      style: {
        cursor: 'pointer',
        textDecoration: 'underline',
      },
      sortMethod: TableParts.sort.sortByFulContractNumber,
    },
    {
      Header: () => (
        <TableParts.components.headerCell
          title={intl.formatMessage({ id: `${prefix}.tableBeginDate` })}
        />
      ),
      accessor: 'beginDate',
      Cell: ({ value }) => moment(value).format('DD.MM.YYYY'),
    },
    {
      Header: () => (
        <TableParts.components.headerCell
          title={intl.formatMessage({ id: `${prefix}.tableStatus` })}
        />
      ),
      accessor: 'status',
      filterMethod: TableParts.filters.filterByValue,
      sortMethod: TableParts.sort.sortByValue,
      Cell: ({ value: { Display } }) => Display,
    },
  ];

  if (pType === 'past') {
    columns.splice(4, 0, {
      Header: () => (
        <TableParts.components.headerCell
          title={intl.formatMessage({ id: `${prefix}.tableLastDate` })}
        />
      ),
      accessor: 'lastDate',
      Cell: ({ value }) => (value ? moment(value).format('DD.MM.YYYY') : ''),
    });
  }

  return (
    <React.Fragment>
      <PageTitle
        {...{
          breadcrumbs: breadcrumbs.concat([
            { id: '-----', title: 'Powertakers' },
          ]),
          title: intl.formatMessage({ id: 'admin.contracts.backPowertakers' }),
        }}
      />
      <CenterContent>
        <SubNavAddLink>
          {!!group.allowedActions &&
            group.allowedActions.createLocalpoolThirdPartyContract === true && (
              <Link to={`${url}/add-third-party`} data-cy="add third party CTA">
                <FormattedMessage id="admin.contracts.addNewThirdParty" />{' '}
                <i className="fa fa-tty" />
              </Link>
            )}
          {!!group.allowedActions &&
            group.allowedActions.createLocalpoolPowerTakerContract === true && (
              <Link to={`${url}/add-powertaker`} data-cy="add powertaker CTA">
                <FormattedMessage id="admin.contracts.addNew" />{' '}
                <i className="fa fa-user" />
              </Link>
            )}
        </SubNavAddLink>
        <SubNav>
          <NavLink to={`${url}/active`} exact className="nav-link">
            <FormattedMessage id="admin.contracts.navActivePowertakers" />
          </NavLink>
          <NavLink to={`${url}/past`} exact className="nav-link">
            <FormattedMessage id="admin.contracts.navPastPowertakers" />
          </NavLink>
        </SubNav>
        <div className="p-0">
          <ReactTableSorted
            {...{
              data,
              columns,
              getTdProps: (_state, rowInfo, column) => ({
                onClick: (_e, handleOriginal) => {
                  if (column.id === 'marketLocationName')
                    history.push(rowInfo.original.linkMarketLocation);
                  if (
                    column.id === 'name' &&
                    rowInfo.original.linkPowertaker.length
                  ) {
                    history.push(rowInfo.original.linkPowertaker);
                  }
                  if (column.id === 'fullContractNumber')
                    history.push(rowInfo.original.linkContract);
                  if (handleOriginal) handleOriginal();
                },
              }),
              uiSortPath: `groups.${group.id}.powertakers`,
            }}
          />
        </div>
      </CenterContent>
    </React.Fragment>
  );
};

export default injectIntl(PowertakersList);
