import * as React from 'react';
import { FooterWrapper } from './style';

const Footer = () => (
  <FooterWrapper>
    Made for a peaceful planet! Copyright 2009-{new Date().getFullYear()} <span>BUZZN</span>
  </FooterWrapper>
);

export default Footer;
