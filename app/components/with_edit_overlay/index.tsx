import * as React from 'react';
import { EditOverlayContext } from 'root';

function withEditOverlay(Component) {
  return function WrappedComponent(props) {
    return (
      <EditOverlayContext.Consumer>
        {({ editMode, switchEditMode, setEditMode }) => <Component {...props} {...{ editMode, switchEditMode, setEditMode }} />}
      </EditOverlayContext.Consumer>
    );
  };
}

export default withEditOverlay;
