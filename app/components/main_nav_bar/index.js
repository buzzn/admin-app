import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, Button } from 'reactstrap';
import Auth from '@buzzn/module_auth';

export class MainNavBar extends Component {
  state = {
    isOpen: false,
  };

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    const { signedIn, dispatch, userMe, isOpen } = this.props;

    return (
      <div>
        <Navbar inverse fixed="top" toggleable light={ false } className="bg-inverse">
          <NavbarToggler right onClick={ ::this.toggle } />
          <NavbarBrand href="#">Powergiver App</NavbarBrand>
          <Collapse isOpen={ isOpen } navbar>
            <Nav className="ml-auto" navbar>
              <div className="float-right">
                { signedIn ?
                  <div>
                    <Link to={ `/users/${userMe}` } activeOnlyWhenExact>My profile</Link>
                    &nbsp;
                    <Button outline color="warning" onClick={ () => dispatch(Auth.actions.signOut()) }>Sign Out</Button>
                  </div> :
                  <Link to="/" activeOnlyWhenExact>Login</Link>
                }
              </div>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userMe: state.app.userMe,
  };
}

export default connect(mapStateToProps)(MainNavBar);
