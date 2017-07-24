import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import Registers from 'registers';
import RegisterData from './register_data';
import Readings from './readings';

export class RegisterResources extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    register: PropTypes.object.isRequired,
    readings: PropTypes.array.isRequired,
    loadRegister: PropTypes.func.isRequired,
  };

  static defaultProps = {
    readings: [],
  };

  componentWillMount() {
    const { loading, register, readings, loadRegister, match: { params: { registerId, groupId } } } = this.props;
    if (!loading && (!register || readings.length === 0)) loadRegister({ registerId, groupId });
  }

  render() {
    const {
      register,
      updateRegister,
      readings,
      validationRules,
      loading,
      match: {
        url,
        isExact,
        params: {
          groupId,
          meterId,
        },
      },
    } = this.props;

    if (isExact) return (<Redirect to={ `${url}/register-data` }/>);

    if (loading) return (<div>Loading...</div>);

    return (
      <div>
        <Route path={ `${url}/register-data` } render={ () => <RegisterData {...{ register, initialValues: register, groupId, meterId, validationRules, updateRegister }} /> } />
        <Route path={ `${url}/readings` } render={ () => <Readings {...{ readings }} /> } />
        <Route path={ `${url}/formula` } render={ () => (<div>Formula</div>) } />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.registers.loadingRegister,
    register: state.registers.register,
    readings: state.registers.readings,
    validationRules: state.registers.validationRules,
  };
}

export default connect(mapStateToProps, {
  loadRegister: Registers.actions.loadRegister,
  updateRegister: Registers.actions.updateRegister,
})(RegisterResources);
