import Meters from './meters';

export default [
  {
    swaggerPath: '/localpools/{localpool_id}/meters/{real_meter_id}.patch.parameters',
    setAction: Meters.actions.setValidationRules,
  },
];
