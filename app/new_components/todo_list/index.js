// @flow
import * as React from 'react';
import {
  Nav,
  NavLink,
} from 'reactstrap';

import './style.scss';

const TodoList = () => (
  <div className="todo-list-block">
    <Nav className="sub-nav">
      <NavLink className="active">TODOS</NavLink>
      <NavLink>Finished</NavLink>
    </Nav>
    <div className="todo-list-block">
      <p className="h5 todo-header">Today</p>
      <div className="todo-list">
        <div className="todo-item"><i className="fa fa-check"/>Register 1000 meter readings</div>
        <div className="todo-item"><i className="fa fa-check active"/>Sign contracts</div>
        <div className="todo-item"><i className="fa fa-check active"/>Call</div>
      </div>
    </div>
    <div className="todo-list-block">
      <p className="h5 todo-header">Today</p>
      <div className="todo-list">
        <div className="todo-item"><i className="fa fa-check"/>Register 1000 meter readings</div>
        <div className="todo-item"><i className="fa fa-check active"/>Sign contracts</div>
        <div className="todo-item"><i className="fa fa-check active"/>Call</div>
      </div>
    </div>
    <div className="todo-list-block">
      <p className="h5 todo-header">Today</p>
      <div className="todo-list">
        <div className="todo-item"><i className="fa fa-check"/>Register 1000 meter readings</div>
        <div className="todo-item"><i className="fa fa-check active"/>Sign contracts</div>
        <div className="todo-item"><i className="fa fa-check active"/>Call</div>
      </div>
    </div>
  </div>
);

export default TodoList;
