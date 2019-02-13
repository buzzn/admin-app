import * as React from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { actions } from 'actions';
import { NoData } from './style';

const ReactTableSorted = props => (
  <React.Fragment>
    {props.data.length ? (
      <ReactTable
        {...{
          defaultSorted: props.defaultSorted,
          defaultFiltered: props.defaultFiltered,
          onSortedChange: (sort) => {
            props.setTableSort({ table: props.uiSortPath, sort });
          },
          onFilteredChange: (filter) => {
            props.setTableFilter({ table: props.uiSortPath, filter });
          },
          ...props,
        }}
      />
    ) : (
      <NoData>No data</NoData>
    )}
  </React.Fragment>
);

interface ExtProps {
  uiSortPath: string;
}

// FIXME: put it to the app reducer
interface StatePart {
  app: {
    ui: {
      tableSort: { [key: string]: Array<any> };
      tableFilter: { [key: string]: Array<any> };
    };
  };
}

interface StateProps {
  defaultSorted: Array<any>;
  defaultFiltered: Array<any>;
}

interface DispatchProps {
  setTableSort: Function;
  setTableFilter: Function;
}

function mapStateToProps(state: StatePart, props: ExtProps) {
  return {
    defaultSorted: state.app.ui.tableSort[props.uiSortPath] || [],
    defaultFiltered: state.app.ui.tableFilter[props.uiSortPath] || [],
  };
}

export default connect<StateProps, DispatchProps, ExtProps>(
  mapStateToProps,
  { setTableSort: actions.setTableSort, setTableFilter: actions.setTableFilter },
)(ReactTableSorted);
