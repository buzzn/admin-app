import styled from 'styled-components';

export const DocumentsListHeader = styled.div`
  width: 100%;
  margin-top: 2rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
  .upload-button {
    float: right;
  }
`;

export const DropzoneWrapper = styled.div`
  .dropzone {
    width: 100%;
    height: 10rem;
    border: none;
    background: #e5e5e5;
    cursor: pointer;
    .dropzone-text {
      position: absolute;
      top: 45%;
      left: 40%;
    }
  }
`;
