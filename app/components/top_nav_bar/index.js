import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import filter from 'lodash/filter';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import Auth from '@buzzn/module_auth';

import './style.scss';
import LogoImg from '../../images/bz_logo_115px_white.png';

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
    profileOpen: false,
  };

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  toggleProfile() {
    this.setState({
      profileOpen: !this.state.profileOpen,
    });
  }

  render() {
    const { signedIn, dispatch, myProfile: { firstName, lastName, mdImg }, groups } = this.props;
    const { isOpen, profileOpen } = this.state;
    const myName = firstName ? `${firstName} ${lastName}` : 'My profile';

    return (
      <div>
        <Navbar fixed="top" toggleable light className="top-nav-bar">
          <NavbarToggler right onClick={ ::this.toggle } />
          <NavbarBrand href="#">
            <img src={ LogoImg } />
          </NavbarBrand>
          <Collapse isOpen={ isOpen } navbar>
            <Nav className="ml-auto" navbar>
              <div className="float-right">
                { signedIn &&
                  <NavDropdown isOpen={ profileOpen } toggle={ ::this.toggleProfile }>
                    <DropdownToggle nav caret>
                      { mdImg &&
                        <img className="top-avatar" src={ mdImg } />
                      }
                      { myName }
                    </DropdownToggle>
                    <DropdownMenu>
                      { groups.map(group => (
                        <Link to={ `/localpools/${group.id}` } style={{ color: 'black' }} key={ group.id }>
                          <DropdownItem >
                            { group.attributes.name }
                          </DropdownItem>
                        </Link>
                      )) }
                      <DropdownItem onClick={ () => dispatch(Auth.actions.signOut()) }>Sign Out</DropdownItem>
                    </DropdownMenu>
                  </NavDropdown>
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
    groups: filter(state.groups.groups, group => group.type === 'localpools'),
  };
}

export default connect(mapStateToProps)(TopNavBar);