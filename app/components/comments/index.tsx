import React, { useState } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import truncate from 'lodash/truncate';
import moment from 'moment';
import { Col } from 'reactstrap';

import ReactTableSorted from 'components/react_table_sorted';
import { tableParts as TableParts } from 'react_table_config';
import { SpanClick } from 'components/style';

import AddComment from './add_coment';

const Comments = ({
  comments = [],
  addComment,
  intl,
  // updateComment,
  deleteComment,
  createRules,
  // updateRules,
}) => {
  const prefix = 'admin.comments';
  const columns = [
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableContent` })} />,
      accessor: 'content',
      Cell: ({ value }) => truncate(value, { length: 60, separator: ' ' }),
    },
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableCreatedAt` })} />,
      accessor: 'createdAt',
      width: 150,
      Cell: ({ value }) => moment(value).format('DD.MM.YYYY'),
    },
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableUpdatedAt` })} />,
      accessor: 'updatedAt',
      width: 150,
      Cell: ({ value }) => moment(value).format('DD.MM.YYYY'),
    },
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableActions` })} />,
      accessor: 'actions',
      width: 40,
      Cell: ({ original }) => (original.deletable ? (
          <TableParts.components.iconCell
            {...{
              icon: 'remove',
              action: () => confirm('Are you sure?') && deleteComment({ commentId: original.id }),
              tooltip: { id: `comment-${original.id}`, text: 'delete comment' },
            }}
          />
      ) : (
        ''
      )),
    },
  ];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Col xs={12}>
      <div className="p-0">
        <SpanClick onClick={() => setIsOpen(true)} className="float-right" data-cy="add comment CTA">
          <FormattedMessage id={`${prefix}.addNew`} /> <i className="fa fa-plus-circle" />
        </SpanClick>
        <br />
        <ReactTableSorted {...{ columns, data: comments, uiSortPath: 'comments' }} />
        <AddComment {...{ isOpen, addComment, toggle: () => setIsOpen(!isOpen), validationRules: createRules }} />
      </div>
    </Col>
  );
};

export default injectIntl(Comments);
