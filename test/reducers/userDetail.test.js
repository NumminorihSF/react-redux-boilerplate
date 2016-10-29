import reducer from 'reducers/userDetail'
import * as ActionType from 'actions/users'
import Immutable from 'immutable'

describe('Reducer::UserDetail', function(){
  describe('on ACTION_TYPE', function(){
    describe('on LOADED_USER_DETAIL', function(){
      it('merges state to response', function(){
        let action = {
          type: ActionType.LOADED_USER_DETAIL,
          response: { key: 'val' }
        };

        let newState = reducer(undefined, action);

        expect(newState.toJS()).to.deep.equal({ key: 'val' });
      });
    });
  });
});
