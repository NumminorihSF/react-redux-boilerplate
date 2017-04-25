/** @flow */
import { PropTypes } from 'react';
import { List } from 'immutable';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Select from 'react-select';

const optionsSelector = createSelector(
  options => options,
  options => options.toJS(),
);

function mapStateToProps(state, ownProps) {
  const {
    options,
    onFetch,
    valueRenderer,
    ...rest
  } = ownProps;
  return {
    ...rest,
    options: optionsSelector(options),
    loadOptions: onFetch,
    valueRenderer,
  };
}

const SuggestedInput = connect(mapStateToProps)(Select);

SuggestedInput.propTypes = {
  options: PropTypes.instanceOf(List),
  name: PropTypes.string,
  isLoading: PropTypes.bool,
  onFetch: PropTypes.func.isRequired,
  valueRenderer: PropTypes.func,
  valueKey: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const defaultProps = {
  options: List(),
  getValue: ({ value }) => value,
  valueKey: 'value',
  value: '',
};

/* Without (defaultProps: any) flow returns error
 SuggestedInput.defaultProps = defaultProps;
 ^^^^^^^^^^^^^^^^^^^^^^^^^^^ assignment of property `defaultProps`
 SuggestedInput.defaultProps = defaultProps;
                               ^^^^^^^^^^^^ object literal. This type is incompatible with
 SuggestedInput.defaultProps = defaultProps;
 ^^^^^^^^^^^^^^^^^^^^^^^^^^^ undefined
 */
SuggestedInput.defaultProps = (defaultProps: any);

export default SuggestedInput;
