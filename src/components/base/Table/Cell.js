/** @flow */
import React, { PureComponent, PropTypes } from 'react';

class Cell extends PureComponent {
  render() {
    const { children, ...rest } = this.props;
    return <td {...rest} >{children}</td>;
  }
}

Cell.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
  ]).isRequired,
};


export default Cell;
