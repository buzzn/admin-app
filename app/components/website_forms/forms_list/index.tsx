import * as React from 'react';
import moment from 'moment';
import { injectIntl, InjectIntlProps } from 'react-intl';
import get from 'lodash/get';
import compact from 'lodash/compact';
import { tableParts as TableParts } from 'react_table_config';
import ReactTableSorted from 'components/react_table_sorted';
import { BreadcrumbsProps } from 'components/breadcrumbs';
import { CenterContent } from 'components/style';

interface Props {
  websiteForms: Array<{ [key: string]: any }>;
  changeProcessed: Function;
  exportForms: Function;
}

class FormsList extends React.Component<Props & InjectIntlProps & BreadcrumbsProps> {
  state = { selected: {} };

  changeSelected = (form) => {
    const { selected } = this.state;
    this.setState({ selected: { ...selected, [form.id]: selected[form.id] ? null : form } });
  };

  render() {
    const { websiteForms, changeProcessed, exportForms, history, url, intl } = this.props;
    const { selected } = this.state;

    const prefix = 'admin.websiteForms';

    const data = websiteForms.map(f => ({
      ...f,
      linkForm: `${url}/${f.id}`,
    }));

    const columns = [
      {
        Header: () => (
          <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableOverview` })} />
        ),
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
              <b>{contact.email}</b>
            </span>
          );
        },
      },
      {
        Header: () => (
          <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableCreatedAt` })} />
        ),
        accessor: 'createdAt',
        Cell: ({ value }) => moment(value).format('DD.MM.YYYY - HH:mm:ss'),
      },
      {
        Header: () => (
          <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableProcessed` })} />
        ),
        accessor: 'processed',
        style: { cursor: 'pointer' },
        width: 80,
        Cell: ({ value }) => <i className={`fa fa-2x fa-${value ? 'check' : 'times'}`} />,
      },
      {
        sortable: false,
        width: 80,
        accessor: 'exportButton',
        Cell: ({ original }) => <button onClick={() => exportForms([original])}>Export</button>,
      },
      {
        Header: () => <button onClick={() => exportForms(compact(Object.values(selected)))}>Export selected</button>,
        sortable: false,
        width: 100,
        accessor: 'selectCheckbox',
        Cell: ({ original }) => (
          <input
            type="checkbox"
            defaultChecked={!!selected[original.id]}
            onClick={() => this.changeSelected(original)}
          />
        ),
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
                      changeProcessed({
                        id: original.id,
                        processed: !original.processed,
                        updatedAt: original.updatedAt,
                      });
                    } else if (!['exportButton', 'selectCheckbox'].includes(column.id)) {
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
  }
}

export default injectIntl(FormsList);
