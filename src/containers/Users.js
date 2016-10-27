import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadUsers } from '../actions/users'
import Link from 'react-router/lib/Link'
import Users from '../components/Users'
import Helmet from 'react-helmet'

class UserContainer extends Component {
  static fetchData({ store }) {
    return store.dispatch(loadUsers())
  }

  componentDidMount() {
    this.props.loadUsers()
  }
  render() {
    return (
      <div>
        <Helmet
          title="Users"
        />
        <h2>User</h2>
        <Users users={this.props.users} />
        <Link to="/">Back to Home</Link>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return { users: state.users }
}

export { UserContainer }
export default connect(mapStateToProps, { loadUsers })(UserContainer)
