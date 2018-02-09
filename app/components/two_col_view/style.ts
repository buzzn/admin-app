import styled from 'styled-components';
import { Row, Col } from 'reactstrap';

export const FieldGroup = styled(Row)`
  font-size: 13px;
  min-height: 57px;
  align-items: center;
`;

export const FieldName = styled(Col)`
  font-weight: bold;
  text-transform: uppercase;
`;

export const FieldValue = styled(Col)`
  padding: 8px 0;
  min-height: 56px;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e0e0e0;
`;
