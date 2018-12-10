import * as React from 'react';
import moment from 'moment';
import { injectIntl, InjectIntlProps, FormattedMessage } from 'react-intl';
import { tableParts as TableParts } from 'react_table_config';
import ReactTableSorted from 'components/react_table_sorted';
import PageTitle from 'components/page_title';
import { BreadcrumbsProps } from 'components/breadcrumbs';
import { CenterContent, SpanClick } from 'components/style';

interface Props {
  switchAddDevice: Function;
  devices: Array<{ [key: string]: any }>;
  groupId: string;
  url: string;
  history: any;
}

const DevicesList = ({
  switchAddDevice,
  devices,
  intl,
  groupId,
  url,
  history,
  breadcrumbs,
}: Props & InjectIntlProps & BreadcrumbsProps) => {
  const prefix = 'admin.devices';

  const data = devices.map(d => ({ ...d, status: '? no status ?', linkDevice: `${url}/${d.id}` }));

  const columns = [
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tablePrimaryEnergy` })} />
      ),
      accessor: 'primaryEnergy',
      Cell: TableParts.components.deviceEnergyCell,
    },
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableManufacturer` })} />
      ),
      accessor: 'manufacturer',
      className: 'cy-manufacturer',
    },
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableModel` })} />,
      accessor: 'model',
      className: 'cy-model',
    },
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableName` })} />,
      accessor: 'name',
      className: 'cy-name',
    },
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableKwPeak` })} />,
      accessor: 'kwPeak',
      className: 'cy-kwPeak',
    },
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableKwhPerAnnum` })} />
      ),
      accessor: 'kwhPerAnnum',
      className: 'cy-kwhPerAnnum',
    },
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableCommissioning` })} />
      ),
      accessor: 'commissioning',
      className: 'cy-commissioning',
      Cell: ({ value }) => moment(value).format('DD.MM.YYYY'),
    },
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableLaw` })} />,
      accessor: 'law',
      className: 'cy-law',
    },
  ];

  return (
    <React.Fragment>
      <PageTitle
        {...{
          breadcrumbs: breadcrumbs.concat([
            { id: '-----', title: intl.formatMessage({ id: 'admin.breadcrumbs.devices' }) },
          ]),
          title: intl.formatMessage({ id: 'admin.breadcrumbs.devices' }),
        }}
      />
      <CenterContent>
        <div className="p-0">
          <SpanClick onClick={switchAddDevice} className="float-right" data-cy="add device CTA">
            <FormattedMessage id="admin.devices.addNew" /> <i className="fa fa-plus-circle" />
          </SpanClick>
          <br />
          <ReactTableSorted
            {...{
              data,
              columns,
              uiSortPath: `groups.${groupId}.devices`,
              getTrProps: (_state, rowInfo) => ({
                onClick: (_e, handleoriginal) => {
                  history.push(rowInfo.original.linkDevice);
                  if (handleoriginal) handleoriginal();
                },
              }),
            }}
          />
        </div>
      </CenterContent>
    </React.Fragment>
  );
};

export default injectIntl(DevicesList);
