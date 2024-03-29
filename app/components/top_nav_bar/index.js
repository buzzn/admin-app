import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Alert from 'react-s-alert';
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
import Meters from 'meters';
import Contracts from 'contracts';
import withHover from 'components/with_hover';

import './style.scss';
import LogoImg from '../../images/logo_white.png';
import DevLogoImg from '../../images/dev_logo_white.png';
import DefaultPerson from '../../images/default_person.jpg';

export class TopNavBar extends React.Component {
  static defaultProps = {
    myProfile: {
      fistName: '',
      lastName: '',
    },
  };

  state = {
    isOpen: false,
    actionOpen: false,
    downloadOpen: false,
    profileOpen: false,
    scrolled: false,
  };

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  toggleAction = () => {
    this.setState({ actionOpen: !this.state.actionOpen });
  };

  toggleDownload = () => {
    this.setState({ downloadOpen: !this.state.downloadOpen });
  };

  toggleProfile = () => {
    this.setState({ profileOpen: !this.state.profileOpen });
  };

  handleScroll() {
    if (window.pageYOffset > 100) {
      this.setState({ scrolled: true });
    } else {
      this.setState({ scrolled: false });
    }
  }

  componentDidMount() {
    window.onscroll = () => this.handleScroll();
  }

  async handleDownloadMeterReport() {
    const { getMeterReport, getMeterReportId } = this.props;
    new Promise((resolve, reject) => {
      getMeterReportId({
        resolve,
        reject,
      });
    }).then((id) => {

      const now = Date.now();
      const timeout = 1000 * 180; // 3 minutes
      const checkEvery = 5000;
      let t = null;

      const loopReportRequest = async () => {
        if (timeout + now < Date.now()) {
          this.setState({ hackLoading: false });
          Alert.error('Could not be generated during Timeout of 3 minutes.');
          return;
        }
        
        try {
          (new Promise((resolve, reject) => {
            getMeterReport({
              reportId: id,
              resolve,
              reject,
            });
          })).then(() => {
            if (t) { clearTimeout(t); }
            Alert.success('Report was successfully generated.');
          }).catch((e) => {
            if (t) { clearTimeout(t); }
            t = setTimeout(() => loopReportRequest(), checkEvery);
          });    
        } catch (e) {
          if (t) { clearTimeout(t); }
          t = setTimeout(() => loopReportRequest(), checkEvery);
        }
      };
      loopReportRequest();
    });
  }

  async handleDownloadPowertakerReport() {
    const { getPowertakerReport, getPowertakerReportId } = this.props;
    new Promise((resolve, reject) => {
      getPowertakerReportId({
        resolve,
        reject,
      });
    }).then((id) => {

      const now = Date.now();
      const timeout = 1000 * 180; // 3 minutes
      const checkEvery = 5000;
      let t = null;

      const loopReportRequest = async () => {
        if (timeout + now < Date.now()) {
          this.setState({ hackLoading: false });
          Alert.error('Could not be generated during Timeout of 3 minutes.');
          return;
        }
        
        try {
          (new Promise((resolve, reject) => {
            getPowertakerReport({
              reportId: id,
              resolve,
              reject,
            });
          })).then(() => {
            if (t) { clearTimeout(t); }
            Alert.success('Report was successfully generated.');
          }).catch((e) => {
            if (t) { clearTimeout(t); }
            t = setTimeout(() => loopReportRequest(), checkEvery);
          });    
        } catch (e) {
          if (t) { clearTimeout(t); }
          t = setTimeout(() => loopReportRequest(), checkEvery);
        }
      };
      loopReportRequest();
    });
  }

