import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';
import { List } from 'immutable';

const Conferences = (props) => {
  let content = <div>There is not any conferences</div>;

  if (props.conferences && props.conferences.size) {
    content = this.props.conferences.map((q) => {
      const id = q.get('id');
      return (
        <div key={id}>
          <Link to={`/conferences/${id}`}> { q.get('content') }</Link>
        </div>
      );
    });
  }

  return (
    <div>
      <div className="PageHeading">
        <div className="Content-row">
          <h2>Conference Information</h2>
          <div className="flex-grow1" />
        </div>
      </div>
      <div className="Content-row">
        <div>
          {content}
        </div>
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
};

Conferences.propTypes = {
  conferences: PropTypes.instanceOf(List).isRequired,
};

export default Conferences;
