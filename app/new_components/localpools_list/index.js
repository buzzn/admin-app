// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { CardDeck, Card, CardText, CardBody, CardTitle } from 'reactstrap';
import filter from 'lodash/filter';
import chunk from 'lodash/chunk';
import Groups from 'groups';

type Props = {
  // TODO: replace with action
  loadGroups: Function,
  myProfile: { firstName: string, lastName: string },
  groups: Array<Object>,
  match: { url: string },
};

export class LocalpoolsList extends React.Component<Props> {
  static defaultProps = {
    groups: [],
    myProfile: { firstName: '', lastName: '' },
  };

  componentWillMount() {
    this.props.loadGroups();
  }

  render() {
    const { myProfile: { firstName, lastName }, groups, match: { url } } = this.props;

    return (
      <div>
        <p className="h4">{ `${firstName} ${lastName}` }</p>
        {
          chunk(groups, 2).map(groupPair => (
            <CardDeck key={ groupPair[0].id }>
              {
                groupPair.map(group => (
                  <Card key={ group.id }>
                    <CardBody>
                      <CardTitle><Link to={ `${url}/${group.id}` }>{ group.name }</Link></CardTitle>
                      <CardText>{ group.description }</CardText>
                    </CardBody>
                  </Card>
                ))
              }
            </CardDeck>
          ))
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    myProfile: state.app.userMe,
    groups: filter(state.groups.groups, group => group.type === 'group_localpool'),
  };
}

export default connect(mapStateToProps, {
  loadGroups: Groups.actions.loadGroups,
})(LocalpoolsList);
