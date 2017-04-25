import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Map } from 'immutable';

import ConferenceLayout from './ConferenceLayout';

const loadConferenceDetail = () => {}; // imported from actions

class Conference extends PureComponent {
  componentWillMount() {
    const { conferenceId } = this.props.params;
    this.props.loadConferenceDetail({ conferenceId });
  }

  render() {
    const { conference } = this.props;
    return (
      <div>
        <Helmet title={`Conference ${this.props.params.conferenceId}`} />
        <ConferenceLayout conferenceId={this.props.params.conferenceId} conference={conference} />
      </div>
    );
  }
}

Conference.propTypes = {
  conference: PropTypes.instanceOf(Map).isRequired,
};

const emptyMap = Map();

function mapStateToProps(state, props) {
  return {
    conference: state.getIn(['conference', 'detail', props.params.conferenceId], emptyMap),
  };
}

const mapActionToProps = {
  loadConferenceDetail,
};


export { Conference };
export default connect(mapStateToProps, mapActionToProps)(Conference);

