import { actions } from 'actions';
import Meters from 'meters';
import Registers from 'registers';
import Readings from 'readings';
import Groups from 'groups';
import BillingCycles from 'billing_cycles';

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
