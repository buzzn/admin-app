import * as React from 'react';
import { EditOverlayContext } from 'root';

function withEditOverlay(Component) {
  return function WrappedComponent(props) {
    return (
      <EditOverlayContext.Consumer>
        {({ editMode, switchEditMode }) => <Component {...props} {...{ editMode, switchEditMode }} />}
      </EditOverlayContext.Consumer>
    );
  };
}

export default withEditOverlay;
