import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    signedIn: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    myProfile: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      image: PropTypes.string,
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
    const { signedIn, dispatch, myProfile: { firstName, lastName, image }, groups } = this.props;
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
                      { image &&
                        <img className="top-avatar" src={ image } />
                      }
                      { myName }
                    </DropdownToggle>
                    <DropdownMenu>
                      <Link to="/my-profile" style={{ color: 'black' }}>
                        <DropdownItem>My profile</DropdownItem>
                      </Link>
                      <DropdownItem divider />
                      <DropdownItem header>Switch to:</DropdownItem>
                      { groups.map(group => (
                        <Link to={ `/localpools/${group.id}` } style={{ color: 'black' }} key={ group.id }>
                          <DropdownItem >
                            { group.name }
                          </DropdownItem>
                        </Link>
                      )) }
                      <DropdownItem divider />
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
  return {
    myProfile: state.app.userMe,
    groups: filter(state.groups.groups, group => group.type === 'group_localpool'),
  };
}

export default connect(mapStateToProps)(TopNavBar);
