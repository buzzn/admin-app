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
      case 'documented':
        return '245, 124, 0';
      case 'queued':
        return '212, 225, 87';
      case 'delivered':
        return '0, 0, 0';
      case 'void':
        return '216, 67, 21';
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
