import * as React from 'react';
import moment from 'moment';
import { injectIntl, InjectIntlProps } from 'react-intl';
import get from 'lodash/get';
import { tableParts as TableParts } from 'react_table_config';
import ReactTableSorted from 'components/react_table_sorted';
import { BreadcrumbsProps } from 'components/breadcrumbs';
import { CenterContent } from 'components/style';

interface Props {
  websiteForms: Array<{ [key: string]: any }>;
  updateWebsiteForm: Function;
}

const FormsList = ({
  updateWebsiteForm,
  websiteForms,
  history,
  url,
  intl,
}: Props & InjectIntlProps & BreadcrumbsProps) => {
  const prefix = 'admin.websiteForms';

  const data = websiteForms.map(f => ({
    ...f,
    formContent: { ...f.formContent, createdAt: f.createdAt },
    linkForm: `${url}/${f.id}`,
  }));

  const columns = [
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableOverview` })} />,
      accessor: 'formContent',
      Cell: ({ value }) => {
        const type = get(value, 'calculator.customerType');
        const contact = type === 'person'
          ? get(value, 'personalInfo.person', {})
          : get(value, 'personalInfo.organization.contractingParty', {});
        return (
          <span>
            <b>{type}:</b> {contact.prefix}{' '}
            {['herr', 'frau'].includes(contact.prefix) ? `${contact.firstName} ${contact.lastName}` : contact.name}{' '}
            <b>{contact.email}</b> {moment(value.createdAt).format('DD.MM.YYYY - HH:mm:ss')}
          </span>
        );
      },
    },
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableProcessed` })} />,
      accessor: 'processed',
      style: { cursor: 'pointer' },
      width: 80,
      Cell: ({ value }) => <i className={`fa fa-2x fa-${value ? 'check' : 'times'}`} />,
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
              uiSortPath: 'websiteForms',
              getTdProps: (_state, { original }, column) => ({
                onClick: (_e, handleOriginal) => {
                  if (column.id === 'processed') {
                    new Promise((resolve, reject) => updateWebsiteForm({
                      formId: original.id,
                      params: { processed: !original.processed, updatedAt: original.updatedAt },
                      resolve,
                      reject,
                    }));
                  } else {
                    history.push(original.linkForm);
                  }
                  if (handleOriginal) handleOriginal();
                },
              }),
            }}
          />
        </div>
      </CenterContent>
    </React.Fragment>
  );
};

export default injectIntl(FormsList);
