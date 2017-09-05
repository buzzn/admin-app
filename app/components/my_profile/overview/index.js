import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { actions } from 'actions';

export class MyProfile extends Component {
  static propTypes = {
    loadUserMe: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { loadUserMe } = this.props;
    loadUserMe();
  }

  render() {
    const { userMe } = this.props;

    if (!userMe.id) return (<div>Loading...</div>);

    return (
      <div>
        <Helmet title="My Profile" />
        <div className="overview-header"><FormattedMessage id="admin.persons.headerMyProfile"/></div>
        <div className="row my-profile-overview top-content">
          <div className="col-12">
            <div className="title bg-grey-dark">
              { userMe.image && <img className="top-avatar" src={ userMe.image } /> }
              { `${userMe.firstName} ${userMe.lastName}` }
            </div>
          </div>
          <div className="col-6 left-col">
            {
              userMe.address &&
              <div className="row">
                <div className="col-12">{ userMe.address.street }</div>
                <div className="col-12">{ `${userMe.address.zip} ${userMe.address.city}` }</div>
              </div>
            }
            <div className="row">
              <div className="col-12">{ userMe.phone }</div>
              <div className="col-12">{ userMe.email }</div>
            </div>
          </div>
          <div className="col-6 right-col">
            { userMe.image && <img src={ userMe.image } /> }
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userMe: state.app.userMe,
  };
}

export default connect(mapStateToProps, { loadUserMe: actions.loadUserMe })(MyProfile);
