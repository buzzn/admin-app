import * as React from 'react';
import { BreadcrumbsProps } from 'components/breadcrumbs';
import PageTitle from 'components/page_title';

interface Props {
  form: { [key: string]: any };
  changeFormId: Function;
}

interface State {
  formId: number;
}

class FormData extends React.Component<Props & BreadcrumbsProps, State> {
  state = { formId: 0 };

  handleInputChange = ({ target: { value } }) => {
    this.setState({ formId: value });
  };

  componentDidMount() {
    const { form: { comment } } = this.props;
    const formId = comment ? parseInt(comment.split('/')[0]) || 0 : 0;
    this.setState({ formId });
  }

  render() {
    const { form, changeFormId, breadcrumbs } = this.props;
    const { formId } = this.state;

    return (
      <React.Fragment>
        <PageTitle breadcrumbs={breadcrumbs} title={`Form ${form.id}`} />
        <input type="number" value={formId} onChange={this.handleInputChange} />
        <button
          onClick={() => {
            changeFormId({
              id: form.id,
              processed: form.processed,
              updatedAt: form.updatedAt,
              comment: `${formId}/1`,
            });
          }}
        >
          Set new ID
        </button>

        <pre>{JSON.stringify(form, null, 2)}</pre>
      </React.Fragment>
    );
  }
}

export default FormData;
