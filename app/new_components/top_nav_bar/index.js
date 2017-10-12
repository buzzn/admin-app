// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import filter from 'lodash/filter';
import {
  Container,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup,
  InputGroupAddon,
  Input,
} from 'reactstrap';
import Auth from '@buzzn/module_auth';
import { actions } from 'actions';

import './style.scss';
import LogoImg from '../../images/logo_black.png';
import DefaultPerson from '../../images/default_person.jpg';

type Props = {
  dispatch: Function,
  myProfile: {
    firstName: string,
    lastName: string,
    image?: string,
  },
  groups: Array<Object>,
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
    groups: [],
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
    const { dispatch, myProfile: { firstName, lastName, image }, groups } = this.props;
    const { isOpen, profileOpen } = this.state;
    const myName = firstName ? `${firstName} ${lastName}` : 'My profile';

    return (
      <Navbar fixed="top" expand light className="new-top-nav-bar">
        <Container>
          <NavbarBrand href="" onClick={ () => dispatch(actions.switchUI('old')) }>
            <img src={ LogoImg } />
          </NavbarBrand>
          <NavbarToggler onClick={ this.toggle.bind(this) } />
          <Collapse isOpen={ isOpen } navbar>
            <InputGroup className="nav-search">
              <Input placeholder="Search"/>
              <InputGroupAddon>
                <i className="fa fa-search"/>
              </InputGroupAddon>
            </InputGroup>
            <Nav className="ml-auto" navbar>
              <NavItem className="icon-nav-item">
                <i className="fa fa-bell"/>
              </NavItem>
              <NavItem className="icon-nav-item">
                <i className="fa fa-cog"/>
              </NavItem>
              <NavDropdown isOpen={ profileOpen } toggle={ this.toggleProfile.bind(this) }>
                <DropdownToggle nav caret>
                  <img className="top-avatar" src={ image || DefaultPerson } />
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
                  <DropdownItem>Create new group</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={ () => dispatch(Auth.actions.signOut()) }>Sign Out</DropdownItem>
                </DropdownMenu>
              </NavDropdown>
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
    groups: filter(state.groups.groups, group => group.type === 'group_localpool'),
  };
}

export default connect(
  mapStateToProps,
  (dispatch: Dispatch<*>) => ({ dispatch }),
)(TopNavBar);
