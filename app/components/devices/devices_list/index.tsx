import * as React from 'react';
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
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableStatus` })} />,
      accessor: 'status',
    },
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.kwPeak` })} />,
      accessor: 'kwPeak',
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
          <SpanClick onClick={switchAddDevice} className="float-right">
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
