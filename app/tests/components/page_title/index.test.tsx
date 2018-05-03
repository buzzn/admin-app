import React from 'react';
import renderer from 'react-test-renderer';
import PageTitle from 'components/page_title';

describe('page title tests', () => {
  const breadcrumbs = [{ id: 0, title: 'Title' }];
  const title = 'Page title';

  test('regular', () => {
    const tree = renderer.create(<PageTitle {...{ title, breadcrumbs }} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('thin', () => {
    const tree = renderer.create(<PageTitle {...{ title, breadcrumbs, thin: 'true' }} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
