/** @flow */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import Layout from './Layout';

class App extends PureComponent {
  render() {
    return (
      <div>
        <Layout {...this.props} />
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(App);
