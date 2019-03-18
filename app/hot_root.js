import React from 'react';
import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';
import { IntlProvider, addLocaleData } from 'react-intl';
import moment from 'moment';
import en from 'react-intl/locale-data/en';
import de from 'react-intl/locale-data/de';
import allMessages from '@buzzn/i18n';
import store from './configure_store';
import Root from './root';

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

const App = () => (
  <IntlProvider locale={language()} messages={allMessages[language()]} onError={() => false}>
    <Provider store={store}>
      <Root />
    </Provider>
  </IntlProvider>
);

export default hot(App);
