// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import Auth from '@buzzn/module_auth';

import './style.scss';

type Props = {
  setLogin: Function,
  setPassword: Function,
  startAuth: Function,
  username: string,
  password: string,
  error?: string,
};

export const SignIn = ({ setLogin, setPassword, startAuth, username, password, error }: Props) => (
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
      onChange={ event => setLogin(event.target.value) }
      type="email"
      id="inputEmail"
      className="form-control"
      placeholder="Email address"
      required
      autoFocus/>
    <label htmlFor="inputPassword" className="sr-only">Password</label>
    <input
      value={ password }
      onChange={ event => setPassword(event.target.value) }
      type="password"
      id="inputPassword"
      className="form-control"
      placeholder="Password"
      required/>
    <div
      onClick={ () => startAuth() }
      className="btn btn-lg btn-primary btn-block">
      Sign in
    </div>
  </form>
);

function mapStateToProps(state) {
  return {
    login: state.auth.login,
    password: state.auth.password,
    error: state.auth.error,
  };
}

export default connect(mapStateToProps, {
  setLogin: Auth.actions.setLogin,
  setPassword: Auth.actions.setPassword,
  startAuth: Auth.actions.startAuth,
})(SignIn);
