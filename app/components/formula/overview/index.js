import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { Field, reduxForm } from 'redux-form';
import get from 'lodash/get';
import Groups from 'groups';
import Meters from 'meters';
import Registers from 'registers';
import Breadcrumbs from 'components/breadcrumbs';
import EditableSelect from 'components/editable_select';

export class FormulaOverview extends Component {
  static propTypes = {
    group: PropTypes.object,
    meter: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    loadGroup: PropTypes.func.isRequired,
    loadMeter: PropTypes.func.isRequired,
    updateFormula: PropTypes.func,
  };

  state = {
    editMode: false,
  };

  handleEditSwitch(event) {
    event.preventDefault();

    const { updateFormula, reset } = this.props;
    if (!updateFormula) {
      this.setState({ editMode: false });
    }
    this.setState({ editMode: !this.state.editMode });
    reset();
    return false;
  }

  componentWillMount() {
    const { loadMeter, loadGroup, group, meter, loadRegisters, match: { params: { meterId, groupId } } } = this.props;
    if (meter.id !== meterId) loadMeter({ meterId, groupId });
    if (group.id !== groupId) loadGroup(groupId);
    loadRegisters({ groupId });
  }

  render() {
    const { loading, group, meter, formula, registers, updateFormula, handleSubmit, pristine, submitting } = this.props;

    if (meter.status === 404) return (<div>Meter not found</div>);

    if (loading || !group.id || !meter.id) return (<div>Loading...</div>);

    if (!meter.formulaParts) return (<div>Real meter selected</div>);

    if (!formula) return (<div>Formula not found</div>);

    const breadcrumbs = [
      { id: group.id, link: `/localpools/${group.id}/system`, title: group.name },
      { id: meter.id, link: `/localpools/${group.id}/system/${meter.id}/formula`, title: meter.productSerialnumber, type: 'meter' },
      { id: formula.id, title: formula.register.name, type: 'formula' },
    ];

    const submit = values => new Promise((resolve, reject) => {
      updateFormula({
        resolve,
        reject,
        meterId: meter.id,
        groupId: group.id,
        formulaPartId: formula.id,
        params: { ...values, updatedAt: formula.updatedAt },
      });
    })
    .then(() => this.setState({ editMode: false }));

    const prefix = 'admin.formulas';

    return (
      <form onSubmit={ handleSubmit(submit) }>
        <Helmet title="Formula" />
        <Breadcrumbs breadcrumbs={ breadcrumbs }/>
        <div className="row formula-overview top-content">
          <div className="col-12">
            <div className="title bg-heat-dark">{ formula.register.name }</div>
          </div>
          <div className="col-6">
            <div className="row" style={{ minHeight: '40px' }}>
              <div className="col-6"><FormattedMessage id={ `${prefix}.operator` }/></div>
              <div className="col-6">
                <Field name="operator"
                  editMode={ this.state.editMode }
                  noValTranslations
                  noDefault
                  field={ { enum: ['+', '-'] } }
                  component={ EditableSelect }/>
              </div>
            </div>
            <div className="row" style={{ minHeight: '40px' }}>
              <div className="col-6"><FormattedMessage id={ `${prefix}.registerName` }/></div>
              <div className="col-6">
                <Field name="registerId"
                  editMode={ this.state.editMode }
                  noValTranslations
                  noDefault
                  listOverride={ registers.map(r => ({ value: r.id, label: r.name })) }
                  component={ EditableSelect }/>
              </div>
            </div>
          </div>
          <div className="col-6"></div>
          <div className="col-12">
            {
              updateFormula &&
              <div className="edit-buttons" style={{ float: 'right', marginBottom: '10px' }}>
                {
                  this.state.editMode ?
                    <span>
                    <button type="submit" className="btn btn-primary" disabled={pristine || submitting}>Submit</button>
                    <button type="button" className="btn btn-link" disabled={submitting} onClick={::this.handleEditSwitch}>Cancel</button>
                  </span> :
                    <button className="btn btn-primary" onClick={::this.handleEditSwitch}>Edit</button>
                }
              </div>
            }
          </div>
        </div>
      </form>
    );
  }
}

function mapStateToProps(state, props) {
  const { match: { params: { formulaId } } } = props;
  const meter = state.meters.meter;
  const formula = get(meter.formulaParts, 'array', []).find(f => f.id === formulaId);
  const initialValues = formula ? {
    operator: formula.operator,
    registerId: formula.register.id,
  } : {};

  return {
    group: state.groups.group,
    meter,
    loading: state.groups.loadingGroup || state.meters.loadingMeter,
    registers: state.registers.registers,
    formula,
    initialValues,
  };
}

export default connect(mapStateToProps, {
  loadGroup: Groups.actions.loadGroup,
  loadMeter: Meters.actions.loadMeter,
  loadRegisters: Registers.actions.loadRegisters,
  updateFormula: Meters.actions.updateFormulaPart,
})(reduxForm({
  form: 'formulaUpdateForm',
  enableReinitialize: true,
})(FormulaOverview));
