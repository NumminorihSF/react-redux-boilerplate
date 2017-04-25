import React from 'react'
import { shallow, mount } from 'enzyme'
import HeaderCell from './HeaderCell'

describe('Component::base::Table::HeaderCell', function(){
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
      meta: {
        field: 'my-field',
      },
      children: 'some-children',
      renderTooltip: () => {},
    };
  });

  function renderDoc(){
    return shallow(<HeaderCell {...props} />);
  }
  function fullRenderDoc(doc = <HeaderCell {...props} />){
    return mount(doc);
  }

  it('contains #children in prop types', function(){
    expect(HeaderCell.propTypes).to.have.ownProperty('children');
  });

  it('renders #children if it is string', function(){
    let doc = renderDoc();
    expect(doc.text()).to.be.equal(props.children);
  });

  it('renders span element if #children is string', function(){
    let doc = renderDoc();
    expect(doc.html()).to.be.equal(`<span>${props.children}</span>`);
  });

  it('renders #children if it is Component', function(){
    props.children = <Component>123</Component>;
    let doc = renderDoc();
    expect(doc.text()).to.be.equal('<Component />');
  });

  it('renders custom component at the self root if #children is Component', function(){
    props.children = <Component>123</Component>;
    let doc = renderDoc();
    expect(doc.html()).to.be.equal(`<span>${123}</span>`);
  });

  it('adds meta property to component if #children is Component', function(){
    fullRenderDoc(<HeaderCell {...props}>
      <SpyComponent />
    </HeaderCell>);
    let childProps = spy.getCall(0).args[0];
    expect(childProps).to.deep.include({ meta: props.meta });
  });

  it('adds does not remove extra properties to component if #children is Component', function(){
    let doc = fullRenderDoc(<HeaderCell {...props}>
      <SpyComponent test1="1"/>
    </HeaderCell>);
    let childProps = spy.getCall(0).args[0];
    expect(childProps).to.deep.include({ test1: '1' });
  });
});
