import * as React from 'react';
import ReactTableSorted from 'components/react_table_sorted';
import { injectIntl, InjectIntlProps, FormattedMessage } from 'react-intl';
import { NavLink, Link } from 'react-router-dom';

import { tableParts as TableParts } from 'react_table_config';
import PageTitle from 'components/page_title';
import { BreadcrumbsProps } from 'components/breadcrumbs';
import { CenterContent, SubNav, SubNavAddLink } from 'components/style';
import MetersList from '../meters_list';

interface Props {
  marketLocations: Array<any>;
  url: string;
  history: any;
  groupId: string;
  maloType: 'consumption' | 'production' | 'system' | 'all-meters';
}

const MarketLocationsList = ({
  marketLocations,
  url,
  history,
  intl,
  groupId,
  breadcrumbs,
  maloType,
  duplicateMeter,
  handleUpdateDiscovergyMeter,
}: Props & BreadcrumbsProps & InjectIntlProps) => {
  const prefix = 'admin.marketLocations';
  const data = marketLocations
    .filter(m => (maloType === 'system' ? ['system', 'grid_consumption', 'grid_feeding'].includes(m.kind) : m.kind === maloType))
    .flatMap((m) => {
      if (!m.registers.array || !m.registers.array.length) {
        return {
          ...m,
          labelIntl: intl.formatMessage({ id: `admin.registers.${m.label}` }),
          meterProductSerialnumber: '',
          linkMeter: null,
          linkMarketLocation: `${url}/${m.id}`,
        };
      }
      return m.registers.array.map(r => ({
        ...m,
        labelIntl: intl.formatMessage({ id: `admin.registers.${m.label}` }),
        meterProductSerialnumber: r.meter.productSerialnumber,
        meter: r.meter,
        linkMeter: `${url}/meters/${r.meter.id}`,
        linkMarketLocation: `${url}/${m.id}`,
      }));
    });

  const columns = [
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: 'admin.meters.tableProductSerialnumber' })} />
      ),
      accessor: 'meterProductSerialnumber',
      className: 'cy-meter-serial',
      filterable: true,
      filterMethod: (filter, row) => {
        const id = filter.pivotId || filter.id;
        return row[id] !== undefined
          ? String(row[id])
            .toLowerCase()
            .includes(filter.value.toLowerCase())
          : true;
      },
      style: {
        cursor: 'pointer',
        textDecoration: 'underline',
      },
      Cell: ({original}) => original.meterProductSerialnumber,
    },
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableName` })} />,
      accessor: 'name',
      className: 'cy-malo-name',
      filterable: true,
      filterMethod: (filter, row) => {
        const id = filter.pivotId || filter.id;
        return row[id] !== undefined
          ? String(row[id])
            .toLowerCase()
            .includes(filter.value.toLowerCase())
          : true;
      },
      style: {
        cursor: 'pointer',
        textDecoration: 'underline',
      },
    },
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: 'admin.registers.tableLabel' })} />
      ),
      accessor: 'labelIntl',
      className: 'cy-label',
    },
    {
      Header: '',
      width: 40,
      Cell: ({ original }) => (original.registers && original.registers.array.length
        ? TableParts.components.iconCell({
          icon: 'copy',
          action: () => duplicateMeter(original),
          tooltip: {
            id: `clone-meter-${original.id}`,
            text: 'Zähler klonen',
          },
        })
        : false),
    },
  ];

  return (
    <React.Fragment>
      <PageTitle
        {...{
          breadcrumbs: breadcrumbs.concat([
            {
              id: '-----',
              title: intl.formatMessage({ id: 'admin.breadcrumbs.marketLocations' }),
            },
          ]),
          title: intl.formatMessage({ id: 'admin.breadcrumbs.marketLocations' }),
        }}
      />
      <CenterContent>
        <SubNavAddLink>
          <Link to={`${url}/add-meter`} data-cy="add malo CTA">
            <FormattedMessage id="admin.meters.addNew" /> <i className="fa fa-plus-circle" />
          </Link>
        </SubNavAddLink>
        <SubNav>
          <NavLink to={`${url}/consumption`} exact className="nav-link" data-cy="consumption tab">
            <FormattedMessage id="admin.marketLocations.navConsumption" />
          </NavLink>
          <NavLink to={`${url}/production`} exact className="nav-link" data-cy="production tab">
            <FormattedMessage id="admin.marketLocations.navProduction" />
          </NavLink>
          <NavLink to={`${url}/system`} exact className="nav-link" data-cy="system tab">
            <FormattedMessage id="admin.marketLocations.navSystem" />
          </NavLink>
          <NavLink to={`${url}/all-meters`} exact className="nav-link" data-cy="all meters tab">
            <FormattedMessage id="admin.marketLocations.navAllMeters" />
          </NavLink>
        </SubNav>
        <div className="p-0">
          {maloType === 'all-meters' ? (
            <MetersList {...{ groupId, url }} />
          ) : (
            <ReactTableSorted
              {...{
                data,
                columns,
                collapseOnDataChange: false,
                getTdProps: (_state, rowInfo, column) => ({
                  onClick: (_e, handleOriginal) => {
                    if (column.id === 'name') history.push(rowInfo.original.linkMarketLocation);
                    if (column.id === 'meterProductSerialnumber' && rowInfo.original.linkMeter) history.push(rowInfo.original.linkMeter);
                    if (handleOriginal) handleOriginal();
                  },
                }),
                uiSortPath: `groups.${groupId}.marketLocations`,
              }}
            />
          )}
        </div>
        <button className="btn btn-secondary" onClick={() => handleUpdateDiscovergyMeter()}>
          <FormattedMessage id="admin.meters.updateDiscovergyMeter"/> <i className="fa fa-plus-circle" />
        </button>
      </CenterContent>
    </React.Fragment>
  );
};

export default injectIntl(MarketLocationsList);
