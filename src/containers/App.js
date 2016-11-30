import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
if (process.env.ON_SERVER === false) {
  require('./App.scss'); // eslint-disable-line global-require
}

const App = (props)=>{
    return (
      <div>
        <Helmet
          defaultTitle="Redux real-world example"
          titleTemplate="%s - Redux real-world example"
          meta={[
            {"name": "description", "content": "A boilerplate doing universal/isomorphic rendering with Redux + React-router + Express"}
          ]}
          htmlAttributes={{"lang": "en"}}
        />
        {props.children}
      </div>
    );
};

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(App)
