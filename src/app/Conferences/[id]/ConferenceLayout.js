import React, { PureComponent } from 'react';


class ConferenceLayout extends PureComponent {
  render() {
    const { conferenceId, conference } = this.props;
    return (
      <div>
        Conferences {conferenceId} {conference}
      </div>
    );
  }
}


export default ConferenceLayout;

