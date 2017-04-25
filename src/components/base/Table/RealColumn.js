/** @flow */
import React, { PureComponent, PropTypes } from 'react';

class RealColumn extends PureComponent {
  render() {
    return <th {...this.props}>{this.props.children}</th>;
  }
}

RealColumn.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
  ]).isRequired,
};

export default RealColumn;
