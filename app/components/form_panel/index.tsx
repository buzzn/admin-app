import * as React from 'react';
import { Wrapper } from './style';

interface Props {
  editMode: boolean;
  onCancel: () => void;
  onSave: () => void;
}

interface State {
  top: number;
}

class FormPanel extends React.Component<Props, State> {
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
  }

  componentDidUpdate(prevProps) {
    if (this.props.editMode && !prevProps.editMode) this.handleScroll();
  }

  handleScroll = () => {
    if (!this.buttonsRef.current || this.ticking) return;

    window.requestAnimationFrame(() => {
      const wrapperSize = this.wrapperRef.current.getBoundingClientRect();
      let top = window.innerHeight / 2 - wrapperSize.top - 36;
      if (top + 72 > wrapperSize.height) {
        top = wrapperSize.height - 72;
      } else if (top < 0) {
        top = 0;
      }
      this.setState({ top });

      this.ticking = false;
    });

    this.ticking = true;
  };

  render() {
    const { editMode, children, onCancel, onSave } = this.props;
    const { top } = this.state;

    return (
      <Wrapper {...{ editMode }} innerRef={this.wrapperRef}>
        {editMode && (
          <div className="side-buttons" ref={this.buttonsRef} style={{ top: `${top}px` }}>
            <button className="btn btn-link" onClick={onCancel}>
              Cancel
              <i className="fa fa-close" />
            </button>
            <button className="btn btn-primary" onClick={onSave}>
              Save
              <i className="fa fa-check" />
            </button>
          </div>
        )}
        {children}
      </Wrapper>
    );
  }
}

export default FormPanel;
