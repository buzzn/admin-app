// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import {
  Container,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup,
  InputGroupAddon,
  Input,
} from 'reactstrap';
import Auth from '@buzzn/module_auth';

import './style.scss';
import LogoImg from '../../images/logo_black.png';
import DevLogoImg from '../../images/dev_logo_black.png';
import DefaultPerson from '../../images/default_person.jpg';

type Props = {
  signOut: Function,
  myProfile: {
    firstName: string,
    lastName: string,
    image?: string,
  },
  devMode: boolean,
};

type State = {
  isOpen: boolean,
  profileOpen: boolean,
};

export class TopNavBar extends React.Component<Props, State> {
  static defaultProps = {
    myProfile: {
      fistName: '',
      lastName: '',
    },
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
    const { signOut, devMode, myProfile: { firstName, lastName, image } } = this.props;
    const { isOpen, profileOpen } = this.state;
    const myName = firstName ? `${firstName} ${lastName}` : 'My profile';

    return (
      <Navbar fixed="top" expand light className="new-top-nav-bar">
        <Container style={{ maxWidth: '1440px' }}>
          <Link className="navbar-brand" to="/">
            <img src={ devMode ? DevLogoImg : LogoImg } />
          </Link>
          <NavbarToggler onClick={ this.toggle.bind(this) } />
          <Collapse isOpen={ isOpen } navbar>
            <InputGroup className={ `nav-search ${devMode ? '' : 'under-construction'}` }>
              { devMode && <Input placeholder="Search"/> }
              <InputGroupAddon>
                <i className="fa fa-search"/>
              </InputGroupAddon>
            </InputGroup>
            <Nav className="ml-auto" navbar>
              <NavItem className={ `icon-nav-item ${devMode ? '' : 'under-construction'}` }>
                <i className="fa fa-bell"/>
              </NavItem>
              <NavItem className={ `icon-nav-item ${devMode ? '' : 'under-construction'}` }>
                <i className="fa fa-cog"/>
              </NavItem>
              <Dropdown nav isOpen={ profileOpen } toggle={ this.toggleProfile.bind(this) }>
                <DropdownToggle nav caret>
                  <img className="top-avatar" src={ image || DefaultPerson } />
                  { myName }
                </DropdownToggle>
                <DropdownMenu>
                  <Link to="/my-profile" style={{ color: 'black' }}>
                    <DropdownItem>My profile</DropdownItem>
                  </Link>
                  <DropdownItem divider />
                  <DropdownItem onClick={ () => signOut() }>Sign Out</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    );
  }
}

function mapStateToProps(state) {
  return {
    myProfile: state.app.userMe,
  };
}

export default connect(mapStateToProps, {
  signOut: Auth.actions.signOut,
})(TopNavBar);
