import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router-dom';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import WebsiteForms from 'website_forms';
import Loading from 'components/loading';
import FormsList from './forms_list';
import FormData from './form_data';
import formConverter from './form_converter';

class Devices extends React.Component<
  ExtProps & StateProps & DispatchProps & InjectedIntlProps & RouteComponentProps<{}>,
  ComponentState
  > {
  state = { exporting: false };

  componentDidMount() {
    this.props.loadWebsiteForms();
  }

  componentWillUnmount() {
    this.props.setWebsiteForms({ _status: null, array: [] });
  }

  exportForms = async (forms) => {
    this.setState({ exporting: true });
    formConverter(forms.map(f => ({ ...f.formContent, createdAt: f.createdAt })));
    await Promise.all(forms.map(f => this.changeProcessed({ id: f.id, updatedAt: f.updatedAt, processed: true })));
    this.setState({ exporting: false });
  };

  changeProcessed = ({ id, updatedAt, processed }) => {
    const { updateWebsiteForm } = this.props;
    return new Promise((resolve, reject) => updateWebsiteForm({
      formId: id,
      params: { processed, updatedAt },
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

    const { exporting } = this.state;

    if (websiteForms._status === 404 || websiteForms._status === 403) {
      setWebsiteForms({ _status: null, array: [] });
      return <Redirect to="/" />;
    }

    if (websiteForms._status === null || loading || exporting) return <Loading minHeight={40} />;

    return (
      <React.Fragment>
        <Switch>
          <Route exact path={url}>
            <FormsList {...{ websiteForms: websiteForms.array, history, url, changeProcessed: this.changeProcessed, exportForms: this.exportForms }} />
          </Route>
          <Route
            path={`${url}/:formId`}
            render={({ match: { params: { formId } } }) => {
              const form = websiteForms.array.find(f => f.id === formId);
              return <FormData {...{ form }} />;
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
)(injectIntl(Devices));
