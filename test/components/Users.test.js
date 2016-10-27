import React from 'react'
import { shallow } from 'enzyme'
import { Link } from 'react-router'
import Users from 'components/Users'
import Immutable from 'immutable'

describe('Component::Users', function(){
  let props;
  beforeEach(function(){
    props = {
      users: Immutable.fromJS([
        { id: 1, name: 'the-content-1' },
        { id: 2, name: 'the-content-2' }
      ])
    };
  });
  function renderDoc () {
    return shallow(<Users {...props} />);
  }

  it('renders users', function(){
    let doc = renderDoc();
    let userComps = doc.find(Link);

    expect(userComps.length).to.equal(props.users.size + 1);
  });

  it('renders "There is not any users" if no any users', function(){
    props.users = Immutable.fromJS([]);
    let doc = renderDoc();

    expect(doc.text()).to.contains("There is not any users");
  });

  it('do not renders "There is not any users" if is any users', function(){
    let doc = renderDoc();

    expect(doc.text()).to.not.contains("There is not any users");
  });
});
