import React from 'react';
import { List, Map } from 'immutable';
import { shallow, mount } from 'enzyme';
import TableBody from './TableBody';

describe('Component::base::Table::TableBody', function(){
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
      keyField: 'myKeyField',
      data: List([Map({ 'myField': 1})]),
      meta: {
        field: 'myField',
        defaultValue: 'default value',
        renderCell: sinon.spy(),
        renderTooltip: sinon.spy(),
      },
      children: 'some-children',
    };
  });

  function renderDoc(){
    return shallow(<TableBody {...props} />);
  }
  function fullRenderDoc(doc = <TableBody {...props} />){
    return mount(doc);
  }

  it('does not render #children', function(){
    let doc = renderDoc();
    expect(doc.text()).not.to.be.contain(props.children);
  });

  it('renders tbody element', function(){
    let doc = renderDoc();
    expect(doc.is('tbody')).to.be.equal(true);
  });

  it('renders 1 Row if data has 1 element', function(){
    let doc = renderDoc();
    expect(doc.text()).to.be.equal('<Row />');
  });

  it('renders 8 Row if data has 8 element', function(){
    props.data = props.data.concat(props.data); // 2
    props.data = props.data.concat(props.data); // 4
    props.data = props.data.concat(props.data).map((part, i) => part.set(props.keyField, i)); // 8
    let doc = renderDoc();
    expect(doc.text()).to.match(/(<Row \/>){8}/);
  });

  it('gets Row\'s key property from Row\'s data\'s keyField value', function(){
    const spy = sinon.spy();
    props.data = List([{ get: spy }]);
    renderDoc();
    expect(spy.getCall(0).args[0]).to.be.equal(props.keyField);
  });
});
