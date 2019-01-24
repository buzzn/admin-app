import styled from 'styled-components';

export const CellWrap = styled.div`
  height: 2.5rem;
  background-color: rgba(
    ${(props) => {
    switch (props.status) {
      case 'open':
        return '30, 136, 229';
      case 'calculated':
        return '253, 216, 53';
      case 'delivered':
        return '0, 0, 0';
      case 'settled':
        return '33, 211, 67';
      case 'closed':
        return '216, 216, 216';
      default:
        return '0, 0, 0';
    }
  }},
    0.3
  );
`;
