import React, { PropTypes } from 'react'
import { shallow, mount } from 'enzyme'
import Cell from './Cell'

describe('Component::base::Table::Cell', function(){
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
      children: 'some-text-children'
    };
  });

  function renderDoc(){
    return shallow(<Cell {...props} />);
  }
  function fullRenderDoc(doc = <Cell {...props} />){
    return mount(doc);
  }

  it('contains #children in prop types', function(){
    expect(Cell.propTypes).to.have.ownProperty('children');
  });

  it('renders #children if it is string', function(){
    let doc = renderDoc();
    expect(doc.text()).to.be.equal(props.children);
  });

  it('renders td element if #children is string', function(){
    let doc = renderDoc();
    expect(doc.html()).to.be.equal(`<td>${props.children}</td>`);
  });

  it('renders #children if it is Component as content of <td/>', function(){
    props.children = <Component>123</Component>;
    let doc = renderDoc();
    expect(doc.text()).to.be.equal('<Component />');
  });

  it('renders #children if it is Component as content of <td/>', function(){
    props.children = <Component>1</Component>;
    let doc = fullRenderDoc();
    expect(doc.html()).to.be.equal('<td><span>1</span></td>');
  });

  it('pass all extra properties to component if #children is Component', function(){
    const doc = fullRenderDoc(<Cell {...props} data-my-custom-property="some-val"/>);
    expect(doc.find('[data-my-custom-property="some-val"')).to.have.length(0);
  });

  it('adds does not remove extra properties to component if #children is Component', function(){
    let doc = fullRenderDoc(<Cell {...props}>
      <SpyComponent test1="1" a={false} b={undefined} c={null}/>
    </Cell>);
    let childProps = spy.getCall(0).args[0];
    expect(childProps).to.deep.include({ test1: '1', a: false, b: undefined, c: null });
  });
});
