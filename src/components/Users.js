import React, { Component, PropTypes } from 'react'
import Link from 'react-router/lib/Link'
import { List } from 'immutable'

class Users extends Component {
  render() {
    let content = <div>There is not any users</div>;

    if (this.props.users && this.props.users.size) {
      content = this.props.users.map((u)=> {
        let id = u.get('id');
        return (
          <div key={id}>
            <Link to={`/users/${id}`}> { u.get('name') }</Link>
          </div>
        )
      });
    }

    return (
      <div>
        Users component
        {content}
        <Link to={`/users/not-found`}> This link would not be redirected to Index</Link>
      </div>
    );
  }
}

Users.propTypes = {
  users: PropTypes.instanceOf(List).isRequired
};

export default Users
