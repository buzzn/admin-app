import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, Button } from 'reactstrap';
import Auth from '@buzzn/module_auth';

import './style.scss';

export class TopNavBar extends Component {
  static propTypes = {
    signedIn: React.PropTypes.bool.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    myProfile: React.PropTypes.shape({
      firstName: React.PropTypes.string,
      lastName: React.PropTypes.string,
      mdImg: React.PropTypes.string,
    }),
  };

  static defaultProps = {
    myProfile: {},
  };

  state = {
    isOpen: false,
  };

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    const { signedIn, dispatch, myProfile: { firstName, lastName, mdImg }, isOpen } = this.props;
    const myName = firstName ? `${firstName} ${lastName}` : 'My profile';

    return (
      <div>
        <Navbar fixed="top" toggleable light className="top-nav-bar">
          <NavbarToggler right onClick={ ::this.toggle } />
          <NavbarBrand href="#">Powergiver App</NavbarBrand>
          <Collapse isOpen={ isOpen } navbar>
            <Nav className="ml-auto" navbar>
              <div className="float-right">
                { signedIn &&
                  <div>
                    <Link to="#">
                      { mdImg &&
                        <img className="top-avatar" src={ mdImg } />
                      }
                      { myName }
                    </Link>
                    &nbsp;
                    <Button outline color="warning" onClick={ () => dispatch(Auth.actions.signOut()) }>Sign Out</Button>
                  </div>
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
  const myId = state.app.userMe;
  return {
    myProfile: state.profiles.profiles[myId],
  };
}

export default connect(mapStateToProps)(TopNavBar);