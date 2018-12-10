import * as React from 'react';
import moment from 'moment';
import { injectIntl, InjectIntlProps } from 'react-intl';
import get from 'lodash/get';
import compact from 'lodash/compact';
import { tableParts as TableParts } from 'react_table_config';
import ReactTableSorted from 'components/react_table_sorted';
import { BreadcrumbsProps } from 'components/breadcrumbs';
import { CenterContent } from 'components/style';
import FormIdCell from './form_id_cell';

interface Props {
  websiteForms: Array<{ [key: string]: any }>;
  changeProcessed: Function;
  changeFormId: Function;
  exportForms: Function;
  changeStartingId: Function;
  startingId: number;
  idError: string;
}

class FormsList extends React.Component<Props & InjectIntlProps & BreadcrumbsProps> {
  state = { selected: {} };

  changeSelected = (form) => {
    const { selected } = this.state;
    this.setState({ selected: { ...selected, [form.id]: selected[form.id] ? null : form } });
  };

  render() {
    const {
      websiteForms,
      changeProcessed,
      changeFormId,
      changeStartingId,
      startingId,
      idError,
      exportForms,
      history,
      url,
      intl,
    } = this.props;
    const { selected } = this.state;

    const prefix = 'admin.websiteForms';

    const data = websiteForms.map(f => ({
      ...f,
      overview: (() => {
        const type = get(f.formContent, 'calculator.customerType');
        const contact = type === 'person'
          ? get(f.formContent, 'personalInfo.person', {})
          : get(f.formContent, 'personalInfo.organization.contractingParty', {});
        return {
          Display: (
            <span>
              <b>{type}:</b> {contact.prefix}{' '}
              {['herr', 'frau'].includes(contact.prefix) ? `${contact.firstName} ${contact.lastName}` : contact.name}{' '}
              <b>{contact.email}</b>
            </span>
          ),
          value: `${type} ${contact.prefix} ${
            ['herr', 'frau'].includes(contact.prefix) ? `${contact.firstName} ${contact.lastName}` : contact.name
          } ${contact.email}`,
        };
      })(),
      createdAtFormatted: moment(f.createdAt).format('DD.MM.YYYY - HH:mm:ss'),
      linkForm: `${url}/${f.id}`,
    }));

    const columns = [
      {
        Header: () => (
          <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableOverview` })} />
        ),
        accessor: 'overview',
        filterMethod: TableParts.filters.filterByValue,
        sortMethod: TableParts.sort.sortByValue,
        Cell: ({ value: { Display } }) => Display,
      },
      {
        Header: () => (
          <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableCreatedAt` })} />
        ),
        accessor: 'createdAtFormatted',
      },
      {
        Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.formId` })} />,
        accessor: 'comment',
      },
      {
        Header: () => (
          <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableProcessed` })} />
        ),
        filterable: false,
        accessor: 'processed',
        style: { cursor: 'pointer' },
        width: 80,
        Cell: ({ value }) => <i className={`fa fa-2x fa-${value ? 'check' : 'times'}`} />,
      },
      {
        sortable: false,
        filterable: false,
        width: 80,
        accessor: 'exportButton',
        Cell: ({ original }) => <button onClick={() => exportForms([original])}>Export</button>,
      },
      {
        Header: () => <button onClick={() => exportForms(compact(Object.values(selected)))}>Export selected</button>,
        sortable: false,
        filterable: false,
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
      {
        sortable: false,
        filterable: false,
        width: 200,
        accessor: 'changeFormId',
        Cell: ({ original }) => <FormIdCell {...{ original, changeFormId }} />,
      },
    ];

    return (
      <React.Fragment>
        <CenterContent>
          <div className="p-0">
            <input type="number" onChange={changeStartingId} value={startingId} /> /1
            <br />
            {!!idError && <span>{idError}</span>}
            <ReactTableSorted
              {...{
                filterable: true,
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
                        comment: original.comment,
                      });
                    } else if (!['exportButton', 'selectCheckbox', 'changeFormId'].includes(column.id)) {
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
