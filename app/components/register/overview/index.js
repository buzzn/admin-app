import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Groups from 'groups';
import Meters from 'meters';
import Registers from 'registers';
import Breadcrumbs from 'components/breadcrumbs';

export class RegisterOverview extends Component {
  static propTypes = {
    group: PropTypes.object,
    meter: PropTypes.object.isRequired,
    register: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    loadGroup: PropTypes.func.isRequired,
    loadMeter: PropTypes.func.isRequired,
    loadRegister: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const {
      loadMeter,
      loadGroup,
      loadRegister,
      group,
      meter,
      match: { params: { meterId, groupId, registerId } },
    } = this.props;

    loadRegister({ registerId, groupId });
    if (!meter.id) loadMeter({ meterId, groupId });
    if (!group.id) loadGroup(groupId);
  }

  render() {
    const { loading, group, meter, register } = this.props;

    if (register.status === 404) return (<div>Register not found</div>);

    if (loading || !group.id || !meter.id || !register.id) return (<div>Loading...</div>);

    const breadcrumbs = [
      { id: group.id, link: `/localpools/${group.id}/system`, title: group.name },
      { id: meter.id, link: `/localpools/${group.id}/system/${meter.id}/registers`, title: meter.productSerialnumber },
      { id: register.id, title: register.name },
    ];

    const prefix = 'admin.registers';

    return (
      <div>
        <Helmet title="Register" />
        <Breadcrumbs breadcrumbs={ breadcrumbs }/>
        <div className="row register-overview top-content">
          <div className="col-12">
            <div className="title bg-solar-mid">{ register.name }</div>
          </div>
          <div className="col-6 left-col">
            <div className="row">
              <div className="col-6"><FormattedMessage id={ `${prefix}.type` }/>:</div>
              <div className="col-6"><FormattedMessage id={ `${prefix}.${register.type}` }/></div>
            </div>
            <div className="row">
              <div className="col-6"><FormattedMessage id={ `${prefix}.name` }/>:</div>
              <div className="col-6">{ register.name }</div>
            </div>
            <div className="row">
              <div className="col-6"><FormattedMessage id={ `${prefix}.label` }/>:</div>
              <div className="col-6"><FormattedMessage id={ `${prefix}.${register.label}` }/></div>
            </div>
            <div className="row">
              <div className="col-6"><FormattedMessage id={ `${prefix}.obis` }/>:</div>
              <div className="col-6">{ register.obis }</div>
            </div>
          </div>
          <div className="col-6 right-col"></div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    group: state.groups.group,
    meter: state.meters.meter,
    register: state.registers.register,
    loading: state.groups.loadingGroup || state.meters.loadingMeter || state.registers.loadingRegister,
  };
}

export default connect(mapStateToProps, {
  loadGroup: Groups.actions.loadGroup,
  loadMeter: Meters.actions.loadMeter,
  loadRegister: Registers.actions.loadRegister,
})(RegisterOverview);
