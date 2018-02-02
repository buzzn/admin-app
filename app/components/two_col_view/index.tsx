import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FieldGroup, FieldName, FieldValue } from './style';

interface Props {
  prefix?: string;
  field?: string;
  children: any;
}

const TwoColView = ({ prefix, field, children }: Props) => (
  <FieldGroup>
    <FieldName xs="6">{prefix && field ? <FormattedMessage id={`${prefix}.${field}`} /> : ''}</FieldName>
    <FieldValue xs="6">{children}</FieldValue>
  </FieldGroup>
);

export default TwoColView;
