import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { actions } from 'actions';
import ContactInfo from './contact_info';
import BankAccounts from './bank_accounts';

export const MyProfileResources = ({ userMe, userMeValidationRules, updateUserMe, match: { url, isExact } }) => {
  if (isExact) return (<Redirect to={ `${url}/contact-info` }/>);

  return (
    <div>
      <Route path={ `${url}/contact-info` } render={ () => <ContactInfo {...{ userMe, initialValues: userMe, userMeValidationRules, updateUserMe }}/> }/>
      <Route path={ `${url}/account` } render={ () => (<div>Account.</div>) }/>
      <Route path={ `${url}/bank` } render={ () => <BankAccounts bankAccounts={ userMe.bankAccounts ? userMe.bankAccounts.array : [] }/> }/>
    </div>
  );
};

MyProfileResources.propTypes = {
  userMe: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    userMe: state.app.userMe,
    userMeValidationRules: state.app.userMeValidationRules,
  };
}

export default connect(mapStateToProps, {
  updateUserMe: actions.updateUserMe,
})(MyProfileResources);
