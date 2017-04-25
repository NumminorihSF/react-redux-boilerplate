import React, { PureComponent, PropTypes } from 'react';
import { Field } from 'redux-form/immutable';

export default class TextArea extends PureComponent {
  render() {
    const { name, ...rest } = this.props;
    return (
      <div>
        <Field name={name} component="textarea" {...rest} />
      </div>
    );
  }
}

TextArea.propTypes = {
  name: PropTypes.string.isRequired,
};
