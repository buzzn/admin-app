import React from 'react';
import { BrowserRouter, Match, Miss } from 'react-router';
import { connect } from 'react-redux';

import MainNavBar from './components/main_nav_bar';
import Profile from './components/profile';
import Sidebar from './components/Sidebar';

import './root.scss';

const Root = ({ token }) => (
  <BrowserRouter>
    <div>
      <MainNavBar signedIn={ !!token } />
      <div className="container-fluid">
        <Sidebar />
        <div className='col-sm-9 offset-sm-3 col-md-10 offset-md-2 main'>
          { token ?
            <div>
              <Match exactly pattern="/" component={ Profile } />
              <Match pattern="/profile/:id" component={ Profile } />
            </div> :
            <Match exactly pattern="/" render={ () => (<div>Please, log in to use this app.</div>) } />
          }
          <Miss render={ () => (<div>404</div>) } />
        </div>
      </div>
    </div>
  </BrowserRouter>
);

function mapStateToProps(state) {
  return { token: state.auth.token };
}

export default connect(mapStateToProps)(Root);
