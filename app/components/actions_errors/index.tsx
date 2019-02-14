import React from 'react';
import { ErrorsWrapper } from './style';

const ActionError = ({ action, val }) => {
  if (typeof val === 'string') {
    return (
      <React.Fragment>
        <span className="action">{action}</span>: <span className="error">{val}, </span>
      </React.Fragment>
    );
  }
  if (Array.isArray(val)) {
    return (
      <React.Fragment>
        <span className="action">{action}</span>: <span className="error">{val.join(', ')} </span>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <span className="action">{action}</span>:{' '}
      {Object.keys(val).map(action => (
        <ActionError {...{ key: action, action, val: val[action] }} />
      ))}
    </React.Fragment>
  );
};

const ActionsErrors = ({ actions }) => (
    <ErrorsWrapper>
      {Object.keys(actions).map(action => (
        <ActionError {...{ key: action, action, val: actions[action] }} />
      ))}
    </ErrorsWrapper>
);

export default ActionsErrors;
