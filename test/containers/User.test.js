import React from 'react'
import Immutable from 'immutable'
import Container, { User } from 'containers/User'
import { mount } from 'enzyme'
import { browserHistory } from 'react-router'

describe('Container::User', function(){
  let props;

  function renderDoc () {
    return mount(<User {...props}/>);
  }
  beforeEach(function(){
    props = {
      loadUserDetail: sinon.stub(),
      params: {
        id: 222
      },
      user: Immutable.fromJS({
        id: 222,
        name: 'the-user-name'
      })
    };
  });

  it('fetches user details on mounted', function(){
    let doc = renderDoc();
    expect(props.loadUserDetail).to.have.been.calledWith({
      id: props.params.id,
      history: browserHistory
    });
  });
});
