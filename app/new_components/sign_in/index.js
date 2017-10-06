import React from 'react';
import { connect } from 'react-redux';
import Auth from '@buzzn/module_auth';

import './style.scss';

export const SignIn = ({ dispatch, username, password, error }) => (
  <form className="form-signin">
    <h4 className="form-signin-heading">Please sign in</h4>
    { error && error !== 'Sign out' &&
    <div className="alert alert-danger" role="alert">
      <strong>Sign in failed!</strong> Email or password incorrect.
    </div>
    }
    <label htmlFor="inputEmail" className="sr-only">Email address</label>
    <input
      value={ username }
      onChange={ event => dispatch(Auth.actions.setUsername(event.target.value)) }
      type="email"
      id="inputEmail"
      className="form-control"
      placeholder="Email address"
      required
      autoFocus/>
    <label htmlFor="inputPassword" className="sr-only">Password</label>
    <input
      value={ password }
      onChange={ event => dispatch(Auth.actions.setPassword(event.target.value)) }
      type="password"
      id="inputPassword"
      className="form-control"
      placeholder="Password"
      required/>
    <div
      onClick={ () => dispatch(Auth.actions.startAuth(Auth.constants.PASSWORD_FLOW)) }
      className="btn btn-lg btn-primary btn-block">
      Sign in
    </div>
  </form>
);

function mapStateToProps(state) {
  return {
    username: state.auth.username,
    password: state.auth.password,
    error: state.auth.error,
  };
}

export default connect(mapStateToProps)(SignIn);
