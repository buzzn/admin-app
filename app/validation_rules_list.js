import { actions } from 'actions';
import Meters from 'meters';
import Registers from 'registers';
import Readings from 'readings';
import Groups from 'groups';
import Comments from 'comments';
import Contracts from 'contracts';
import BillingCycles from 'billing_cycles';
import Billings from 'billings';
import Tariffs from 'tariffs';
import Devices from 'devices';
import Organizations from 'organizations';

export const authList = [
  {
    swaggerPath: '/.patch.parameters',
    setAction: actions.setUserMeValidationRules,
  },
];

export default [
  // Group rules
  {
    swaggerPath: '/localpools/{localpool_id}.patch.parameters',
    setAction: rules => Groups.actions.setValidationRules('updateGroup', rules),
  },
  {
    swaggerPath: '/localpools/{localpool2_id}/organization-owner.post.parameters',
    setAction: rules => Groups.actions.setValidationRules('createOrganizationOwner', rules),
  },
  {
    swaggerPath: '/localpools/{localpool3_id}/organization-owner.patch.parameters',
    setAction: rules => Groups.actions.setValidationRules('updateOrganizationOwner', rules),
  },
  {
    swaggerPath: '/localpools/{localpool2_id}/person-owner.post.parameters',
    setAction: rules => Groups.actions.setValidationRules('createPersonOwner', rules),
  },
  {
    swaggerPath: '/localpools/{localpool_id}/person-owner.patch.parameters',
    setAction: rules => Groups.actions.setValidationRules('updatePersonOwner', rules),
  },
  // Comments rules
  {
    swaggerPath: '/localpools/{localpool_id}/comments.post.parameters',
    // HACK: assumption is that all comments have the same validation rules
    setAction: rules => Comments.actions.setValidationRules('createComment', rules),
  },
  {
    swaggerPath: '/localpools/{localpool_id}/comments/{comment_id}.patch.parameters',
    // HACK: assumption is that all comments have the same validation rules
    setAction: rules => Comments.actions.setValidationRules('updateComment', rules),
  },
  // Contract rules
  {
    swaggerPath: '/localpools/{localpool_id}/contracts/{localpool_processing_contract_id}.patch.parameters',
    setAction: rules => Contracts.actions.setValidationRules('lpc', rules),
  },
  {
    swaggerPath: '/localpools/{localpool_pto_id}/contracts.post.parameters',
    setAction: rules => Contracts.actions.setValidationRules('lpto', rules),
  },
  {
    swaggerPath: '/localpools/{localpool_ptp_id}/contracts.post.parameters',
    setAction: rules => Contracts.actions.setValidationRules('lptp', rules),
  },
  {
    swaggerPath: '/localpools/{localpoolpc_id}/contracts.post.parameters',
    setAction: rules => Contracts.actions.setValidationRules('lpthird', rules),
  },
  {
    swaggerPath: '/localpools/{localpool_id}/contracts/{localpool_third_party_contract_id}.patch.parameters',
    setAction: rules => Contracts.actions.setValidationRules('lpthirdUpdate', rules),
  },
  {
    swaggerPath: '/localpools/{localpool_id}/contracts/{localpool_power_taker_contract_id}.patch.parameters',
    setAction: rules => Contracts.actions.setValidationRules('lptUpdate', rules),
  },
  {
    swaggerPath:
      '/localpools/{localpool_id}/contracts/{localpool_power_taker_contract_id}/customer-organization.patch.parameters',
    setAction: rules => Contracts.actions.setValidationRules('lptOrgCustomer', rules),
  },
  {
    swaggerPath:
      '/localpools/{localpool_id}/contracts/{localpool_power_taker_contract_id}/customer-person.patch.parameters',
    setAction: rules => Contracts.actions.setValidationRules('lptPerCustomer', rules),
  },
  {
    swaggerPath: '/localpools/{localpool_id}/contracts/{localpool_power_taker_contract_id}/payments.post.parameters',
    setAction: rules => Contracts.actions.setValidationRules('payment', rules),
  },
  {
    swaggerPath:
      '/localpools/{localpool_id}/contracts/{localpool_power_taker_contract_id}/payments/{payment_id}.patch.parameters',
    setAction: rules => Contracts.actions.setValidationRules('paymentUpdate', rules),
  },
  // HACK
  {
    swaggerPath: '/localpools/{localpool_id}/persons/{person_id}/bank-accounts/{bank_account_id}.patch.parameters',
    setAction: rules => Contracts.actions.setValidationRules('bankAccountUpdate', rules),
  },
  {
    swaggerPath: '/localpools/{localpool3_id}/organizations/{organization_id}/bank-accounts.post.parameters',
    setAction: rules => Contracts.actions.setValidationRules('bankAccountCreate', rules),
  },
  // Meter rules
  {
    swaggerPath: '/localpools/{localpool_meter_real_id}/meters.post.parameters',
    setAction: rules => Meters.actions.setValidationRules('realCreate', rules),
  },
  {
    swaggerPath: '/localpools/{localpool_id}/meters/{real_meter_id}.patch.parameters',
    setAction: rules => Meters.actions.setValidationRules('realUpdate', rules),
  },
  {
    swaggerPath: '/localpools/{localpool_id}/meters/{virtual_meter_id}.patch.parameters',
    setAction: rules => Meters.actions.setValidationRules('virtualUpdate', rules),
  },
  // Register rules
  {
    swaggerPath: '/localpools/{localpool_id}/register-metas/{register_meta_id}.patch.parameters',
    setAction: rules => Registers.actions.setValidationRules('metaUpdate', rules),
  },
  {
    swaggerPath: '/localpools/{localpool_id}/meters/{meter_id}/registers/{register_id}.patch.parameters',
    setAction: rules => Registers.actions.setValidationRules('realUpdate', rules),
  },
  // Devices rules
  {
    swaggerPath: '/localpools/{localpool_id}/devices.post.parameters',
    setAction: rules => Devices.actions.setValidationRules('create', rules),
  },
  {
    swaggerPath: '/localpools/{localpool_id}/devices/{device_id}.patch.parameters',
    setAction: rules => Devices.actions.setValidationRules('update', rules),
  },
  // Readings rules
  {
    swaggerPath: '/localpools/{localpool_id}/meters/{meter_id}/registers/{register_id}/readings.post.parameters',
    setAction: Readings.actions.setValidationRules,
  },
  // Billing cycles rules
  {
    swaggerPath: '/localpools/{localpool_id}/billing-cycles.post.parameters',
    setAction: BillingCycles.actions.setValidationRules,
  },
  // Billings rules
  {
    swaggerPath: '/localpools/{localpool_id}/contracts/{localpool_power_taker_contract_id}/billings.post.parameters',
    setAction: rules => Billings.actions.setValidationRules('billingCreate', rules),
  },
  {
    swaggerPath:
      '/localpools/{localpool_id}/contracts/{localpool_power_taker_contract_id}/billings/{billing_id}.patch.parameters',
    setAction: rules => Billings.actions.setValidationRules('billingUpdate', rules),
  },
  {
    swaggerPath:
      '/localpools/{localpool_id}/contracts/{localpool_power_taker_contract_id}/billings/{billing_id}/items/{billing_item_id}.patch.parameters',
    setAction: rules => Billings.actions.setValidationRules('readingAttach', rules),
  },
  // Tariffs
  {
    swaggerPath: '/localpools/{localpool_id}/tariffs.post.parameters',
    setAction: Tariffs.actions.setValidationRules,
  },
  // Organizations
  {
    swaggerPath: '/organizations-market.post.parameters',
    setAction: rules => Organizations.actions.setValidationRules('orgMarketCreate', rules),
  },
  {
    swaggerPath: '/organizations-market/{organization_market_id}.patch.parameters',
    setAction: rules => Organizations.actions.setValidationRules('orgMarketUpdate', rules),
  },
  {
    swaggerPath: '/organizations-market/{organization_market_id}/market-functions.post.parameters',
    setAction: rules => Organizations.actions.setValidationRules('orgMarketAddFunction', rules),
  },
  {
    swaggerPath:
      '/organizations-market/{organization_market2_id}/market-functions/{market_function_id}.patch.parameters',
    setAction: rules => Organizations.actions.setValidationRules('marketFunctionUpdate', rules),
  },
];
