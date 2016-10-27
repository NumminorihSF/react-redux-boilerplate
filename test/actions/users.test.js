import { CALL_API, CHAIN_API } from 'middleware/api'

import * as actionCreator from 'actions/users'
import * as ActionType from 'actions/users'

describe('Action::User', function(){
  describe('#loadUsers()', function(){
    it('returns action `CALL_API` info', function(){
      let action = actionCreator.loadUsers();
      expect(action[CALL_API]).to.deep.equal({
        method: 'get',
        path: '/api/users',
        successType: ActionType.LOADED_USERS
      });
    });
  });

  describe('#loadUserDetail({id})', function(){
    let id = 'the-id';
    it('returns a CALL_API to fetch user', function(){
      let action = actionCreator.loadUserDetail({ id });

      expect(action[CALL_API].method).to.equal('get');
      expect(action[CALL_API].path).to.equal(`/api/users/${id}`);
      expect(action[CALL_API].successType).to.equal(ActionType.LOADED_USER_DETAIL);
    });
    it('navigates to root when request error', ()=> {
      let mockHistory = {
        push: sinon.stub()
      };
      let action = actionCreator.loadUserDetail({ id, history: mockHistory });

      expect(action[CALL_API].afterError).to.be.an.instanceOf(Function);
      action[CALL_API].afterError();

      expect(mockHistory.push).to.have.been.calledWith('/');
    });
  });
});
