import React from 'react';
import { Route } from 'react-router-dom';

const RowRoute = (props) => {
  if (props.hide) return (<div />);

  return (
    <div className={ `row ${props.rowClass}` }>
      <div className="col-12">
        <Route {...props} />
      </div>
    </div>
  );
};

export default RowRoute;
