import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Contracts from 'contracts';

import './style.scss';

export class Powertakers extends Component {
  static propTypes = {
    loadGroupPowertakers: PropTypes.func.isRequired,
    groupId: PropTypes.string.isRequired,
    powertakers: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    powertakers: [],
  };

  componentWillMount() {
    const { loadGroupPowertakers, groupId } = this.props;
    loadGroupPowertakers(groupId);
  }

  render() {
    const { powertakers, groupId, loading } = this.props;

    if (loading) return (<div>Loading...</div>);

    return (
      <div className="row">
        <div className="col-12">
          <h5>Powertakers</h5>
          <p>{ powertakers.length } powertakers</p>
        </div>
        <div className="col-12 no-padding">
          <table className="table">
            <thead className="thead-default">
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              { powertakers.map(powertaker => (
                  <tr key={ powertaker.id }>
                    {
                      powertaker.type === 'user' ?
                        <td>
                          <img src={ powertaker.image } className="table-avatar"/>
                          { `${powertaker.firstName} ${powertaker.lastName}` }
                        </td> :
                        <td>
                          { powertaker.name }
                        </td>
                    }
                    <td>Location</td>
                    <td>
                      <Link
                        to={ `/localpools/${groupId}/powertakers/${powertaker.type}/${powertaker.id}` }
                        className="btn btn-outline-secondary"
                        style={{ float: 'right', marginRight: '15px' }}>
                        View
                      </Link>
                    </td>
                  </tr>
                ),
              ) }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    powertakers: state.contracts.groupPowertakers,
    loading: state.contracts.loadingGroupPowertakers,
  };
}

export default connect(mapStateToProps, { loadGroupPowertakers: Contracts.actions.loadGroupPowertakers })(Powertakers);
