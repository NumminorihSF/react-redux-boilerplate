/** @flow */
import { PropTypes, PureComponent, cloneElement } from 'react';

export default class InjectProps extends PureComponent {
  render() {
    const { children, ...rest } = this.props;
    return cloneElement(children, rest);
  }
}

InjectProps.propTypes = {
  children: PropTypes.element.isRequired,
};
