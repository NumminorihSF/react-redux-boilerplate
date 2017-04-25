/** @flow */
/*
 * If has not some API's you need, please check react-bootstrap-table package.
 * If there is API you need, please ask Konstantin Petryaev about update this component.
 */
import React, { Component, PureComponent, PropTypes, Children } from 'react';
import { List } from 'immutable';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { createSelector } from 'reselect';

import './styles.css';

import Column from './Column';
import HeaderCell from './HeaderCell';

const renderSimple = val => val;

const renderNothing = () => null;

const noop = () => {};

export {
  Column,
};

const dataFormatter = Symbol('dataFormatter');

export default class Table extends PureComponent {
  static dataFormat(cellData, rowData, extraData, rowIdx) {
    const {
      renderCell,
      columnIndex,
      renderTooltip,
      defaultValue,
    } = extraData;

    const passCellData = cellData === undefined ? defaultValue : cellData;

    return renderCell(passCellData, {
      row: rowIdx,
      column: columnIndex,
    }, rowData, renderTooltip);
  }

  constructor(props: Object) {
    super(props);

    this.onRef = this.onRef.bind(this);
  }

  onRef: Function;

  onRef(component: Component<*, *, *> | HTMLElement) {
    const { handleRef = noop } = this.props;
    handleRef(component);
  }

  getExtraData(columnIndex: number, renderCell: Function, renderTooltip: Function, defaultValue: *) {
    const self: any = this;
    if (!self[dataFormatter]) {
      self[dataFormatter] = [];
    }

    if (!self[dataFormatter][columnIndex]) {
      self[dataFormatter][columnIndex] = createSelector(
        () => renderCell,
        () => renderTooltip,
        () => defaultValue,
        (renderCell, renderTooltip, defaultValue) => ({ renderCell, columnIndex, renderTooltip, defaultValue }),
      );
    }

    return self[dataFormatter][columnIndex](renderCell, renderTooltip, defaultValue);
  }

  getColumns(): { columns: Object[], keyField: ?string } {
    const columns = [];
    let keyField: ?string = null;

    Children.forEach(this.props.children, (child) => {
      switch (child.type) {
        case Column: {
          const columnIndex = columns.length;
          const {
            props: {
              field,
              renderCell = renderSimple,
              renderTooltip = renderNothing,
              defaultValue = null,
              isKey = false,
              ...rest
            },
          } = child;

          const columnMeta = {
            field,
            ...rest,
          };

          if (isKey) keyField = field;


          return columns.push(<TableHeaderColumn
            {...rest}
            dataFormat={Table.dataFormat}
            formatExtraData={this.getExtraData(columnIndex, renderCell, renderTooltip, defaultValue)}
            dataField={field}
            key={field}
          >
            <HeaderCell meta={columnMeta}>
              {rest.children}
            </HeaderCell>
          </TableHeaderColumn>);
        }
        default:
          return null;
      }
    });

    return { columns, keyField };
  }

  render() {
    const { children, data, ...rest } = this.props;

    const { columns, keyField } = this.getColumns();

    return (
      <BootstrapTable {...rest} keyField={keyField} data={data.toJS()} ref={this.onRef}>
        {columns}
      </BootstrapTable>
    );
  }
}

Table.defaultProps = ({
  data: List(),
}: any);

Table.propTypes = {
  data: PropTypes.instanceOf(List).isRequired,
  children: PropTypes.node.isRequired,
};
