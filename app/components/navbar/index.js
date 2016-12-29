import React, { Component } from 'react';

import { Link } from 'react-router'

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-dark navbar-fixed-top bg-inverse">
        <button type="button" className="navbar-toggler hidden-sm-up" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar" aria-label="Toggle navigation"></button>
        <a className="navbar-brand" href="#">Project name</a>
        <div id="navbar">
          <nav className="nav navbar-nav float-xs-left">
            <a className="nav-item nav-link" href="#">Dashboard</a>
            <a className="nav-item nav-link" href="#">Settings</a>
            <a className="nav-item nav-link" href="#">Profile</a>
            <a className="nav-item nav-link" href="#">Help</a>
          </nav>
        </div>
      </nav>
    );
  }
}

export default Navbar;
