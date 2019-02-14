import * as React from 'react';

import { LabeledValueWrapper, Label, Value } from './style';

const LabeledValue = ({ label, value, valueClassName = '' }) => (
  <LabeledValueWrapper>
    <Label>{label}</Label>: <Value className={valueClassName}>{value}</Value>
  </LabeledValueWrapper>
);

export default LabeledValue;
