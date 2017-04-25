import React from 'react';
import { List, Map } from 'immutable';
import { shallow, mount } from 'enzyme';
import Row from './Row';

describe('Component::base::Table::Row', function(){
  const Component = ({ children }) => <span>{children}</span>;
  class SpyComponent extends React.Component {
    render(){
      spy(this.props);
      return null;
    }
  }

  let renderCell;
  let renderTooltip;
  let props;

  beforeEach(function(){
    renderCell = sinon.spy();
    renderTooltip = sinon.spy();

    props = {
      index: 10,
      columnsMeta: [
        {
          field: 'myField',
          defaultValue: '1122',
          renderCell,
          renderTooltip,
        },
      ],
      data: List([Map({myField: 10})]),
    };
  });

  function renderDoc(){
    return shallow(<Row {...props} />);
  }


  it('renders tr element', function(){
    let doc = renderDoc();
    expect(doc.is('tr')).to.be.equal(true);
  });

  it('renders tr element with data-index=index', function(){
    let doc = renderDoc();
    expect(doc.is('[data-index=10]')).to.be.equal(true);
  });


  it('renders 1 Cell if columnsMeta has 1 column', function(){
    let doc = renderDoc();
    expect(doc.text()).to.be.equal('<Cell />');
  });

  it('renders 8 Cells if data has 8 element', function(){
    props.columnsMeta = props.columnsMeta.concat(props.columnsMeta); // 2
    props.columnsMeta = props.columnsMeta.concat(props.columnsMeta); // 4
    props.columnsMeta = props.columnsMeta.concat(props.columnsMeta).map((part, i) => ({ ...part, field: i })); // 8
    let doc = renderDoc();
    expect(doc.text()).to.match(/(<Cell \/>){8}/);
  });

  it('gets defaultValue if data has not such field', function(){
    props.columnsMeta[0].field = 'no_such_field';
    const spy = sinon.spy();
    Object.defineProperty(props.columnsMeta[0], 'defaultValue', {
      get: spy
    });
    renderDoc();
    expect(spy).to.have.been.called;
  });

  it('gets defaultValue if data has field with value === undefined', function(){
    props.columnsMeta[0].field = 'myField';
    props.data = props.data.update(0, dataPart => dataPart.set('myField', undefined));
    const spy = sinon.spy();
    Object.defineProperty(props.columnsMeta[0], 'defaultValue', {
      get: spy
    });
    renderDoc();
    expect(spy).to.have.been.called;
  });

  it('gets defaultValue if data has field with value === null', function(){
    props.columnsMeta[0].field = 'myField';
    props.data = props.data.update(0, dataPart => dataPart.set('myField', null));
    const spy = sinon.spy();
    Object.defineProperty(props.columnsMeta[0], 'defaultValue', {
      get: spy
    });
    renderDoc();
    expect(spy).to.have.been.called;
  });

  it('pass all extra properties to tr', function(){
    props['data-my-custom-property']="some-val";
    const doc = renderDoc();
    expect(doc.is('[data-my-custom-property="some-val"]')).to.be.equal(true);
  });
});
