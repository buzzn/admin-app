import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import truncate from 'lodash/truncate';
import moment from 'moment';
import { Col } from 'reactstrap';

import CommentsModule from 'comments';
import Loading from 'components/loading';
import ReactTableSorted from 'components/react_table_sorted';
import { tableParts as TableParts } from 'react_table_config';
import { SpanClick } from 'components/style';

import AddComment from './add_coment';
import NestedDetails from './nested_details';

import { CommentsHeader } from './style';

const Comments = ({
  ids,
  intl,
  comments,
  loading,
  loadComments,
  setComments,
  addComment,
  updateComment,
  deleteComment,
  validationRules,
}) => {
  useEffect(() => {
    if (Object.values(ids).findIndex(v => v === undefined || v === '' || v === null) === -1) loadComments(ids);
    return () => setComments({ _status: null, array: [] });
  }, [...Object.values(ids)]);

  const [isOpen, setIsOpen] = useState(false);

  if (loading || comments._status === null) return <Loading minHeight={40} />;

  const prefix = 'admin.comments';

  const columns = [
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableContent` })} />,
      accessor: 'content',
      Cell: ({ value }) => truncate(value, { length: 40, separator: ' ' }),
    },
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableAuthor` })} />,
      accessor: 'author',
      width: 150,
      Cell: ({ value }) => truncate(value, { length: 20, separator: ' ' }),
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
      expander: true,
      Expander: row => (
        <div>{row.isExpanded ? <i className="fa fa-chevron-up" /> : <i className="fa fa-chevron-down" />}</div>
      ),
      style: { color: '#bdbdbd' },
    },
  ];

  return (
    <Col xs={12}>
      <CommentsHeader>Comments</CommentsHeader>
      <div className="p-0">
        <SpanClick onClick={() => setIsOpen(true)} className="float-right" data-cy="add comment CTA">
          <FormattedMessage id={`${prefix}.addNew`} /> <i className="fa fa-plus-circle" />
        </SpanClick>
        <br />
        <ReactTableSorted
          {...{
            collapseOnDataChange: false,
            columns,
            data: comments.array,
            SubComponent: ({ original: comment }) => (
              <NestedDetails
                {...{
                  form: `editComment${comment.id}`,
                  initialValues: comment,
                  validationRules: validationRules.updateComment,
                  updateComment: params => updateComment({ ...params, ids: { ...ids, commentId: comment.id } }),
                  deleteComment: () => deleteComment({ ids: { ...ids, commentId: comment.id } }),
                }}
              />
            ),
            uiSortPath: 'comments',
          }}
        />
        <AddComment
          {...{
            isOpen,
            addComment: params => addComment({ ...params, ids }),
            toggle: () => setIsOpen(!isOpen),
            validationRules: validationRules.createComment,
          }}
        />
      </div>
    </Col>
  );
};

const mapStateToProps = state => ({
  comments: state.comments.comments,
  loading: state.comments.loadingComments,
  validationRules: state.comments.validationRules,
});

export default connect(
  mapStateToProps,
  {
    loadComments: CommentsModule.actions.loadComments,
    setComments: CommentsModule.actions.setComments,
    addComment: CommentsModule.actions.addComment,
    updateComment: CommentsModule.actions.updateComment,
    deleteComment: CommentsModule.actions.deleteComment,
  },
)(injectIntl(Comments));
