import React, { PureComponent } from 'react';
import { fromJS } from 'immutable';
import Table, { Column } from './';

export default class Example extends PureComponent {
  render() {
    const data = fromJS([
      { field1: 'val1 field1', field2: 'val1 field2' },
      { field1: 'val2 field1', field2: 'val2 field2' },
      { field1: 'val3 field1', field2: 'val3 field2' },
      { field1: 'val4 field1', field2: 'val4 field2' },
      { field1: 'val5 field1', field2: 'val5 field2' },
      { field1: 'val6 field1' },
      { field2: 'val7 field2' },
      {},
    ]);
    return (
      <Table data={data}>
        <Column field="field1" isKey defaultValue="default field1 value">
          My column1
        </Column>
        <Column field="field2" defaultValue="default field2 value">
          My column2
        </Column>
      </Table>
    );
  }
}
