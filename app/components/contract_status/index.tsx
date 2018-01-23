import * as React from 'react';

interface Props {
  status: 'onboarding' | 'active' | 'terminated' | 'ended';
  size: 'small' | 'large';
}

const ContractStatus = ({ status, size }: Props) => {
  const statuses = {
    onboarding: {
      icon: 'fa-check',
      color: '#FDD835',
    },
    active: {
      icon: 'fa-check',
      color: '#21D343',
    },
    terminated: {
      icon: 'fa-minus',
      color: '#FF4A00',
    },
    ended: {
      icon: 'fa-minus',
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

export default ContractStatus;
