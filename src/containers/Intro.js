import React, { Component } from 'react'
import { connect } from 'react-redux'
import Link from 'react-router/lib/Link'
import Helmet from 'react-helmet'

class Intro extends Component {
  render() {
    return (
      <div className="intro">
        <Helmet
          title="Intro"
        />
        <h1>Intro Page</h1>
        <div>
          <img src="/assets/images/head.png"/>
        </div>
        <p>
          <Link to="/questions">to question</Link>
        </p>
        <p>
          <Link to="/users">to user</Link>
        </p>
      </div>
    );
  }
}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(Intro)
