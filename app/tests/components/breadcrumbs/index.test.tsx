import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import Breadcrumbs from 'components/breadcrumbs';

describe('breadcrumbs tests', () => {
  test('renders different crumb types', () => {
    const breadcrumbs = [
      { id: 0, title: 'Title' },
      { id: 1, type: 'meter', title: 'Title' },
      { id: 2, link: 'localhost', title: 'Title' },
      { id: 2, type: 'meter', link: 'localhost', title: 'Title' },
    ];
    const tree = renderer
      .create(<MemoryRouter>
          <Breadcrumbs {...{ breadcrumbs }} />
        </MemoryRouter>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
