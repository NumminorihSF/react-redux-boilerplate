import React, { PropTypes } from 'react'
import { shallow, mount } from 'enzyme'
import RealColumn from './RealColumn'

describe('Component::base::Table::RealColumn', function(){
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
    return shallow(<RealColumn {...props} />);
  }
  function fullRenderDoc(doc = <RealColumn {...props} />){
    return mount(doc);
  }

  it('contains #children in prop types', function(){
    expect(RealColumn.propTypes).to.have.ownProperty('children');
  });

  it('renders #children if it is string', function(){
    let doc = renderDoc();
    expect(doc.text()).to.be.equal(props.children);
  });

  it('renders th element if #children is string', function(){
    let doc = renderDoc();
    expect(doc.html()).to.be.equal(`<th>${props.children}</th>`);
  });

  it('renders #children if it is Component as content of <th/>', function(){
    props.children = <Component>123</Component>;
    let doc = renderDoc();
    expect(doc.text()).to.be.equal('<Component />');
  });

  it('renders #children if it is Component as content of <th/>', function(){
    props.children = <Component>1</Component>;
    let doc = fullRenderDoc();
    expect(doc.html()).to.be.equal('<th><span>1</span></th>');
  });

  it('adds pass all extra properties to component if #children is Component', function(){
    const doc = fullRenderDoc(<RealColumn {...props} data-my-custom-property="some-val"/>);
    expect(doc.find('[data-my-custom-property="some-val"')).to.have.length(0);
  });

  it('adds does not remove extra properties to component if #children is Component', function(){
    let doc = fullRenderDoc(<RealColumn {...props}>
      <SpyComponent test1="1" a={false} b={undefined} c={null}/>
    </RealColumn>);
    let childProps = spy.getCall(0).args[0];
    expect(childProps).to.deep.include({ test1: '1', a: false, b: undefined, c: null });
  });
});
