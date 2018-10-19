import * as React from 'react';

const FormData = ({ form }) => (
  <div>
    <pre>{JSON.stringify(form, null, 2)}</pre>
  </div>
);

export default FormData;
