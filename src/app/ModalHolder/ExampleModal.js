/** @flow */
import React, { PureComponent } from 'react';
import { getModalRegistration, openModal } from 'app/ModalHolder';

class TestModal extends PureComponent {
  static registrationId;
  static open;
  render(): ?React$Element<any> {
    return (
      <div>Test Modal</div>
    );
  }
}
TestModal.registrationId = getModalRegistration(TestModal);
TestModal.open = (...rest) => openModal(TestModal.registrationId, ...rest);

export default TestModal;
