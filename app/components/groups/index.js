import React from 'react';

export default ({ groups }) => (
  <div>
    <h4>Groups:</h4>
    { groups.map(group => (
      <div key={ group.id }>
        { group.attributes.name }
      </div>
    )) }
  </div>
);

