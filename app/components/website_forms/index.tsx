import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router-dom';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import WebsiteForms from 'website_forms';
import Loading from 'components/loading';
import FormsList from './forms_list';
import FormData from './form_data';
import formConverter from './form_converter';

class WebsiteFormsComponent extends React.Component<
  ExtProps & StateProps & DispatchProps & InjectedIntlProps & RouteComponentProps<{}>,
  ComponentState
  > {
  state = { exporting: false, startingId: 0, idDirty: false, idError: '', idExtracted: false };

  componentDidMount() {
    this.props.loadWebsiteForms();
  }

  componentDidUpdate(prevProps) {
    const { websiteForms } = this.props;
    const { idDirty, idExtracted } = this.state;
    if (idDirty || (idExtracted && prevProps.websiteForms._status === websiteForms._status)) return;
    const lastId = websiteForms.array
      .reduce((s, f) => {
        const id = parseInt((f.comment || '').split('/')[0]);
        if (!id) return s;
        return [...s, id];
      }, [])
      .sort((a, b) => a - b)
      .reverse()[0];
    this.setState({
      startingId: lastId ? lastId + 1 : 0,
      idError: lastId ? '' : 'Please, specify id seed ',
      idExtracted: true,
    });
  }

  componentWillUnmount() {
    this.props.setWebsiteForms({ _status: null, array: [] });
  }

  changeStartingId = ({ target: { value } }) => {
    if (!parseInt(value)) {
      this.setState({ idError: 'Must be Num' });
    } else {
      this.setState({ startingId: parseInt(value), idDirty: true, idError: '' });
    }
  };

  exportForms = async (forms) => {
    const { startingId } = this.state;
    if (!startingId) {
      this.setState({ idError: 'Please, specify id seed ' });
      return;
    }
    this.setState({ exporting: true });
    let newStartingId = startingId;
    formConverter(
      forms.map(f => ({
        ...f.formContent,
        createdAt: f.createdAt,
        formId: f.comment ? f.comment.split('/')[0] : newStartingId++,
      })),
    );
    newStartingId = startingId;
    await Promise.all(
      forms.map(f => this.changeProcessed({
        id: f.id,
        updatedAt: f.updatedAt,
        processed: true,
        comment: f.comment || `${newStartingId++}/1`,
      })),
    );
    this.setState({ exporting: false, startingId: newStartingId, idExtracted: false });
  };

  changeFormId = async ({ id, updatedAt, processed, comment }) => {
    this.setState({ exporting: true });
    await this.changeProcessed({ id, updatedAt, processed, comment });
    this.setState({ idExtracted: false, idDirty: false, exporting: false });
  };

  changeProcessed = ({ id, updatedAt, processed, comment }) => {
    const { updateWebsiteForm } = this.props;
    return new Promise((resolve, reject) => updateWebsiteForm({
      formId: id,
      params: { processed, updatedAt, comment },
      resolve,
      reject,
    }));
  };

  render() {
    const {
      setWebsiteForms,
      websiteForms,
      loading,
      history,
      match: { url },
    } = this.props;

    const { exporting, startingId, idError } = this.state;

    if (websiteForms._status === 404 || websiteForms._status === 403) {
      setWebsiteForms({ _status: null, array: [] });
      return <Redirect to="/" />;
    }

    if (websiteForms._status === null || loading || exporting) return <Loading minHeight={40} />;

    return (
      <React.Fragment>
        <Switch>
          <Route exact path={url}>
            <FormsList
              {...{
                breadcrumbs: [{ id: 'forms', title: 'WebsiteForms' }],
                websiteForms: websiteForms.array,
                history,
                url,
                changeProcessed: this.changeProcessed,
                exportForms: this.exportForms,
                startingId,
                idError,
                changeStartingId: this.changeStartingId,
              }}
            />
          </Route>
          <Route
            path={`${url}/:formId`}
            render={({ match: { params: { formId } } }) => {
              const form = websiteForms.array.find(f => f.id === formId);
              return (
                <FormData
                  {...{
                    breadcrumbs: [{ id: 'forms', link: url, title: 'WebsiteForms' }, { id: form.id, title: form.id }],
                    form,
                    changeFormId: this.changeFormId,
                  }}
                />
              );
            }}
          />
        </Switch>
      </React.Fragment>
    );
  }
}

interface ExtProps {}

interface ComponentState {
  exporting: boolean;
  startingId: number;
  idDirty: boolean;
  idError: string;
  idExtracted: boolean;
}

interface StatePart {
  websiteForms: {
    loadingWebsiteForms: boolean;
    websiteForms: { _status: null | number; array: Array<{ [key: string]: any }> };
  };
}

interface StateProps {
  websiteForms: { _status: null | number; array: Array<{ [key: string]: any }> };
  loading: boolean;
}

interface DispatchProps {
  loadWebsiteForms: Function;
  setWebsiteForms: Function;
  updateWebsiteForm: Function;
}

function mapStateToProps(state: StatePart) {
  return {
    websiteForms: state.websiteForms.websiteForms,
    loading: state.websiteForms.loadingWebsiteForms,
  };
}

export default connect<StateProps, DispatchProps, ExtProps>(
  mapStateToProps,
  {
    loadWebsiteForms: WebsiteForms.actions.loadWebsiteForms,
    setWebsiteForms: WebsiteForms.actions.setWebsiteForms,
    updateWebsiteForm: WebsiteForms.actions.updateWebsiteForm,
  },
)(injectIntl(WebsiteFormsComponent));
