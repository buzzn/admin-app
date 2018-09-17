import { actions } from 'actions';
import Meters from 'meters';
import Registers from 'registers';
import Readings from 'readings';
import Groups from 'groups';
import Contracts from 'contracts';
import BillingCycles from 'billing_cycles';
import Devices from 'devices';

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
    swaggerPath: '/localpools/{localpool_id}/contracts/{localpool_power_taker_contract_id}.patch.parameters',
    setAction: rules => Contracts.actions.setValidationRules('lptUpdate', rules),
  },
  // Meter rules
  {
    swaggerPath: '/localpools/{localpool_id}/meters/{real_meter_id}.patch.parameters',
    setAction: Meters.actions.setRealValidationRules,
  },
  {
    swaggerPath: '/localpools/{localpool_id}/meters/{virtual_meter_id}.patch.parameters',
    setAction: Meters.actions.setVirtualValidationRules,
  },
  // Register rules
  {
    swaggerPath: '/localpools/{localpool_id}/meters/{real_meter_id}/registers/{real_register_id}.patch.parameters',
    setAction: Registers.actions.setValidationRules,
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
];
