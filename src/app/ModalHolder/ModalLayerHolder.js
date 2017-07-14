/** @flow */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import type { TModal } from './TModal';

import { getModalClass } from './modalRepository';

function getBackdrop(): React.Element<*> {
  return <div className="fade" />;
}

function getModalContent(modalId: string, modalProps: Object, rest: Object): ?React.Element<*> {
  const ModalClass: ?Class<TModal> = getModalClass(modalId);
  return ModalClass ? <ModalClass {...rest} {...modalProps} /> : null;
}

const noop = () => {};

class ModalLayerHolder extends PureComponent<*, *, *> {
  getChildContext() {
    const { closeModal } = this.props;
    return {
      closeModal,
    };
  }

  componentDidUpdate(oldProps: *) {
    const oldModal = oldProps.layer.getIn([0]);
    const modal = this.props.layer.getIn([0]);

    if (oldModal && oldModal !== modal) {
      const onClose = oldModal.getIn(['props', 'onClose'], noop);
      onClose();
    }
  }

  render(): ?React.Element<*> {
    const { layer, style, closeModal } = this.props;
    const currentModalId = layer && layer.getIn([0, 'id']);
    const props = layer && layer.getIn([0, 'props']);

    const content = currentModalId ? getModalContent(currentModalId, { closeModal }, props.toJS()) : null;
    if (!content) return null;

    const backdrop = currentModalId ? getBackdrop() : null;

    return (
      <div style={style}>
        {backdrop}
        {content}
      </div>
    );
  }
}

const selectStyle = createSelector(
  priority => priority,
  priority => ({ zIndex: 10 + (10 * priority) }),
);

function mapStateToProps(state, ownProps) {
  return {
    style: selectStyle(ownProps.priority),
  };
}

ModalLayerHolder.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

ModalLayerHolder.childContextTypes = {
  closeModal: PropTypes.func.isRequired,
};

export { ModalLayerHolder };
export default connect(mapStateToProps)(ModalLayerHolder);
