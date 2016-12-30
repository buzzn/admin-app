import React, { Component } from 'react'

import { Link } from 'react-router'

import './style.scss';

class Sidebar extends Component {
  render() {
    return (
      <div className="col-sm-3 col-md-2 sidebar">
        <ul className="nav nav-sidebar">
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/groups'>Groups</Link></li>
          <li><Link to='/profiles'>Profiles</Link></li>
          <li><Link to='/organizations'>Organizations</Link></li>
          <li><Link to='/meters'>Meters</Link></li>
          <li><Link to='/contracts'>Contracts</Link></li>
        </ul>
      </div>
    );
  }
}

export default Sidebar;
