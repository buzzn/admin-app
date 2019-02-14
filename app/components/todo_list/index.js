import * as React from 'react';
import { connect } from 'react-redux';
import { Nav, NavLink, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import PureAdmin from 'components/pure_admin';

import './style.scss';

function hashCode(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;

  return h.toString(16);
}

const TodoList = ({ devMode, incompleteScreen, state }) => (
  <div className={`todo-list-block ${devMode ? '' : 'under-construction'}`}>
    {!!incompleteScreen.length && (
      <div className="incompleteness">
        {incompleteScreen.map((incompleteness, idx) => (
          <div key={`${incompleteness.title}${idx}`} className="incompleteness-item">
            <div className="incompleteness-title">
              <FormattedMessage id={incompleteness.title} />
            </div>
            <div className="incompleteness-errors">{incompleteness.errors.join(' ,')}</div>
          </div>
        ))}
      </div>
    )}
    {devMode ? (
      <div style={{ height: '800px' }}>
        <PureAdmin {...{ hash: hashCode(JSON.stringify(state)) }} />
      </div>
    ) : (
      <React.Fragment>
        <Nav className="sub-nav">
          <NavLink className="active">TODOS</NavLink>
          <NavLink>Finished</NavLink>
        </Nav>
        <div className="todo-list-block">
          <p className="h5 todo-header">Today</p>
          <div className="todo-list">
            <div className="todo-item">
              <i className="fa fa-check" />
              Register 1000 meter readings
            </div>
            <div className="todo-item">
              <i className="fa fa-check active" />
              Sign contracts
            </div>
            <div className="todo-item">
              <i className="fa fa-check active" />
              Call
            </div>
          </div>
        </div>
        <div className="todo-list-block">
          <p className="h5 todo-header">Today</p>
          <div className="todo-list">
            <div className="todo-item">
              <i className="fa fa-check" />
              Register 1000 meter readings
            </div>
            <div className="todo-item">
              <i className="fa fa-check active" />
              Sign contracts
            </div>
            <div className="todo-item">
              <i className="fa fa-check active" />
              Call
            </div>
          </div>
        </div>
        <div className="todo-list-block">
          <p className="h5 todo-header">Today</p>
          <div className="todo-list">
            <div className="todo-item">
              <i className="fa fa-check" />
              Register 1000 meter readings
            </div>
            <div className="todo-item">
              <i className="fa fa-check active" />
              Sign contracts
            </div>
            <div className="todo-item">
              <i className="fa fa-check active" />
              Call
            </div>
          </div>
        </div>
      </React.Fragment>
    )}
  </div>
);

function mapStateToProps(state) {
  return { incompleteScreen: state.app.incompleteScreen, state };
}

export default connect(
  mapStateToProps,
  {},
)(TodoList);
