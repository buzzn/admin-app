import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import de from 'react-intl/locale-data/de';
import allMessages from '@buzzn/i18n';
import configureStore from './configure_store';
import Root from './root';

addLocaleData([...en, ...de]);

function language() {
  let lang = navigator.language ||
    (navigator.userLanguage && navigator.userLanguage.replace(/-[a-z]{2}$/, String.prototype.toUpperCase)) ||
    'de-DE';
  if (lang.length === 2) {
    if (lang === 'en') lang = 'en-US';
    if (lang === 'de') lang = 'de-DE';
  }
  return lang;
}

render(
  <IntlProvider locale={language()} messages={allMessages[language()]}>
    <Provider store={configureStore()}>
      <Root />
    </Provider>
  </IntlProvider>,
  document.querySelector('#root')
);
