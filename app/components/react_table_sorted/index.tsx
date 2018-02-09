import * as React from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { actions } from 'actions';

const ReactTableSorted = props => (
  <ReactTable
    {...{
      defaultSorted: props.defaultSorted,
      onSortedChange: (sort) => {
        props.setTableSort({ table: props.uiSortPath, sort });
      },
      ...props,
    }}
  />
);

interface ExtProps {
  uiSortPath: string;
}

// FIXME: put it to the app reducer
interface StatePart {
  app: {
    ui: {
      tableSort: { [key: string]: Array<any> };
    };
  };
}

interface StateProps {
  defaultSorted: Array<any>;
}

interface DispatchProps {
  setTableSort: Function;
}

function mapStateToProps(state: StatePart, props: ExtProps) {
  return { defaultSorted: state.app.ui.tableSort[props.uiSortPath] || [] };
}

export default connect<StateProps, DispatchProps, ExtProps>(mapStateToProps, { setTableSort: actions.setTableSort })(ReactTableSorted);
