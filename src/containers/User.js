import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadUserDetail } from '../actions/users'
import Helmet from 'react-helmet'
import { browserHistory } from 'react-router'

class User extends Component {
  static fetchData({ store, params, history }) {
    let { id } = params;
    return store.dispatch(loadUserDetail({ id, history }));
  }
  componentDidMount() {
    let { id } = this.props.params;
    this.props.loadUserDetail({ id, history: browserHistory });
  }
  render() {
    let { user } = this.props;
    return (
      <div>
        <Helmet
          title={'User ' + this.props.params.id}
        />
        <h2>{ user.get('name') }</h2>
        <h3> id: {user.get('id')} </h3>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return { user: state.questionDetail };
}

User.propTypes = {
  user: PropTypes.object.isRequired
};

export { User }
export default connect(mapStateToProps, { loadUserDetail })(User);
