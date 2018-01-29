import * as React from 'react';

import './style.scss';

interface Props {
  type: 'contract_metering_point_operator' | 'contract_localpool_processing' | 'contract_localpool_power_taker';
  size: 'small' | 'large';
}

const ContractType = ({ type, size }: Props) => {
  const types = {
    contract_metering_point_operator: {
      value: 'MV',
      inverted: 'inverted',
    },
    contract_localpool_processing: {
      value: 'AV',
      inverted: '',
    },
    contract_localpool_power_taker: {
      value: 'LSN',
      inverted: 'inverted',
    },
  };

  if (!types[type]) return null;

  return (
    <span className={`contract-type ${size} ${types[type].inverted}`}
      style={{
        border: '1px solid #2f2f2f',
        borderRadius: '2px',
        lineHeight: size === 'small' ? '1.2rem' : '1.8rem',
        display: 'inline-block',
        padding: size === 'small' ? '0 0.2rem' : '0 0.4rem',
        fontSize: size === 'small' ? '13px' : '16px',
        fontWeight: size === 'small' ? 'bold' : 'normal',
        color: types[type].inverted ? 'white' : 'black',
        backgroundColor: types[type].inverted ? 'black' : 'white',
      }}
    >
      {types[type].value}
    </span>
  );
};

export default ContractType;
