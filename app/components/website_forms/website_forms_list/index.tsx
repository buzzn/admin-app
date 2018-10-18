import * as React from 'react';
// import moment from 'moment';
import { injectIntl, InjectIntlProps } from 'react-intl';
import { tableParts as TableParts } from 'react_table_config';
import ReactTableSorted from 'components/react_table_sorted';
import { BreadcrumbsProps } from 'components/breadcrumbs';
import { CenterContent } from 'components/style';

interface Props {
  websiteForms: Array<{ [key: string]: any }>;
}

const WebsiteFormsList = ({
  websiteForms,
  history,
  url,
  intl,
}: Props & InjectIntlProps & BreadcrumbsProps) => {
  const prefix = 'admin.websiteForms';

  const data = websiteForms.map(f => ({...f, linkForm: `${url}/${f.id}`}));

  const columns = [
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableCreatedAt` })} />
      ),
      accessor: 'createdAt',
    },
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableProcessed` })} />
      ),
      accessor: 'processed',
    },
  ];

  return (
    <React.Fragment>
      <CenterContent>
        <div className="p-0">
          <ReactTableSorted
            {...{
              data,
              columns,
              uiSortPath: `websiteForms`,
              getTrProps: (_state, rowInfo) => ({
                onClick: (_e, handleoriginal) => {
                  history.push(rowInfo.original.linkForm);
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

export default injectIntl(WebsiteFormsList);
