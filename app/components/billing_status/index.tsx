import * as React from 'react';

interface Props {
  status: string | 'open' | 'calculated' | 'delivered' | 'settled' | 'closed';
  size: 'small' | 'large';
}

const BillingStatus = ({ status, size }: Props) => {
  const statuses = {
    open: {
      icon: 'fa-pencil',
      color: '#1E88E5',
    },
    calculated: {
      icon: 'fa-eur',
      color: '#FDD835',
    },
    delivered: {
      icon: 'fa-arrow-circle-o-right',
      color: '#000000',
    },
    settled: {
      icon: 'fa-check',
      color: '#21D343',
    },
    closed: {
      icon: 'fa-check',
      color: '#D8D8D8',
    },
  };
  return (
    <span className={`fa-stack ${size === 'large' ? 'fa-lg' : ''}`}>
      <i className="fa fa-circle fa-stack-2x" style={{ color: statuses[status].color, lineHeight: '1.5rem' }} />
      <i className={`fa ${statuses[status].icon} fa-stack-1x fa-inverse`} style={{ lineHeight: '1.5rem' }} />
    </span>
  );
};

export default BillingStatus;
