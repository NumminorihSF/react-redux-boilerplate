import userReducer from '../../src/reducers/users'
import * as ActionType from '../../src/actions/users'

describe('Reducer::User', function(){
  it('returns an empty array as default state', function(){
    let action = { type: 'unknown' };
    let newState = userReducer(undefined, { type: 'unknown' });
    expect(newState.toJS()).to.deep.equal([]);
  });

  describe('on LOADED_USERS', function(){
    it('returns the `response` in given action', function(){
      let action = {
        type: ActionType.LOADED_USERS,
        response: { responseKey: 'responseVal' }
      };
      let newState = userReducer(undefined, action);
      expect(newState.toJS()).to.deep.equal(action.response);
    })
  })
});
