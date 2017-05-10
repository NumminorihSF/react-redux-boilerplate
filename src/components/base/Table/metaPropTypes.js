import { PropTypes } from 'react';

export default PropTypes.arrayOf(PropTypes.shape({
  field: PropTypes.string.isRequired,
  defaultValue: PropTypes.any,
  renderCell: PropTypes.func.isRequired,
  renderTooltip: PropTypes.func.isRequired,
})).isRequired;
