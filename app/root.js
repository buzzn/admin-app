import React from 'react';
import { BrowserRouter, Match, Miss } from 'react-router';
import { connect } from 'react-redux';
import MainNavBar from './components/main_nav_bar';
import Profile from './components/profile';

const Root = ({ token }) => (
  <BrowserRouter>
    <div>
      <MainNavBar signedIn={ !!token } />
      <div className="container">
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
  </BrowserRouter>
);

function mapStateToProps(state) {
  return { token: state.auth.token };
}

export default connect(mapStateToProps)(Root);
