import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { setIntlConfig, withIntl } from 'storybook-addon-intl';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import de from 'react-intl/locale-data/de';
import allMessages from '@buzzn/i18n';
import Provider from './provider';

import '../app/react_table_config';

import 'buzzn-style';
import 'react-table/react-table.css';
import 'react-widgets/dist/css/react-widgets.css';
import '../app/root.scss';

addLocaleData([...en, ...de]);

const getMessages = (locale) => allMessages[locale];

setIntlConfig({
    locales: ['en-US', 'de-DE'],
    defaultLocale: 'en-US',
    getMessages
});

addDecorator(withIntl);

addDecorator(story => (
  <div className="new-ui" style={{ padding: '20px' }}>
    { story() }
  </div>
));

addDecorator((story) => {
  return <Provider story={ story() } />;
});

const req = require.context('../app/components/__stories__', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
