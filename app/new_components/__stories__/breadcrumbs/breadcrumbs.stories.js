import React from 'react';
import { storiesOf } from '@storybook/react';
import StoryRouter from 'storybook-router';
import Breadcrumbs from 'new_components/breadcrumbs';

storiesOf('Atoms/Breadcrumbs')
  .addDecorator(StoryRouter())
  .add('basic', () => {
    const breadcrumbs = [
      { id: 1, title: 'Root', link: '#' },
      { id: 2, title: 'Hopf', link: '#' },
      { id: 3, title: '0077832', type: 'contract' },
    ];
    return <Breadcrumbs breadcrumbs={ breadcrumbs }/>;
  })
  .add('types', () => {
    const breadcrumbs = [
      { id: 1, title: 'Root', type: 'meter', link: '#' },
      { id: 2, title: 'Hopf', type: 'register', link: '#' },
      { id: 3, title: '0077832', type: 'contract', link: '#' },
      { id: 4, title: '0077832', type: 'contracting party', link: '#' },
      { id: 5, title: '0077832', type: 'tariff', link: '#' },
      { id: 6, title: '0077832', type: 'formula', link: '#' },
      { id: 7, title: '0077832', type: 'reading' },
    ];
    return <Breadcrumbs breadcrumbs={ breadcrumbs }/>;
  });
