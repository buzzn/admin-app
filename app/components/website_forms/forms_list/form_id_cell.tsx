import * as React from 'react';

interface Props {
  original: { [key: string]: any };
  changeFormId: Function;
}

interface State {}

class FormIdCell extends React.Component<Props, State> {
  state = { formId: 0 };

  handleInputChange = ({ target: { value } }) => {
    this.setState({ formId: value });
  };

  componentDidMount() {
    const { original: { comment } } = this.props;
    const formId = comment ? parseInt(comment.split('/')[0]) || 0 : 0;
    this.setState({ formId });
  }

  render() {
    const { changeFormId, original } = this.props;
    const { formId } = this.state;
    return (
      <React.Fragment>
        <input type="number" value={formId} onChange={this.handleInputChange} />
        <button
          onClick={() => {
            changeFormId({
              id: original.id,
              processed: original.processed,
              updatedAt: original.updatedAt,
              comment: `${formId}/1`,
            });
          }}
        >
          Set new ID
        </button>
      </React.Fragment>
    );
  }
}

export default FormIdCell;
