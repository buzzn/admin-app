import React from 'react';
import { BrowserRouter, Link, Match, Miss } from 'react-router';

import Sidebar from './components/sidebar'
import Navbar from './components/navbar'

import Home from './components/home'
import Groups from './components/groups'

import './root.scss';

const Root = () => (
  <BrowserRouter>
    <div>
      <Navbar />
      <div className="container-fluid">
        <Sidebar />
        <div className='col-sm-9 offset-sm-3 col-md-10 offset-md-2 main'>
          <Match exactly pattern='/' component={Home}/>
          <Match pattern='/groups' component={Groups}/>
        </div>
      </div>
    </div>
  </BrowserRouter>
);

export default Root
