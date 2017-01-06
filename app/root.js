import React from 'react';
import { BrowserRouter, Match, Miss, Redirect } from 'react-router';
import { connect } from 'react-redux';

import MainNavBar from './components/main_nav_bar';
import Sidebar from './components/sidebar';
import SignIn from './components/sign_in';

import Profile from './pages/profile';
import Groups from './groups';

import './root.scss';

const Root = ({ token }) => (
  <BrowserRouter>
    <div>
      <MainNavBar signedIn={ !!token } />
      { token ?
        <div className="container-fluid">
          <Sidebar />
          <div className='col-sm-9 offset-sm-3 col-md-10 offset-md-2 main'>
            <div>
              <Match exactly pattern="/" component={ Profile } />
              <Match pattern="/profile/:id" component={ Profile } />
              <Match pattern="/groups" component={ Groups.Container } />
            </div>
          </div>
        </div> :
        <div className="container-fluid">
          <Match exactly pattern="/" component={ SignIn } />
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
