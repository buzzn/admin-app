import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router';

import './style.scss';

export default () => (
  <div className="col-sm-3 col-md-2 sidebar">
    <ListGroup>
      <ListGroupItem><Link to='/'>Home</Link></ListGroupItem>
      <ListGroupItem><Link to='/groups'>Groups</Link></ListGroupItem>
      <ListGroupItem><Link to='/users'>Users</Link></ListGroupItem>
    </ListGroup>
  </div>
);
