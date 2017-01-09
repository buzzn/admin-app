import React from 'react';
import { BrowserRouter, Match, Miss, Redirect } from 'react-router';
import { connect } from 'react-redux';

import MainNavBarConnected from './components/main_nav_bar';
import Sidebar from './components/sidebar';
import SignInContainer from './components/sign_in';
import Home from './components/home';
import Groups from './groups';
import UserContainer from './components/user';

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
              <Match pattern="/my-profile" component={ UserContainer } />
              <Match pattern="/profile/:id" component={ UserContainer } />
              <Match pattern="/groups" component={ Groups.Container } />
            </div>
          </div>
        </div> :
        <div className="container-fluid">
          <Match exactly pattern="/" component={ SignInContainer } />
          <Match pattern="*" render={ () => (<Redirect to="/" />) } />
        </div>
      }
      <Miss render={ () => (<div>404</div>) } />
    </div>
  </BrowserRouter>
);

function mapStateToProps(state) {
  return { token: state.auth.token };
}

export default connect(mapStateToProps)(Root);
