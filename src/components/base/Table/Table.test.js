import React from 'react';
import { List, Map } from 'immutable';
import { shallow, mount } from 'enzyme';
import Table, { Column } from './';

describe('Component::base::Table', function(){
  const Component = ({ children }) => <span>{children}</span>;
  class SpyComponent extends React.Component {
    render(){
      spy(this.props);
      return null;
    }
  }

  let spy;
  let props;

  beforeEach(function(){
    spy = sinon.spy();

    props = {
      data: List([Map({ 'myField': 1, 'myField2': '2' })]),
    };
  });

  function renderDoc(doc = <Table {...props} />){
    return shallow(doc);
  }
  function fullRenderDoc(doc = <Table {...props} />){
    return mount(doc);
  }

  it('does not render #children', function(){
    const doc = renderDoc();
    expect(doc.text()).not.to.be.contain(props.children);
  });

  it('renders table element', function(){
    const doc = fullRenderDoc(<Table {...props}>
      <Column field="myField" isKey>123</Column>
    </Table>);
    expect(doc.find('table').exists()).to.be.equal(true);
  });

  it('renders 1 th and if has 1 column inside', function(){
    const doc = fullRenderDoc(<Table {...props}>
      <Column field="myField" isKey>Table Header Cell's Title</Column>
    </Table>);
    expect(doc.find('th')).to.have.length(1);
  });

  it('renders 2 th and if has 2 columns inside', function(){
    const doc = fullRenderDoc(<Table {...props}>
      <Column field="myField" isKey>Table Header Cell's Title</Column>
      <Column field="myField2">Table Header Cell's Title2</Column>
    </Table>);
    expect(doc.find('th')).to.have.length(2);
  });

  it('renders default value from Column\'s defaultValue property', function(){
    const doc = fullRenderDoc(<Table {...props}>
      <Column field="myField3" defaultValue="SOME_DEFAULT_VALUE" isKey>Table Header Cell's Title</Column>
    </Table>);
    expect(doc.html()).to.contains('SOME_DEFAULT_VALUE');
  });

  it('calls renderer function', function(){
    const renderCell = sinon.spy();
    fullRenderDoc(<Table {...props}>
      <Column field="myField3" renderCell={renderCell} isKey>Table Header Cell's Title</Column>
    </Table>);
    expect(renderCell).to.have.been.called;
  });

  it('calls renderer function with default value if no such value', function(){
    const renderCell = sinon.spy();
    fullRenderDoc(<Table {...props}>
      <Column field="myField3" defaultValue="my default value" renderCell={renderCell} isKey>Table Header Cell's Title</Column>
    </Table>);
    const call = renderCell.getCall(0);
    expect(call.args[0]).to.be.equal('my default value');
    expect(call.args[1]).to.be.deep.equal({ row: 0, column: 0 });
    expect(call.args[2]).to.be.deep.equal(props.data.get(0).toJS());
    expect(call.args[3]).to.be.instanceOf(Function);
  });

  it('calls renderer function with real value', function(){
    const renderCell = sinon.spy();
    fullRenderDoc(<Table {...props}>
      <Column field="myField" defaultValue="my default value" renderCell={renderCell} isKey>Table Header Cell's Title</Column>
    </Table>);
    const call = renderCell.getCall(0);
    expect(call.args[0]).to.be.equal(1);
  });

  it('calls renderer function with renderTooltip as 4th argument', function(){
    const renderCell = sinon.spy();
    const renderTooltip = function(){};
    fullRenderDoc(<Table {...props}>
      <Column field="myField" defaultValue="my default value" renderTooltip={renderTooltip}
              renderCell={renderCell} isKey>Table Header Cell's Title</Column>
    </Table>);
    const call = renderCell.getCall(0);
    expect(call.args[3]).to.be.equal(renderTooltip);
  })
});
