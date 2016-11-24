import React, { Component, PropTypes } from 'react'
import Link from 'react-router/lib/Link'
import { List } from 'immutable'

const Questions = (props)=>{
  let content = <div>There is not any questions</div>;

  if (props.questions && props.questions.size) {
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
        <h2>Question</h2>

        Questions component
        {content}

        <Link to={`/questions/not-found`}> This link would be redirected to Index</Link>
        <Link to="/">Back to Home</Link>
      </div>
  );
}

Questions.propTypes = {
  questions: PropTypes.instanceOf(List).isRequired
};

export default Questions
