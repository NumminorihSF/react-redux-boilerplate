import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import ConferencesLayout from './ConferencesLayout';

const loadConferences = () => {}; // imported from actions

class Conferences extends Component {
  componentWillMount() {
    this.props.loadConferences();
  }

  render() {
    return (
      <div>
        <Helmet title="Conferences" />
        <ConferencesLayout conferences={this.props.conferences} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    conferences: state.getIn(['conferences', 'list', 'data']),
  };
}

const mapActionToProps = {
  loadConferences,
};

export { Conferences };
export default connect(mapStateToProps, mapActionToProps)(Conferences);
