import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Meters from 'meters';

export class MetersList extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    meters: PropTypes.array.isRequired,
    loadGroupMeters: PropTypes.func.isRequired,
    groupId: PropTypes.string.isRequired,
  };

  static defaultProps = {
    meters: [],
  };

  componentWillMount() {
    const { loadGroupMeters, groupId } = this.props;
    loadGroupMeters(groupId);
  }

  render() {
    const { loading, meters, groupId } = this.props;

    if (loading) return (<div>Loading...</div>);

    return (
      <div className="row">
        <div className="col-12">
          <h5>System setup</h5>
          List of all <strong>meters</strong> in your local pool.
        </div>
        <div className="col-12 no-padding">
          <table className="table">
            <thead className="thead-default">
              <tr>
                <th>Meter</th>
                <th>Description</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                meters.map(meter => (
                  <tr key={ meter.id }>
                    <td>
                      { meter.attributes.manufacturerProductSerialnumber }
                    </td>
                    <td></td>
                    <td>
                      <Link
                        to={ `/localpools/${groupId}/system/${meter.id}` }
                        className="btn btn-secondary btn-beige"
                        style={{ float: 'right', marginRight: '15px' }}>
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.meters.loadingGroupMeters,
    meters: state.meters.groupMeters,
  };
}

export default connect(mapStateToProps, { loadGroupMeters: Meters.actions.loadGroupMeters })(MetersList);
