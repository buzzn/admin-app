import React, { useState } from 'react';
import ItemDetails from 'components/powertakers/billings_list/item_details';
import { ManageReadingContext } from './index';
import { BillingWrapper } from './style';

const Billing = ({ billing }) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <BillingWrapper>
      <div className="billing-name" onClick={() => setOpen(!isOpen)}>
        {billing.invoiceNumber}:
      </div>
      <br />
      {isOpen && billing.items.array.map(item => <ItemDetails {...{ key: item.id, item, ManageReadingContext }} />)}
    </BillingWrapper>
  );
};

export default Billing;
