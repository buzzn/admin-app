import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import Redbox from 'redbox-react';
import { IntlProvider, addLocaleData } from 'react-intl';
import moment from 'moment';
import en from 'react-intl/locale-data/en';
import de from 'react-intl/locale-data/de';
import allMessages from '@buzzn/i18n';
import store from './configure_store';
import Root from './root';

addLocaleData([...en, ...de]);

function language() {
  let lang =
    navigator.language ||
    (navigator.userLanguage && navigator.userLanguage.replace(/-[a-z]{2}$/, String.prototype.toUpperCase)) ||
    'de-DE';
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

const render = (Component) => {
  ReactDOM.render(
    <AppContainer errorReporter={Redbox}>
      <IntlProvider locale={language()} messages={allMessages[language()]}>
        <Provider store={store}>
          <Component />
        </Provider>
      </IntlProvider>
    </AppContainer>,
    document.querySelector('#root'),
  );
};

render(Root);

if (module.hot) {
  module.hot.accept('./root', () => {
    const NewRoot = require('./root').default;
    render(NewRoot);
  });
}
