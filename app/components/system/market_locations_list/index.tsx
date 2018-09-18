import * as React from 'react';
import ReactTableSorted from 'components/react_table_sorted';
import { injectIntl, InjectIntlProps, FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { tableParts as TableParts } from 'react_table_config';
import PageTitle from 'components/page_title';
import { BreadcrumbsProps } from 'components/breadcrumbs';
import { CenterContent, SubNav } from 'components/style';

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
}: Props & BreadcrumbsProps & InjectIntlProps) => {
  const prefix = 'admin.marketLocations';

  const data = marketLocations.filter(m => m.kind === maloType).map(m => ({
    ...m,
    label: intl.formatMessage({ id: `admin.registers.${m.register.label}` }),
    meterProductSerialnumber: m.register.meter.productSerialnumber,
    linkMeter: `${url}/meters/${m.register.meter.id}`,
    linkMarketLocation: `${url}/${m.id}`,
  }));

  const columns = [
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableName` })} />,
      accessor: 'name',
      style: {
        cursor: 'pointer',
        textDecoration: 'underline',
      },
    },
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: 'admin.meters.tableProductSerialnumber' })} />
      ),
      accessor: 'meterProductSerialnumber',
      style: {
        cursor: 'pointer',
        textDecoration: 'underline',
      },
    },
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: 'admin.registers.tableLabel' })} />
      ),
      accessor: 'label',
    },
  ];

  return (
    <React.Fragment>
      <PageTitle
        {...{
          breadcrumbs: breadcrumbs.concat([
            { id: '-----', title: intl.formatMessage({ id: 'admin.breadcrumbs.marketLocations' }) },
          ]),
          title: intl.formatMessage({ id: 'admin.breadcrumbs.marketLocations' }),
        }}
      />
      <CenterContent>
        <SubNav>
          <NavLink to={`${url}/consumption`} exact className="nav-link">
            <FormattedMessage id="admin.marketLocations.navConsumption" />
          </NavLink>
          <NavLink to={`${url}/production`} exact className="nav-link">
            <FormattedMessage id="admin.marketLocations.navProduction" />
          </NavLink>
          <NavLink to={`${url}/system`} exact className="nav-link">
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
                  if (column.id === 'meterProductSerialnumber') history.push(rowInfo.original.linkMeter);
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
