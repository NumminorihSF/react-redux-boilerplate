import React, { PureComponent, PropTypes } from 'react';
import { Field } from 'redux-form/immutable';

class Input extends PureComponent {
  render() {
    const { name, type, ...rest } = this.props;
    return (
      <Field name={name} type={type} component="input" {...rest} />
    );
  }
}


Input.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

Input.defaultProps = {
  type: 'text',
};

export default Input;
