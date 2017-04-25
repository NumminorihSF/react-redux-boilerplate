/** @flow */
import React, { PureComponent, PropTypes } from 'react';
import { List } from 'immutable';

import Row from './Row';

export default class TableBody extends PureComponent {
  getRows() {
    const { data, keyField, meta } = this.props;

    return data.map((dataPart, rowIndex) => {
      const key = dataPart.get(keyField);
      return <Row key={key} data={dataPart} index={rowIndex} columnsMeta={meta} />;
    });
  }

  render() {
    const rows = this.getRows();

    return (
      <tbody>
        {rows}
      </tbody>
    );
  }
}

TableBody.propTypes = {
  keyField: PropTypes.string.isRequired,
  data: PropTypes.instanceOf(List).isRequired,
  meta: PropTypes.arrayOf(PropTypes.shape({
    field: PropTypes.string.isRequired,
    defaultValue: PropTypes.any,
    renderCell: PropTypes.func.isRequired,
    renderTooltip: PropTypes.func.isRequired,
  })).isRequired,
};
