import React from 'react';
import { BrowserRouter, Match, Miss } from 'react-router';
import { connect } from 'react-redux';

import MainNavBar from './components/main_nav_bar';
import Sidebar    from './components/Sidebar';

import Home     from './pages/home';
import Profiles from './pages/profiles';
import Profile  from './pages/profile';
import Groups   from './pages/groups';
import Group    from './pages/group';

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
              <Match exactly pattern="/"              component={ Home } />
              <Match         pattern="/profiles"      component={ Profiles } />
              <Match         pattern="/profile/:id"   component={ Profile } />
              <Match         pattern="/groups"        component={ Groups } />
              <Match         pattern="/group/:id"     component={ Group } />
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
