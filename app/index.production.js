import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { IntlProvider, addLocaleData } from 'react-intl';
import moment from 'moment';
import en from 'react-intl/locale-data/en';
import de from 'react-intl/locale-data/de';
import allMessages from '@buzzn/i18n';
import * as Sentry from '@sentry/browser';
import store from './configure_store';
import Root from './root';

Sentry.init({
  dsn: 'https://2ebfe56b13714bd7b614df15f9d3a3fd@sentry.io/195034',
  environment: process.env.NODE_ENV,
  beforeSend(event) {
    if (event.exception && process.env.NODE_ENV === 'staging') {
      Sentry.showReportDialog();
    }
    return event;
  },
});

addLocaleData([...en, ...de]);

function language() {
  let lang = navigator.language
    || (navigator.userLanguage && navigator.userLanguage.replace(/-[a-z]{2}$/, String.prototype.toUpperCase))
    || 'de-DE';
  if (lang === 'en-GB') lang = 'en-US';
  if (lang.length === 2) {
    if (lang === 'en') lang = 'en-US';
    if (lang === 'de') lang = 'de-DE';
  }
  if (!['en-US', 'de-DE'].includes(lang)) lang = 'de-DE';
  moment.locale(lang);
  moment.updateLocale(moment.locale(), { invalidDate: '' });
  return lang;
}

render(
  <IntlProvider locale={language()} messages={allMessages[language()]}>
    <Provider store={store}>
      <Root />
    </Provider>
  </IntlProvider>,
  document.querySelector('#root'),
);
