/** @flow */
import React, { cloneElement, PropTypes, PureComponent } from 'react';

export default class HeaderCell extends PureComponent {
  render() {
    const { children, meta } = this.props;
    if (typeof children === 'string') {
      return <span>{children}</span>;
    }
    return cloneElement(children, { meta });
  }
}

HeaderCell.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]).isRequired,
  meta: PropTypes.shape({
    field: PropTypes.string.isRequired,
  }),
};

