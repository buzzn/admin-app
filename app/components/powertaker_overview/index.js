import React, { Component } from 'react';
import { connect } from 'react-redux';
import Users from '../../users';

import './style.scss';

export class PowertakerOverview extends Component {
  static propTypes = {
    profile: React.PropTypes.object,
  };

  static defaultProps = {
    profile: {},
  };

  render() {
    const { profile: { firstName, lastName, mdImg, loading } } = this.props;

    if (loading) return (<div>Loading...</div>);

    return (
      <div className="row powertaker-overview">
        <div className="col-12">
          <div className="title">
            { mdImg && <img className="top-avatar" src={ mdImg } /> }
            { `${firstName} ${lastName}` }
          </div>
        </div>
        <div className="col-6">
          <div className="row">
            <div className="col-12">Address here</div>
          </div>
          <div className="row">
            <div className="col-3"><b>Status:</b></div>
            <div className="col-9"></div>
          </div>
        </div>
        <div className="col-6">Bank</div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const { match: { params: { userId } } } = props;

  return {
    profile: state.profiles.profiles[userId],
  };
}

export default connect(mapStateToProps)(PowertakerOverview);
