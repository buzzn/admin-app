import * as React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import Auth from '@buzzn/module_auth';

import './style.scss';

import BuzznLogo from 'images/logo_black.png';

class SignIn extends React.Component {
  signIn(event) {
    event.preventDefault();
    this.props.startAuth();
  }

  render() {
    const { setLogin, setPassword, username, password, error, intl } = this.props;

    return (
      <div className="signin-background">
        <div className="form-signin-wrapper">
          <form className="form-signin" onSubmit={this.signIn.bind(this)}>
            <img className="signin-logo" src={BuzznLogo} />
            {error &&
              error !== 'Sign out' && (
                <div className="alert alert-danger" role="alert">
                  <FormattedMessage id="admin.auth.signinFailed" />
                </div>
              )}
            <label htmlFor="inputEmail">
              <FormattedMessage id="admin.auth.username" />
            </label>
            <input
              value={username}
              onChange={event => setLogin(event.target.value)}
              type="email"
              id="inputEmail"
              className="form-control"
              placeholder={intl.formatMessage({ id: 'admin.auth.enterUsername' })}
              required
              autoFocus
            />
            <label htmlFor="inputPassword">
              <FormattedMessage id="admin.auth.password" />
            </label>
            <input
              value={password}
              onChange={event => setPassword(event.target.value)}
              type="password"
              id="inputPassword"
              className="form-control"
              placeholder={intl.formatMessage({ id: 'admin.auth.enterPassword' })}
              required
            />
            <button type="submit" onClick={this.signIn.bind(this)} className="btn btn-primary">
              <FormattedMessage id="admin.auth.signinButton" /> <i className="fa fa-check" />
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export const SignInIntl = injectIntl(SignIn);

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
})(SignInIntl);
