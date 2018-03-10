import styled from 'styled-components';

export const SignInWrapper = styled.div`
  background: transparent;
  height: 100vh;
  padding-top: calc(50vh - 15rem);
  position: relative;
  .background {
    background: #2f2f2f;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .bubbles-wrapper {
    position: absolute;
    width: 80%;
    height: 100%;
    left: 10%;
    top: 0;
  }
  .form-signin-wrapper {
    position: relative;
    z-index: 100;
    background: white;
    border-radius: 2rem;
    width: 30rem;
    min-height: 30rem;
    padding: 1rem;
    box-shadow: 0 0.125rem 1rem 0 rgba(0, 0, 0, 0.2);
    margin: 0 auto;
    .form-signin {
      padding: 4rem 5rem;
      .signin-logo {
        margin: 0 auto 1.5rem auto;
        display: block;
        width: 18rem;
      }
      .form-signin-heading,
      .checkbox {
        margin-bottom: 0.5rem;
      }
      input + button {
        margin-top: 2rem;
      }
      .form-control {
        position: relative;
        height: auto;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
      }
      .btn {
        cursor: pointer;
        display: block;
        margin-left: auto;
        margin-right: auto;
        position: relative;
        padding-right: 3rem;
        i.fa {
          position: absolute;
          right: 1rem;
          top: 0.5rem;
          font-size: 20px;
        }
      }
    }
  }
`;