  render() {
    const {
      signOut,
      devMode,
      myProfile: { firstName, lastName, image },
      hoverEvents,
      hover,
      switchAddGroup,
    } = this.props;
    const { isOpen, actionOpen, downloadOpen, profileOpen, scrolled } = this.state;
    const myName = firstName ? `${firstName} ${lastName}` : 'My profile';
    const shrinked = !hover && scrolled;

    return (
      <Navbar fixed="top" expand dark className={`new-top-nav-bar ${shrinked && 'shrinked'}`} {...hoverEvents}>
        <Container style={{ maxWidth: '100vw' }}>
          <Link className="navbar-brand" to="/" data-cy="home link">
            <img src={devMode ? DevLogoImg : LogoImg} />
          </Link>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={isOpen} navbar>
            <InputGroup className={`nav-search ${devMode ? '' : 'under-construction'}`}>
              {devMode && <Input placeholder="Search" />}
              <InputGroupAddon addonType="append">
                <i className="fa fa-search" />
              </InputGroupAddon>
            </InputGroup>
            <Nav className="ml-auto" navbar>
              {
                myName !== 'Isar Watt' ? (
                /* Download meter report (start) */
                <Dropdown nav isOpen={downloadOpen} toggle={this.toggleDownload} className={`icon-drop ${myName === 'Isar Watt' ? 'is-hidden' : ''}`}>
                  <DropdownToggle nav>
                    <span className="icon-nav-item" data-cy="global CTA">
                      <i className="fa fa-download" />
                    </span>
                  </DropdownToggle>
                  <DropdownMenu className="icon-dropdown" modifiers={{ offset: { enabled: true, offset: '0px, 0px' } }}>
                    <DropdownItem data-cy="create group link" onClick={() => this.handleDownloadMeterReport()}>
                      <FormattedMessage id="admin.groups.menuDownloadMeterReport" />
                    </DropdownItem>
                    <DropdownItem data-cy="create group link" onClick={() => this.handleDownloadPowertakerReport()}>
                      <FormattedMessage id="admin.groups.menuDownloadPowertakerReport" />
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                /* Download meter report (end) */
                ) : ''
              }
              <Dropdown nav isOpen={actionOpen} toggle={this.toggleAction} className="icon-drop">
                <DropdownToggle nav>
                  <span className="icon-nav-item" data-cy="global CTA">
                    <i className="fa fa-plus" />
                  </span>
                </DropdownToggle>
                <DropdownMenu className="icon-dropdown" modifiers={{ offset: { enabled: true, offset: '0px, 0px' } }}>
                  <DropdownItem data-cy="create group link" onClick={switchAddGroup}>
                    <FormattedMessage id="admin.groups.menuAddGroup" />
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <NavItem className="icon-nav-item">
                <Link to="/website-forms">
                  <i className="fa fa-vcard" />
                </Link>
              </NavItem>
              <NavItem className="icon-nav-item">
                <Link to="/organization-markets">
                  <i className="fa fa-building" />
                </Link>
              </NavItem>
              <NavItem className={`icon-nav-item ${devMode ? '' : 'under-construction'}`}>
                <i className="fa fa-bell" />
              </NavItem>
              <NavItem className={`icon-nav-item ${devMode ? '' : 'under-construction'}`}>
                <i className="fa fa-cog" />
              </NavItem>
              <Dropdown nav isOpen={profileOpen} toggle={this.toggleProfile}>
                <DropdownToggle nav caret>
                  <img className="top-avatar" src={image || DefaultPerson} />
                  <span className="user-name">{myName}</span>
                </DropdownToggle>
                <DropdownMenu>
                  <Link to="/my-profile" style={{ color: 'black' }}>
                    <DropdownItem>My profile</DropdownItem>
                  </Link>
                  <DropdownItem divider />
                  <DropdownItem onClick={() => signOut()}>Sign Out</DropdownItem>
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
  return { myProfile: state.app.userMe };
}

export default connect(
  mapStateToProps,
  { 
    signOut: Auth.actions.signOut,
    getMeterReportId: Meters.actions.getMeterReportId,
    getMeterReport: Meters.actions.getMeterReport,
    getPowertakerReportId: Contracts.actions.getPowertakerReportId,
    getPowertakerReport: Contracts.actions.getPowertakerReport,
  },
)(withHover(TopNavBar));
