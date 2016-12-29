import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setEndpointHost, setEndpointPath, readEndpoint } from 'redux-json-api';

const mapStateToProps = ({ api: { groups = { data: [] } } }) => ({ groups });

class Groups extends Component {
  componentWillMount() {
    this.props.dispatch(setEndpointHost('https://app.buzzn.net'));
    this.props.dispatch(setEndpointPath('/api/v1'));
    this.props.dispatch(readEndpoint('groups'));
  }

  render() {
    return (
      <div>
        <ul>
          {this.props.groups.data.map(group => (
            <li>{group.attributes.name}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Groups);
