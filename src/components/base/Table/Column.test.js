import React, { PropTypes } from 'react'
import { shallow } from 'enzyme'
import Column from './Column'

describe('Component::base::Table::Column', function(){
  let props;

  beforeEach(function(){
    props = {
      field: 'my-field',
      children: 'some-children',
      renderTooltip: () => {},
    };
  });

  function renderDoc(){
    return shallow(<Column {...props} />);
  }

  it('contains #field as required String property', function(){
    expect(Column.propTypes.field).to.be.equal(PropTypes.string.isRequired);
  });

  it('contains #renderTooltip as non-required Function property', function(){
    expect(Column.propTypes.renderTooltip).to.be.equal(PropTypes.func);
  });

  it('renders nothing', function(){
    let doc = renderDoc();
    expect(doc.html()).to.be.equal(null);
  });
});
