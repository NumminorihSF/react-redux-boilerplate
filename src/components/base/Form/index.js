/** @flow */
import React, { PureComponent, PropTypes } from 'react';
import { Form as ReduxForm } from 'redux-form/immutable';
import bindToState from './bindToState';

class Form extends PureComponent {
  static bindToState(...rest) {
    return bindToState(...rest);
  }

  render() {
    const { children, name, onSubmit, ...rest } = this.props;
    return (
      <ReduxForm name={name} onSubmit={onSubmit} {...rest}>
        {children}
      </ReduxForm>
    );
  }
}

Form.propTypes = {
  name: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Form;

export {
  bindToState,
};
