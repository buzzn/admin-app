import * as React from 'react';
import Loading from 'components/loading';
import { LoadingWrapper } from './style';

const AppLoading = () => (
  <LoadingWrapper>
    <Loading minHeight={10} />
  </LoadingWrapper>
);

export default AppLoading;
