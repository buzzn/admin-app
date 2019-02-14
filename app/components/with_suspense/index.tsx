import React, { Suspense } from 'react';
import Loading from 'components/loading';

function withSuspense(Wrapped) {
  return props => (
    <Suspense fallback={<Loading minHeight={40} />}>
      <Wrapped {...props} />
    </Suspense>
  );
}

export default withSuspense;
