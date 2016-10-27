import { UserContainer } from 'containers/Users'
import Users from 'components/Users'
import { Link } from 'react-router'
import React from 'react'
import { shallow } from 'enzyme'
import Immutable from 'immutable'

describe('Container::Users', function(){
  let props;
  beforeEach(function(){
    props = {
      loadUsers: sinon.stub(),
      users: Immutable.fromJS([
        { id: 1, name: 'user name 1' },
        { id: 2, name: 'user name 2' }
      ])
    };
  });

  it('renders Users with users in props', function(){
    let doc = shallow(<UserContainer {...props}/>);
    let usersComp = doc.find(Users);

    expect(usersComp.props().users).to.equal(props.users);
  });

  it('renders a link back to `/`', function(){
    let doc = shallow(<UserContainer {...props}/>);
    let link = doc.find('Link');

    expect(link).to.exist;
    expect(link.props().to).to.equal('/');
  });
});
