import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import dropRight from 'lodash/dropRight';
import Helmet from 'react-helmet';
import find from 'lodash/find';
import Groups from 'groups';
import Meters from 'meters';
import Registers from 'registers';
import Readings from 'readings';
import Breadcrumbs from 'components/breadcrumbs';
import ModalWrapper from 'components/modal_wrapper';

export class ReadingOverview extends Component {
  static propTypes = {
    group: PropTypes.object,
    meter: PropTypes.object.isRequired,
    register: PropTypes.object.isRequired,
    readings: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    loadGroup: PropTypes.func.isRequired,
    loadMeter: PropTypes.func.isRequired,
    loadRegister: PropTypes.func.isRequired,
    deleteReading: PropTypes.func.isRequired,
  };

  state = {
    modal: false,
    deleted: false,
  };

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  delete({ meterId, registerId, groupId, readingId }) {
    const { deleteReading } = this.props;
    deleteReading({ meterId, registerId, groupId, readingId });
    this.setState({
      deleted: true,
    });
  }

  componentWillMount() {
    const {
      loadMeter,
      loadGroup,
      loadRegister,
      group,
      meter,
      register,
      readings,
      match: { params: { meterId, groupId, registerId, readingId } },
    } = this.props;

    const reading = find(readings, r => r.id === readingId);
    if (!reading || !register.id) loadRegister({ registerId, groupId });
    if (!meter.id) loadMeter({ meterId, groupId });
    if (!group.id) loadGroup(groupId);
  }

  render() {
    const { loading, group, meter, register, readings, match: { url, params: { readingId } } } = this.props;
    const reading = find(readings, r => r.id === readingId);

    const registerUrl = dropRight(url.split('/'), 1).join('/');
    if (this.state.deleted) return (<Redirect to={ registerUrl }/>);

    if (register.status === 404) return (<div>Register not found</div>);

    if (loading || !group.id || !meter.id || !register.id) return (<div>Loading...</div>);

    if (!reading) return (<div>Reading not found</div>);

    const breadcrumbs = [
      { id: group.id, link: `/localpools/${group.id}/system`, title: group.name },
      { id: meter.id, link: `/localpools/${group.id}/system/${meter.id}/registers`, title: meter.productSerialnumber, type: 'meter' },
      { id: register.id, link: `/localpools/${group.id}/system/${meter.id}/registers/${register.id}/readings`, title: register.name, type: 'register' },
      { id: reading.id, title: reading.date, type: 'reading' },
    ];

    const prefix = 'admin.readings';

    return (
      <div>
        <Helmet title="Reading" />
        <Breadcrumbs breadcrumbs={ breadcrumbs }/>
        <div className="row reading-overview top-content">
          <div className="col-12">
            <div className="title bg-heat-dark">{ `${meter.productSerialnumber} ${register.name} ${reading.date}` }</div>
          </div>
          <div className="col-12">
            <div className="row">
              <div className="col-12">
                <h5><FormattedMessage id={`${prefix}.headerReading`}/></h5>
              </div>
            </div>
            <div className="row">
              <div className="col-3"><FormattedMessage id={ `${prefix}.date` }/>:</div>
              <div className="col-9"><FormattedMessage id={ reading.date }/></div>
            </div>
            <div className="row">
              <div className="col-3"><FormattedMessage id={ `${prefix}.wattHour` }/>:</div>
              <div className="col-9">{ `${reading.rawValue} ${reading.unit}` }</div>
            </div>
            <div className="row">
              <div className="col-3"><FormattedMessage id={ `${prefix}.readBy` }/>:</div>
              <div className="col-9"><FormattedMessage id={ `${prefix}.${reading.readBy}` }/></div>
            </div>
            <div className="row">
              <div className="col-3"><FormattedMessage id={ `${prefix}.quality` }/>:</div>
              <div className="col-9"><FormattedMessage id={ `${prefix}.${reading.quality}` }/></div>
            </div>
            <div className="row">
              <div className="col-3"><FormattedMessage id={ `${prefix}.source` }/>:</div>
              <div className="col-9"><FormattedMessage id={ `${prefix}.${reading.source}` }/></div>
            </div>
            <div className="row">
              <div className="col-3"><FormattedMessage id={ `${prefix}.state` }/>:</div>
              <div className="col-9"><FormattedMessage id={ `${prefix}.${reading.state}` }/></div>
            </div>
            <div className="row">
              <div className="col-3"><FormattedMessage id={ `${prefix}.comment` }/>:</div>
              <div className="col-9"><FormattedMessage id={ reading.comment }/></div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="delete-button" style={{ float: 'right', marginBottom: '10px' }}>
                  <button onClick={ ::this.toggle } className="btn btn-danger">Delete</button>
                </div>
              </div>
            </div>
            <ModalWrapper
              modalTitle="Delete reading"
              buttons={[
                { id: 1, text: 'Delete', onClick: () => ::this.delete({ meterId: meter.id, registerId: register.id, groupId: group.id, readingId }), className: 'btn-danger' },
                { id: 2, text: 'Cancel', onClick: ::this.toggle, className: 'btn-warning' },
              ]}
              isOpen={ this.state.modal }
              toggle={ ::this.toggle }>
              <h2>Are sure?</h2>
            </ModalWrapper>
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
    readings: state.registers.readings,
    loading: state.groups.loadingGroup || state.meters.loadingMeter || state.registers.loadingRegister,
  };
}

export default connect(mapStateToProps, {
  loadGroup: Groups.actions.loadGroup,
  loadMeter: Meters.actions.loadMeter,
  loadRegister: Registers.actions.loadRegister,
  deleteReading: Readings.actions.deleteReading,
})(ReadingOverview);
