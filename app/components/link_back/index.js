// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  url?: string,
  title: string,
};

const LinkBack = ({ url, title }: Props) => {
  if (url) return <p className="h4"><Link to={ url }><i className="fa fa-chevron-left"/> { title }</Link></p>;
  return <p className="h4">{ title }</p>
}

export default LinkBack;
