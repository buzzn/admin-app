import styled from 'styled-components';

export const BreadcrumbsWrap = styled.div`
  height: 16px;
  color: #9e9e9e;
  font-size: 13px;
  line-height: 16px;
  background-color: white;
  ul {
    list-style: none;
    padding: 0;
    li {
      display: inline-block;
      a {
        color: #9e9e9e;
      }
    }
  }
  .breadcrumb-type {
    font-weight: bold;
    text-transform: capitalize;
  }
`;
