import * as React from 'react';

import { LabeledValueWrapper, Label, Value } from './style';

const LabeledValue = ({ label, value }) => (
  <LabeledValueWrapper>
    <Label>{label}</Label>: <Value>{value}</Value>
  </LabeledValueWrapper>
);

export default LabeledValue;
