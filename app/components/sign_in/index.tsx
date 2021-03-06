import * as React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Auth from '@buzzn/module_auth';
import { FormGroup } from 'components/style';
import { SignInWrapper } from './style';
import BgBubbles from 'components/bg_bubbles';

const BuzznLogo = require('images/logo_black.png');

class SignIn extends React.Component<ExtProps & DispatchProps & StateProps, ComponentState> {
  state = { active: {} };

  signIn = (event) => {
    event.preventDefault();
    this.props.startAuth();
  }

  setActive = (id, active) => {
    this.setState({ active: { [id]: active } });
  }

  render() {
    const { setLogin, setPassword, login, password, error } = this.props;
    const { active } = this.state;

    return (
      <SignInWrapper>
        <div className="background" />
        <div className="bubbles-wrapper">
          <BgBubbles type="signIn" />
        </div>
        <div className="form-signin-wrapper">
          <form className="form-signin" onSubmit={this.signIn}>
            <img className="signin-logo" src={BuzznLogo} />
            {error &&
              error !== 'Sign out' && (
                <div className="alert alert-danger" role="alert">
                  <FormattedMessage id="admin.auth.signinFailed" />
                </div>
              )}
            <FormGroup className="form-group">
              <input
                value={login}
                onChange={event => setLogin(event.target.value)}
                onFocus={({ target: { id } }) => this.setActive(id, true)}
                onBlur={({ target: { id } }) => this.setActive(id, false)}
                type="email"
                id="inputEmail"
                className="form-control"
                required
                autoFocus
              />
              <label htmlFor="inputEmail" className={`${!!login || active['inputEmail'] ? 'top' : 'center'}`}>
                <FormattedMessage id="admin.auth.username" />
              </label>
            </FormGroup>
            <FormGroup className="form-group">
              <input
                value={password}
                onChange={event => setPassword(event.target.value)}
                onFocus={({ target: { id } }) => this.setActive(id, true)}
                onBlur={({ target: { id } }) => this.setActive(id, false)}
                type="password"
                id="inputPassword"
                className="form-control"
                required
              />
              <label htmlFor="inputPassword" className={`${!!password || active['inputPassword'] ? 'top' : 'center'}`}>
                <FormattedMessage id="admin.auth.password" />
              </label>
            </FormGroup>
            <button type="submit" onClick={this.signIn} className="btn btn-primary">
              <FormattedMessage id="admin.auth.signinButton" /> <i className="fa fa-check" />
            </button>
          </form>
        </div>
      </SignInWrapper>
    );
  }
}

interface StatePart {
  auth: { login: string; password: string; error: string };
}

interface ExtProps {}

interface ComponentState {
  active: { [key: string]: boolean };
}

interface StateProps {
  login: string;
  password: string;
  error: string;
}

interface DispatchProps {
  setLogin: Function;
  setPassword: Function;
  startAuth: Function;
}

function mapStateToProps(state: StatePart) {
  return {
    login: state.auth.login,
    password: state.auth.password,
    error: state.auth.error,
  };
}

export default connect<StateProps, DispatchProps, ExtProps>(mapStateToProps, {
  setLogin: Auth.actions.setLogin,
  setPassword: Auth.actions.setPassword,
  startAuth: Auth.actions.startAuth,
})(SignIn);
