import * as React from 'react';
import ReactTableSorted from 'components/react_table_sorted';
import { injectIntl, InjectIntlProps, FormattedMessage } from 'react-intl';
import { NavLink, Link } from 'react-router-dom';
import { tableParts as TableParts } from 'react_table_config';
import PageTitle from 'components/page_title';
import { BreadcrumbsProps } from 'components/breadcrumbs';
import { CenterContent, SubNav, SubNavAddLink } from 'components/style';

interface Props {
  marketLocations: Array<any>;
  url: string;
  history: any;
  groupId: string;
  maloType: 'consumption' | 'production' | 'system';
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
}: Props & BreadcrumbsProps & InjectIntlProps) => {
  const prefix = 'admin.marketLocations';

  const data = marketLocations
    .filter(m => m.kind === maloType)
    .map(m => ({
      ...m,
      labelIntl: intl.formatMessage({ id: `admin.registers.${m.label}` }),
      meterProductSerialnumber: m.register ? m.register.meter.productSerialnumber : '',
      linkMeter: m.register ? `${url}/meters/${m.register.meter.id}` : null,
      linkMarketLocation: `${url}/${m.id}`,
    }));

  const columns = [
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: 'admin.meters.tableProductSerialnumber' })} />
      ),
      accessor: 'meterProductSerialnumber',
      className: 'cy-meter-serial',
      style: {
        cursor: 'pointer',
        textDecoration: 'underline',
      },
    },
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableName` })} />,
      accessor: 'name',
      className: 'cy-malo-name',
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
      Cell: ({ original }) =>
        original.register
          ? TableParts.components.iconCell({
              icon: 'copy',
              action: () => duplicateMeter(original),
              tooltip: {
                id: `clone-meter-${original.id}`,
                text: 'Zähler klonen',
              },
            })
          : false,
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
        </SubNav>
        <div className="p-0">
          <ReactTableSorted
            {...{
              data,
              columns,
              collapseOnDataChange: false,
              getTdProps: (_state, rowInfo, column) => ({
                onClick: (_e, handleOriginal) => {
                  if (column.id === 'name') history.push(rowInfo.original.linkMarketLocation);
                  if (column.id === 'meterProductSerialnumber' && rowInfo.original.linkMeter)
                    history.push(rowInfo.original.linkMeter);
                  if (handleOriginal) handleOriginal();
                },
              }),
              uiSortPath: `groups.${groupId}.marketLocations`,
            }}
          />
        </div>
      </CenterContent>
    </React.Fragment>
  );
};

export default injectIntl(MarketLocationsList);
