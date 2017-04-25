/** @flow */
import React, { PureComponent } from 'react';
import { getPopupRegistration, openPopup } from 'app/PopupHolder';

class TestPopup extends PureComponent {
  static registrationId;
  static open;
  render(): ?React$Element<any> {
    return (
      <div>Test Popup</div>
    );
  }
}
TestPopup.registrationId = getPopupRegistration(TestPopup);
TestPopup.open = (...rest) => openPopup(TestPopup.registrationId, ...rest);

export default TestPopup;
