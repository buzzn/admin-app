import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

const Formulas = ({ loadingMeter, groupId, meter }) => {
  if (meter.status === 404) return (<div>Meter not found</div>);

  if (loadingMeter || !meter.id) return (<div>Loading...</div>);

  if (!meter.formulaParts || meter.formulaParts.array.length === 0) return (<div>Formulas not found</div>);

  const prefix = 'admin.formulas';

  return (
    <div className="row">
      <div className="col-12">
        <h5><FormattedMessage id={ `${prefix}.headerFormulas` }/></h5>
        <FormattedMessage id={ `${prefix}.descriptionFormulas` }/>
      </div>
      <div className="col-12 no-padding">
        <table className="table">
          <thead className="thead-default">
            <tr>
              <th>Operation</th>
              <th>Name</th>
              <th>Direction</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              meter.formulaParts.array.map(formula => (
                <tr key={ formula.id }>
                  <td>
                    <span className="fa-stack fa-lg">
                      {
                        formula.operator === '+' ?
                          <i className="fa fa-plus fa-stack-1x"/> :
                          <i className="fa fa-minus fa-stack-1x"/>
                      }
                      <i className="fa fa-circle-o fa-stack-2x"/>
                    </span>
                  </td>
                  <td>{ formula.register.name }</td>
                  <td>{ formula.register.direction }</td>
                  <td>
                    <Link
                      to={ `/localpools/${groupId}/system/${meter.id}/formulas/${formula.id}` }
                      className="btn btn-outline-secondary"
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
};

Formulas.propTypes = {
  meter: PropTypes.object.isRequired,
};

Formulas.defaultProps = {
  meter: {},
};

function mapStateToProps(state) {
  return {
    meter: state.meters.meter,
    loadingMeter: state.meters.loadingMeter,
  };
}

export default connect(mapStateToProps)(Formulas);
