import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FieldGroup, FieldName, FieldValue } from './style';

interface Props {
  prefix?: string;
  field?: string;
  children: any;
  centered?: string;
}

const TwoColView = ({ prefix, field, children, centered }: Props) => (
  <FieldGroup>
    <FieldName xs="6" {...{centered}}>{prefix && field ? <FormattedMessage id={`${prefix}.${field}`} /> : ''}</FieldName>
    <FieldValue xs="6">{children}</FieldValue>
  </FieldGroup>
);

export default TwoColView;
