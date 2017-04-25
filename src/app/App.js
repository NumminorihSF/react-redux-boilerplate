/** @flow */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import AppLayout from './AppLayout';

class App extends PureComponent {
  render() {
    return (
      <div>
        <AppLayout {...this.props} />
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(App);
