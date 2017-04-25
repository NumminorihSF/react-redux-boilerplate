import React, { PureComponent, PropTypes } from 'react';
import { List, Map } from 'immutable';
import { Field } from 'redux-form/immutable';

class Select extends PureComponent {
  static getOption(option) {
    if (Map.isMap(option)) {
      const value = option.get('value');
      const label = option.get('label', value);
      return <option value={value} key={value}>{label}</option>;
    }
    return <option value={option} key={option}>{option}</option>;
  }

  static getOptions(options) {
    return options.map(Select.getOption);
  }

  render() {
    const { name, options, ...rest } = this.props;
    const renderOptions = Select.getOptions(options);
    return (
      <Field name={name} component="select" {...rest}>
        {renderOptions}
      </Field>
    );
  }
}

Select.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.instanceOf(List).isRequired,
};

export default Select;
