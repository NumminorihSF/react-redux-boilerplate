/** @flow */
import { PropTypes } from 'react';
import RealColumn from './RealColumn';

const Column = () => null;

Column.propTypes = {
  ...RealColumn.propTypes,
  field: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
  ]).isRequired,
  renderTooltip: PropTypes.func,
};

export default Column;
