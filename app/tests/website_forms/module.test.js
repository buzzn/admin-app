import { runSaga } from 'redux-saga';
import { actions } from 'website_forms/actions';
import api from 'website_forms/api';
import { logException } from '_util';
import { getWebsiteForms, updateWebsiteForm } from 'website_forms/sagas';

// TODO: move to __mock__
jest.mock('_util', () => ({ logException: jest.fn() }));
jest.mock('website_forms/api');

const apiParams = {
  apiUrl: '',
  apiPath: '',
  token: '',
};

describe('websiteForms module', () => {
  it('fetches websiteForms and stores them', async () => {
    logException.mockClear();
    const dispatched = [];
    api.fetchWebsiteForms = jest.fn(() => ({ _status: 200, array: [] }));

    await runSaga({ dispatch: action => dispatched.push(action) }, getWebsiteForms, { ...apiParams }).done;

    expect(dispatched).toEqual([
      actions.loadingWebsiteForms(),
      actions.setWebsiteForms({ _status: 200, array: [] }),
      actions.loadedWebsiteForms(),
    ]);
    expect(api.fetchWebsiteForms).toBeCalledTimes(1);
    expect(api.fetchWebsiteForms).toHaveBeenLastCalledWith({ ...apiParams });
    expect(logException).not.toHaveBeenCalled();
  });

  it('fails to fetch website forms', async () => {
    logException.mockClear();
    const dispatched = [];
    api.fetchWebsiteForms = null;

    await runSaga({ dispatch: action => dispatched.push(action) }, getWebsiteForms, { ...apiParams }).done;

    expect(dispatched).toEqual([actions.loadingWebsiteForms(), actions.loadedWebsiteForms()]);
    expect(logException).toBeCalledTimes(1);
  });

  it('updates websiteForms and fetches them', async () => {
    logException.mockClear();
    const dispatched = [];
    api.updateWebsiteForm = jest.fn(() => ({ _status: 200 }));
    const resolve = jest.fn();
    const formId = '';
    const params = {};

    await runSaga(
      { dispatch: action => dispatched.push(action) },
      updateWebsiteForm,
      { ...apiParams },
      { formId, params, resolve, reject: null },
    );

    expect(dispatched).toEqual([actions.loadWebsiteForms({ ...apiParams })]);
    expect(api.updateWebsiteForm).toBeCalledTimes(1);
    expect(api.updateWebsiteForm).toHaveBeenLastCalledWith({ ...apiParams, formId, params });
    expect(resolve).toBeCalledTimes(1);
    expect(resolve).toHaveBeenLastCalledWith({ _status: 200 });
  });

  it('updates websiteForms with an err (api)', async () => {
    logException.mockClear();
    const dispatched = [];
    api.updateWebsiteForm = jest.fn(() => ({ _status: 422, _error: 'Error' }));
    const reject = jest.fn();
    const formId = '';
    const params = {};

    await runSaga(
      { dispatch: action => dispatched.push(action) },
      updateWebsiteForm,
      { ...apiParams },
      { formId, params, resolve: null, reject },
    );

    expect(dispatched).toEqual([]);
    expect(api.updateWebsiteForm).toBeCalledTimes(1);
    expect(api.updateWebsiteForm).toHaveBeenLastCalledWith({ ...apiParams, formId, params });
    expect(reject).toBeCalledTimes(1);
  });

  it('fails to update websiteForms', async () => {
    logException.mockClear();
    const dispatched = [];
    api.updateWebsiteForm = null;
    const formId = '';
    const params = {};

    await runSaga(
      { dispatch: action => dispatched.push(action) },
      updateWebsiteForm,
      { ...apiParams },
      { formId, params, resolve: null, reject: null },
    );

    expect(dispatched).toEqual([]);
    expect(logException).toBeCalledTimes(1);
  });
});
