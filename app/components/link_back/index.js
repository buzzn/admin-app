import * as React from 'react';
import { Link } from 'react-router-dom';

const LinkBack = ({ url, title }) => {
  if (url) {
    return (
      <span className="h3">
        <Link to={url}>
          <i className="fa fa-chevron-left" /> {title}
        </Link>
      </span>
    );
  }
  return <span className="h3">{title}</span>;
};

export default LinkBack;
