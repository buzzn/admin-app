import * as React from 'react';
import { Link } from 'react-router-dom';
import { TitleLink } from './style';

export interface LinkBackProps {
  url?: string;
  title: string;
}

const LinkBack = ({ url, title }: LinkBackProps) => {
  if (url) {
    return (
      <TitleLink>
        <Link to={url}>
          <i className="fa fa-chevron-left" /> {title}
        </Link>
      </TitleLink>
    );
  }
  return <TitleLink>{title}</TitleLink>;
};

export default LinkBack;
