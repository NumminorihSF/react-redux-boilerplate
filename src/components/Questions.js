import React, { Component, PropTypes } from 'react'
import Link from 'react-router/lib/Link'
import { List } from 'immutable'

class Questions extends Component {
  render() {
    let content = <div>There is not any questions</div>;

    if (this.props.questions && this.props.questions.size) {
      content = this.props.questions.map((q)=> {
        let id = q.get('id');
        return (
          <div key={id}>
            <Link to={`/questions/${id}`}> { q.get('content') }</Link>
          </div>
        )
      });
    }

    return (
      <div>
        Questions component
        {content}
        <Link to={`/questions/not-found`}> This link would be redirected to Index</Link>
      </div>
    );
  }
}

Questions.propTypes = {
  questions: PropTypes.instanceOf(List).isRequired
};

export default Questions
