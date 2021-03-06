import * as React from 'react';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { Wrapper } from './style';

interface Props {
  editMode: boolean;
  dirty: boolean;
  onCancel: () => void;
  onSave: () => void;
  cancelDisabled: boolean;
  saveDisabled: boolean;
}

interface State {
  top: number;
}

class FormPanel extends React.Component<Props & InjectedIntlProps, State> {
  wrapperRef: any;

  buttonsRef: any;

  ticking: boolean;

  constructor(props) {
    super(props);

    this.wrapperRef = React.createRef();
    this.buttonsRef = React.createRef();

    this.ticking = false;
  }

  state = { top: 0 };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, true);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll, true);
    window.onbeforeunload = null;
  }

  componentDidUpdate(prevProps) {
    if (this.props.editMode && !prevProps.editMode) {
      this.handleScroll();
      if (this.wrapperRef.current) window.scrollBy(0, this.wrapperRef.current.getBoundingClientRect().top - 72);
    }
    if (this.props.dirty && !prevProps.dirty) {
      window.onbeforeunload = () => true;
    }
    if ((!this.props.editMode && prevProps.editMode) || (!this.props.dirty && prevProps.dirty)) {
      window.onbeforeunload = null;
    }
  }

  handleScroll = () => {
    if (!this.buttonsRef.current || this.ticking) return;

    window.requestAnimationFrame(() => {
      if (this.wrapperRef.current) {
        const wrapperSize = this.wrapperRef.current.getBoundingClientRect();
        let top = window.innerHeight / 2 - wrapperSize.top - 36;
        if (top + 72 > wrapperSize.height) {
          top = wrapperSize.height - 72;
        } else if (top < 0) {
          top = 0;
        }
        this.setState({ top });
      }

      this.ticking = false;
    });

    this.ticking = true;
  };

  render() {
    const { editMode, children, onCancel, onSave, cancelDisabled, saveDisabled, dirty, intl } = this.props;
    const { top } = this.state;

    return (
      <Wrapper {...{ editMode }} ref={this.wrapperRef} style={{ maxWidth: `calc(100% - 275px)` }}>
        {editMode && (
          <div className="side-buttons" ref={this.buttonsRef} style={{ top: `${top}px` }}>
            <button
              className="btn btn-link"
              type="button"
              onClick={(event) => {
                if (dirty && confirm(intl.formatMessage({ id: 'admin.messages.cancelDirtyForm' }))) {
                  onCancel();
                } else if (!dirty) {
                  onCancel();
                } else {
                  event.currentTarget.blur();
                  event.preventDefault();
                }
              }}
              disabled={cancelDisabled}
              data-cy="form button cancel"
            >
              <FormattedMessage id="admin.buttons.cancel" />
              <i className="fa fa-close" />
            </button>
            <button
              className="btn btn-primary"
              onClick={onSave}
              disabled={saveDisabled}
              type="submit"
              data-cy="form button save"
            >
              <FormattedMessage id="admin.buttons.save" />
              <i className="fa fa-check" />
            </button>
          </div>
        )}
        {children}
      </Wrapper>
    );
  }
}

export default injectIntl(FormPanel);
