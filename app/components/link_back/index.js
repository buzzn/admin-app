import * as React from 'react';
import { Link } from 'react-router-dom';

const LinkBack = ({ url, title }) => {
  if (url) {
    return (
      <h1 className="h3">
        <Link to={url}>
          <i className="fa fa-chevron-left" /> {title}
        </Link>
      </h1>
    );
  }
  return <h1 className="h3">{title}</h1>;
};

export default LinkBack;
