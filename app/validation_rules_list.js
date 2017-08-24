import { actions } from './actions';
import Meters from './meters';
import Registers from './registers';

export default [
  {
    swaggerPath: '/me.patch.parameters',
    setAction: actions.setUserMeValidationRules,
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
];
