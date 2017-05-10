/** @flow */
import React, { PureComponent, PropTypes } from 'react';
import { Map } from 'immutable';

import Cell from './Cell';
import metaPropTypes from './metaPropTypes';

class Row extends PureComponent {
  getCells() {
    const { data, index } = this.props;
    return this.props.columnsMeta.map((meta, columnIndex) => {
      const { renderCell } = meta;
      const cellData = data.get(meta.field, meta.defalue);
      const content = renderCell(cellData, { row: index, column: columnIndex }, data);
      return (
        <Cell key={meta.field} data-index={columnIndex}>
          {content}
        </Cell>
      );
    });
  }

  render() {
    const { columnsMeta, index, ...rest } = this.props;
    return (
      <tr data-index={index} {...rest} >
        {this.getCells()}
      </tr>
    );
  }
}

Row.propTypes = {
  index: PropTypes.number.isRequired,
  columnsMeta: metaPropTypes,
  data: PropTypes.instanceOf(Map).isRequired,
};

Row.defaultProps = ({
  columnsMeta: [],
}: any);


export default Row;
