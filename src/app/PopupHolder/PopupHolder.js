/** @flow */
import type { Popup } from 'types/Popup';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { getPopupClass } from './popupRepository';

function getBackdrop(): React$Element<*> {
  return <div className="fade" />;
}

function getPopupContent(popupId: string): ?React$Element<*> {
  const PopupClass: ?Class<Popup> = getPopupClass(popupId);
  return PopupClass ? <PopupClass /> : null;
}

class PopupWrapperContainer extends PureComponent {
  render(): ?React.Element<*> {
    const { popup } = this.props;
    const popupWrapper = popup.popupWrapper;
    const currentPopupId = popupWrapper && popupWrapper.get('queue').first();
    const content = currentPopupId ? getPopupContent(currentPopupId) : <span>Close</span>;
    const backdrop = currentPopupId ? getBackdrop() : null;

    return (
      <div>
        {backdrop}
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    popup: state.get('popup'),
  };
}

export { PopupWrapperContainer };
export default connect(mapStateToProps)(PopupWrapperContainer);

