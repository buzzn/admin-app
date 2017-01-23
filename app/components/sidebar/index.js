import React, { Component } from 'react'

import { Link } from 'react-router'

import './style.scss';

export default () => (
  <div className="col-sm-3 col-md-2 sidebar">
    <ul className="nav nav-sidebar">
      <li><Link to='/'>Home</Link></li>
      <li><Link to='/groups'>Groups</Link></li>
      <li><Link to='/users'>Users</Link></li>
    </ul>
  </div>
)
