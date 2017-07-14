/** @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Priority } from './constants';
import { closeModal } from './actions';
import ModalLayerHolder from './ModalLayerHolder';

const style = { zIndex: 10 };

const BODY_CLASS_NAME = 'bodyModal';


class ModalWrapperContainer extends Component<*, *, *> {
  /* :: modalClosers: Array<Function> */
  constructor(props: *) {
    super(props);
    this.modalClosers = Object.keys(Priority)
      .map((name, index) => ((...rest) => this.closeModal(index, ...rest)));
  }

  shouldComponentUpdate(nextProps: *) {
    return nextProps.layers !== this.props.layers;
  }

  componentDidUpdate(oldProps: *) {
    const { body } = document;
    if (!body) return;
    const { classList } = body;
    if (!classList) return;

    if (oldProps.hasAnyModal) {
      if (!this.props.hasAnyModal) {
        classList.remove(BODY_CLASS_NAME);
      }
    } else if (this.props.hasAnyModal) {
      classList.add(BODY_CLASS_NAME);
    }
  }

  closeModal(index: number, arg: Object = {}, ...rest: *) {
    const priority = Priority[Object.keys(Priority)[index]];
    const target = { ...arg, priority };
    this.props.closeModal(target, ...rest);
  }

  renderNoPriority() {
    const nextLayers = this.props.layers.slice(1);

    if (nextLayers.every(layer => layer.size === 0)) {
      return (<ModalLayerHolder
        layer={this.props.layers.first()}
        priority={0}
        closeModal={this.modalClosers[0]}
      />);
    }

    return null;
  }

  renderLayers() {
    const nextLayers = this.props.layers.slice(1);

    return nextLayers.map((layer, index) => (<ModalLayerHolder
      key={index} // eslint-disable-line react/no-array-index-key
      layer={layer}
      priority={index + 1}
      closeModal={this.modalClosers[index + 1]}
    />));
  }

  render(): ?React.Element<*> {
    return (
      <div style={style}>
        {this.renderNoPriority()}
        {this.renderLayers()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    layers: state.getIn(['app', 'modal', 'queues']),
    hasAnyModal: state.getIn(['app', 'modal', 'queues']).some(queue => queue.has(0)),
  };
}

const mapActionToProps = {
  closeModal,
};

export { ModalWrapperContainer };
export default connect(mapStateToProps, mapActionToProps)(ModalWrapperContainer);

