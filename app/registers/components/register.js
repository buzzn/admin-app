import React from 'react';

export default ({ register }) => (
  <div>
    { register.attributes.name } : { register.attributes.direction }
  </div>
);
