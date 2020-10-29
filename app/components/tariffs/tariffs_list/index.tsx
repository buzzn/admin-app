import React, { useState } from 'react';
import ReactTableSorted from 'components/react_table_sorted';
import orderBy from 'lodash/orderBy';
import moment from 'moment';
import { FormattedMessage, injectIntl, InjectIntlProps } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { tableParts as TableParts } from 'react_table_config';
import { BreadcrumbsProps } from 'components/breadcrumbs';
import PageTitle from 'components/page_title';
import { CenterContent, SubNav, SpanClick } from 'components/style';
import NestedDetails from './nested_details';

interface Props {
  active?: boolean;
  tariffs: Array<any>;
  url: string;
  tType: 'active' | 'past';
  switchAddTariff: Function;
}

const TariffsList = ({
  tariffs,
  intl,
  groupId,
  breadcrumbs,
  url,
  tType,
  switchAddTariff,
}: Props & BreadcrumbsProps & InjectIntlProps) => {
  const [expanded, setExpanded] = useState({});

  const filteredTariffs = tariffs.filter(t => (tType === 'active' ? !t.lastDate : !!t.lastDate));

  const prefix = 'admin.tariffs';

  const data = orderBy(filteredTariffs, t => new Date(t.beginDate), 'desc').map(t => ({
    ...t,
    beginDate: moment(t.beginDate).toDate(),
    lastDate: t.lastDate ? moment(t.lastDate).toDate() : t.lastDate,
    basepriceCentsPerMonth: {
      Display: (
        Intl.NumberFormat(intl.locale, {minimumFractionDigits: 4}).format(+(t.basepriceCentsPerMonth/100).toFixed(4)) + ' €'
      ),
      value: t.basepriceCentsPerMonth,
    },
    energypriceCentsPerKwh: {
      Display: (
        Intl.NumberFormat(intl.locale, {minimumFractionDigits: 4}).format(+(t.energypriceCentsPerKwh).toFixed(4)) + ' Cent'
      ),
      value: t.energypriceCentsPerKwh,
    },
  }));

  const columns = [
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableName` })} />,
      accessor: 'name',
      className: 'cy-name',
    },
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableBeginDate` })} />,
      accessor: 'beginDate',
      className: 'cy-begin-date',
      Cell: ({ value }) => moment(value).format('DD.MM.YYYY'),
    },
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableBasepriceCentsPerMonth` })} />
      ),
      accessor: 'basepriceCentsPerMonth',
      filterMethod: TableParts.filters.filterByValue, 
      sortMethod: TableParts.sort.sortByValue,
      Cell: ({ value: { Display } }) => Display,
    },
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableEnergypriceCentsPerKwh` })} />
      ),
      accessor: 'energypriceCentsPerKwh',
      filterMethod: TableParts.filters.filterByValue,
      sortMethod: TableParts.sort.sortByValue,
      Cell: ({ value: { Display } }) => Display,
    },
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.numberOfContracts` })} />
      ),
      accessor: 'numberOfContracts',
      Cell: ({ value }) => value || 0,
    },
  ];

  if (tType === 'past') {
    columns.splice(2, 0, {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableLastDate` })} />,
      accessor: 'lastDate',
      Cell: ({ value }) => (value ? moment(value).format('DD.MM.YYYY') : ''),
    });
  }

  return (
    <CenterContent>
      <PageTitle
        {...{
          breadcrumbs: breadcrumbs.concat([
            { id: '-----', title: intl.formatMessage({ id: 'admin.breadcrumbs.tariffs' }), link: null },
          ]),
          title: intl.formatMessage({ id: `${prefix}.backTariffs` }),
        }}
      />
      <SubNav>
        <NavLink to={`${url}/active`} exact className="nav-link">
          <FormattedMessage id={`${prefix}.navActiveTariffs`} />
        </NavLink>
        <NavLink to={`${url}/past`} exact className="nav-link">
          <FormattedMessage id={`${prefix}.navPastTariffs`} />
        </NavLink>
      </SubNav>
      <div className="p-0">
        <SpanClick onClick={switchAddTariff} className="float-right" data-cy="add tariff CTA">
          <FormattedMessage id="admin.tariffs.addNew" /> <i className="fa fa-plus-circle" />
        </SpanClick>
        <br />
        <ReactTableSorted
          {...{
            data,
            columns,
            expanded,
            uiSortPath: `groups.${groupId}.tariffs`,
            getTrProps: (_state, rowInfo) => ({
              onClick: (_event, handleOriginal) => {
                setExpanded({ [rowInfo.viewIndex]: !expanded[rowInfo.viewIndex] });
                handleOriginal && handleOriginal();
              },
            }),
            SubComponent: ({ original }) => (
              <NestedDetails
                {...{
                  groupId,
                  tariffId: original.id,
                }}
              />
            ),
          }}
        />
      </div>
    </CenterContent>
  );
};

export default injectIntl(TariffsList);
