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
  {
    swaggerPath: '/localpools/{localpool_id}.patch.parameters',
    setAction: Groups.actions.setValidationRules,
  },
  {
    swaggerPath: '/localpools/{localpool_id}/meters/{real_meter_id}.patch.parameters',
    setAction: Meters.actions.setRealValidationRules,
  },
  {
    swaggerPath: '/localpools/{localpool_id}/meters/{virtual_meter_id}.patch.parameters',
    setAction: Meters.actions.setVirtualValidationRules,
  },
  {
    swaggerPath: '/localpools/{localpool_id}/meters/{real_meter_id}/registers/{real_register_id}.patch.parameters',
    setAction: Registers.actions.setValidationRules,
  },
  {
    swaggerPath: '/localpools/{localpool_id}/meters/{meter_id}/registers/{register_id}/readings.post.parameters',
    setAction: Readings.actions.setValidationRules,
  },
  {
    swaggerPath: '/localpools/{localpool_id}/billing-cycles.post.parameters',
    setAction: BillingCycles.actions.setValidationRules,
  },
];
