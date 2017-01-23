import React from 'react';
import { BrowserRouter, Match, Miss } from 'react-router';
import { connect } from 'react-redux';

import MainNavBarConnected from './components/main_nav_bar';
import Sidebar from './components/sidebar';
import SignInContainer from './components/sign_in';
import Home from './components/home';
import Groups from './groups';
import Meters from './meters';
import Users from './users';

import './root.scss';

const Root = ({ token }) => (
  <BrowserRouter>
    <div>
      <MainNavBarConnected signedIn={ !!token } />
      { token ?
        <div className="container-fluid">
          <Sidebar />
          <div className='col-sm-9 offset-sm-3 col-md-10 offset-md-2 main'>
            <div>
              <Match exactly pattern="/" component={ Home } />
              <Match pattern="/groups" component={ Groups.Container } />
              <Match pattern="/meters" component={ Meters.Container } />
              <Match pattern="/users" component={ Users.Container }/>
              <Miss render={ () => (<div>404</div>) } />
            </div>
          </div>
        </div> :
        <div className="container-fluid">
          <Match pattern="*" component={ SignInContainer } />
        </div>
      }
    </div>
  </BrowserRouter>
);

function mapStateToProps(state) {
  return { token: state.auth.token };
}

export default connect(mapStateToProps)(Root);
