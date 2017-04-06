import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Groups from 'groups';
import Meters from 'meters';
import Registers from 'registers';
import Breadcrumbs from 'components/breadcrumbs';

import './style.scss';

export class RegisterOverview extends Component {
  static propTypes = {
    group: React.PropTypes.object.isRequired,
    meter: React.PropTypes.object.isRequired,
    register: React.PropTypes.object.isRequired,
    loading: React.PropTypes.bool.isRequired,
    loadGroup: React.PropTypes.func.isRequired,
    loadMeter: React.PropTypes.func.isRequired,
    loadRegister: React.PropTypes.func.isRequired,
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

    loadRegister(registerId);
    if (!meter.id) loadMeter(meterId);
    if (!group.id) loadGroup(groupId);
  }

  render() {
    const { loading, group, meter, register } = this.props;

    if (register.status === 404) return (<div>Register not found</div>);

    if (loading || !group.id || !meter.id || !register.id) return (<div>Loading...</div>);

    const breadcrumbs = [
      { id: group.id, link: `/localpools/${group.id}/system`, title: group.attributes.name },
      { id: meter.id, link: `/localpools/${group.id}/system/${meter.id}/registers`, title: meter.attributes.manufacturerProductSerialnumber },
      { id: register.id, title: register.attributes.name },
    ];

    return (
      <div>
        <Helmet title="Register" />
        <Breadcrumbs breadcrumbs={ breadcrumbs }/>
        <div className="row register-overview top-content">
          <div className="col-12">
            <div className="title">{ register.attributes.name }</div>
          </div>
          <div className="col-6 left-col">
            Register data:
            <div className="row">
              <div className="col-6">OBIS:</div>
              <div className="col-6">{ register.attributes.obis }</div>
            </div>
            <div className="row">
              <div className="col-6">Label:</div>
              <div className="col-6">{ register.attributes.name }</div>
            </div>
            <div className="row">
              <div className="col-6">Low power:</div>
              <div className="col-6"></div>
            </div>
          </div>
          <div className="col-6 right-col">
            <div className="row">
              <div className="col-6">Pre-Decimal:</div>
              <div className="col-6"></div>
            </div>
            <div className="row">
              <div className="col-6">Decimal:</div>
              <div className="col-6"></div>
            </div>
            <div className="row">
              <div className="col-6">Transformer ratio:</div>
              <div className="col-6"></div>
            </div>
          </div>
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
