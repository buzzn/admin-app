import * as React from 'react';
import { connect } from 'react-redux';
import Loading from 'components/loading';

const Details = ({ close }: ExtProps) => (
  <div>
    <i className="fa fa-2x fa-close close" onClick={close} />
    <Loading minHeight={40} />
  </div>
);

interface StatePart {}

interface ExtProps {
  close: () => void;
}

interface StateProps {}

interface DispatchProps {}

function mapStateToProps(_state: StatePart) {
  return {};
}


export default connect<StateProps, DispatchProps, ExtProps>(mapStateToProps, {})(Details);
