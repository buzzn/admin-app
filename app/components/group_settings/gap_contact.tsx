import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Col } from 'reactstrap';
import Owner from './owner';

interface Props {
  gap: any;
  gapAddress: any;
  gapContact: any;
  gapContactAddress: any;
}

const GapContact = ({ gap, gapAddress, gapContact, gapContactAddress }: Props) => {
  const prefix = 'admin.groups';
  return (
    <Col xs="12">
      {!!gap.id && (
        <>
          <p className="h5 grey-underline header text-uppercase mt-4">
            <FormattedMessage id={`${prefix}.headerGapCustomer`} />
          </p>
          {gap.type === 'person' ? (
            <Owner {...{ address: gapAddress, owner: gap }} />
          ) : (
            <>
              <Owner {...{ address: gapAddress, owner: gap }} />
              {!!gapContact.id && <Owner {...{ contact: true, address: gapContactAddress, owner: gapContact }} />}
            </>
          )}
        </>
      )}
    </Col>
  );
};

export default GapContact;
