import nock from 'nock'
import config from 'config'
import superagent from 'superagent'
import { camelizeKeys } from 'humps'

import apiMiddleware, { CALL_API, CHAIN_API } from './index'

const API_BASE_URL = config.constants.API.BASE_URL;

describe('Middleware::Api', function(){
  let store, next;
  let action;
  beforeEach(function(){
    store = { dispatch: sinon.stub(), getState: sinon.stub() };
    next = sinon.stub();
  });

  describe('when called with #[CHAIN_API]', function(){
    let path1 = '/the-url/path-1';
    let path2 = '/the-url/the-id-1';
    let successType1 = 'ON_SUCCESS_1';
    let successType2 = 'ON_SUCCESS_2';
    let errorType2 = 'ON_ERROR_2';
    let startType1 = 'ON_START_1';
    let startType2 = 'ON_START_2';

    let nockScope1, nockScope2;

    let afterSuccess1, afterSuccess2;
    let response1 = { id: 'the-id-1', to_be_camelized: 'snake-val' };
    let response2 = { id: 'the-res-2' };

    let afterError2;
    let afterError;
    let beforeStart2;
    let beforeStart;
    let query1;

    beforeEach(function(){
      store = {
        dispatch: sinon.spy(),
        getState: sinon.spy()
      };
      afterSuccess1 = sinon.stub();
      afterSuccess2 = sinon.stub();
      afterError2 = sinon.stub();
      beforeStart = sinon.stub();
      beforeStart2 = sinon.stub();
      action = {
        [CHAIN_API]: [
          ()=> {
            return {
              extra1: 'val1',
              [CALL_API]: {
                method: 'post',
                body: { bodyKey: 'body-val' },
                query: { queryKey: 'query-val' },
                path: path1,
                startType: startType1,
                beforeStart: beforeStart,
                afterSuccess: afterSuccess1,
                successType: successType1
              }
            }
          },
          (resBody1)=> {
            return {
              extra2: 'val2',
              [CALL_API]: {
                method: 'get',
                path: `/the-url/${resBody1.id}`,
                startType: startType2,
                beforeStart: beforeStart2,
                afterSuccess: afterSuccess2,
                afterError: afterError2,
                successType: successType2,
                errorType: errorType2
              }
            }
          }
        ]
      };
    });

    function nockRequest1 () {
      return nock(API_BASE_URL).post(path1)
                                      .query(query1)
                                      .reply(200, response1);
    }
    function nockRequest2 (status = 200) {
      return nock(API_BASE_URL).get(path2)
                                      .reply(status, response2);
    }

    afterEach(function(){
      nock.cleanAll();
    });

    describe('when all API calls are success', function(){
      beforeEach(function(){
        query1 = { queryKey: 'query-val' };
        nockScope1 = nockRequest1();
        nockScope2 = nockRequest2();
      });

      it('sends requests to all endpoints', function(done){
        let promise = apiMiddleware(store)(next)(action);
        promise.then(()=> {
          nockScope1.done();
          nockScope2.done();
          done();
        }).catch(done);
      });

      it('triggers #beforeStart property for all request in action', function(done){
        let promise = apiMiddleware(store)(next)(action);
        promise.then(()=> {
          const { getState } = store;
          expect(beforeStart).to.have.been.calledWith(sinon.match({ getState }));
          expect(beforeStart2).to.have.been.calledWith(sinon.match({ getState }));
          done();
        }).catch(done);
      });

      it('dispatches action with #type = #startType for all request before call', function(done){
        let promise = apiMiddleware(store)(next)(action);
        promise.then(()=> {
          expect(store.dispatch).to.have.been.calledWith(sinon.match({ type: startType1 }));
          expect(store.dispatch).to.have.been.calledWith(sinon.match({ type: startType2 }));
          done();
        }).catch(done);
      });

      it('dispatches startType action with #query from request or undefined if not specified', function(done){
        let promise = apiMiddleware(store)(next)(action);
        promise.then(()=> {
          expect(store.dispatch).to.have.been
            .calledWith(sinon.match({ type: startType1, query: query1 }));
          expect(store.dispatch).to.have.been
            .calledWith(sinon.match({ type: startType2, query: undefined }));
          done();
        }).catch(done);
      });

      it('dispatches startType action with #url = `${API_BASE_URL}${requestPath}` for all request', function(done){
        let promise = apiMiddleware(store)(next)(action);
        promise.then(()=> {
          expect(store.dispatch).to.have.been
            .calledWith(sinon.match({ type: startType1, url: API_BASE_URL + path1 }));
          expect(store.dispatch).to.have.been
            .calledWith(sinon.match({ type: startType2, url: API_BASE_URL + path2 }));
          done();
        }).catch(done);
      });


      it('dispatches startType action with extra props from returned object with #[CALL_API] field', function(done){
        let promise = apiMiddleware(store)(next)(action);
        promise.then(()=> {
          expect(store.dispatch).to.have.been
            .calledWith(sinon.match({ type: startType1, extra1: 'val1' }));
          expect(store.dispatch).to.have.been
            .calledWith(sinon.match({ type: startType2, extra2: 'val2' }));
          done();
        }).catch(done);
      });

      it('triggers #afterSuccess() for all request', function(done){
        let promise = apiMiddleware(store)(next)(action);
        promise.then(()=> {
          expect(afterSuccess1).to.have.been.called;
          expect(afterSuccess2).to.have.been.called;
          done();
        }).catch(done);
      });

      it('triggers #afterSuccess() with #getState property', function(done){
        let promise = apiMiddleware(store)(next)(action);
        promise.then(()=> {
          const { getState } = store;
          expect(afterSuccess1).to.have.been.calledWith(sinon.match({ getState }));
          expect(afterSuccess2).to.have.been.calledWith(sinon.match({ getState }));
          done();
        }).catch(done);
      });

      it('triggers #afterSuccess() with #dispatch property', function(done){
        let promise = apiMiddleware(store)(next)(action);
        promise.then(()=> {
          const { dispatch } = store;
          expect(afterSuccess1).to.have.been.calledWith(sinon.match({ dispatch }));
          expect(afterSuccess2).to.have.been.calledWith(sinon.match({ dispatch }));
          done();
        }).catch(done);
      });

      it('dispatches action with #type = successType for all requests', function(done){
        let promise = apiMiddleware(store)(next)(action);
        promise.then(()=> {
          expect(store.dispatch).to.have.been
            .calledWith(sinon.match({ type: successType1 }));
          expect(store.dispatch).to.have.been
            .calledWith(sinon.match({ type: successType2 }));
          done();
        }).catch(done);
      });

      it('dispatches successType action with #response = responses\' body for all requests', function(done){
        let promise = apiMiddleware(store)(next)(action);
        promise.then(()=> {
          expect(store.dispatch).to.have.been
            .calledWith(sinon.match({ type: successType1, response: response1 }));
          expect(store.dispatch).to.have.been
            .calledWith(sinon.match({ type: successType2, response: response2 }));
          done();
        }).catch(done);
      });

      it('dispatches successType action with extra props from returned object with #[CALL_API] field', function(done){
        let promise = apiMiddleware(store)(next)(action);
        promise.then(()=> {
          expect(store.dispatch).to.have.been
            .calledWith(sinon.match({ type: successType1, extra1: 'val1' }));
          expect(store.dispatch).to.have.been
            .calledWith(sinon.match({ type: successType2, extra2: 'val2' }));
          done();
        }).catch(done);
      });

      it('pass previous response\'s body into next request function', function(done){
        const spy = action[CHAIN_API][1] = sinon.spy();
        let promise = apiMiddleware(store)(next)(action);
        promise.then(()=> {
          expect(spy).to.be.calledWith(sinon.match({id: 'the-id-1'}));
          done();
        }).catch(done);
      });

      it('pass previous response\'s body without camelizing any key into next request function', function(done){
        const spy = action[CHAIN_API][1] = sinon.spy();
        let promise = apiMiddleware(store)(next)(action);
        promise.then(()=> {
          expect(spy).to.be.calledWith(response1)
          done();
        }).catch(done);
      });
    });

    describe('when one of the requests failed', function(){
      let nockScope3;
      let startType3;
      let beforeStart3;
      let errorType3;
      let afterError3;

      beforeEach(function(){
        nockScope1 = nockRequest1();
        nockScope2 = nockRequest2(400);
        beforeStart3 = sinon.stub();
        afterError3 = sinon.stub();
        startType3 = 'ON_START_3';
        errorType3 = 'ON_ERROR_3';
        action[CHAIN_API][2] = ()=> {
          return {
            extra1: 'val1',
            [CALL_API]: {
              startType: startType3,
              afterError: afterError3
            }
          }
        };
        nockScope3 = sinon.stub();
      });

      it("sends request until some failed", function(done){
        let promise = apiMiddleware(store)(next)(action);
        promise.then(()=> {
          nockScope1.done();
          nockScope2.done();
          expect(nockScope3).not.to.be.called;
          done();
        }).catch(done);
      });


      it('triggers #beforeStart for all requests until one failed', function(done){
        let promise = apiMiddleware(store)(next)(action);
        promise.then(()=> {
          expect(beforeStart).to.have.been.calledWith(sinon.match({ getState: store.getState }));
          expect(beforeStart2).to.have.been.calledWith(sinon.match({ getState: store.getState }));
          expect(beforeStart3).not.to.be.called;
          done();
        }).catch(done);
      });

      it('dispatches action with #startType for all requests until one failed', function(done){
        let promise = apiMiddleware(store)(next)(action);
        promise.then(()=> {
          expect(store.dispatch).to.have.been
            .calledWith(sinon.match({ type: startType1 }));
          expect(store.dispatch).to.have.been
            .calledWith(sinon.match({ type: startType2 }));
          expect(store.dispatch).not.to.have.been
            .calledWith(sinon.match({ type: startType3 }));
          done();
        }).catch(done);
      });

      it('triggers #afterSuccess() for the ok ones', function(done){
        let promise = apiMiddleware(store)(next)(action);
        promise.then(()=> {
          expect(afterSuccess1).to.have.been.called;
          done();
        }).catch(done);
      });

      it('triggers #afterSuccess() with #dispatch property for the ok ones', function(done){
        let promise = apiMiddleware(store)(next)(action);
        promise.then(()=> {
          const { dispatch } = store;
          expect(afterSuccess1).to.have.been.calledWith(sinon.match({ dispatch }));
          done();
        }).catch(done);
      });

      it('triggers #afterSuccess() with #getState property for the ok ones', function(done){
        let promise = apiMiddleware(store)(next)(action);
        promise.then(()=> {
          const { getState } = store;
          expect(afterSuccess1).to.have.been.calledWith(sinon.match({ getState }));
          done();
        }).catch(done);
      });

      it('dispatches success for the ok ones', function(done){
        let promise = apiMiddleware(store)(next)(action);
        promise.then(()=> {
          expect(store.dispatch).to.have.been.calledWith(sinon.match({ type: successType1 }));
          done();
        }).catch(done);
      });

      it('triggers #afterError of failed request', function(done){
        let promise = apiMiddleware(store)(next)(action);
        promise.then(()=> {
          expect(afterError2).to.have.been.called;
          done();
        }).catch(done);
      });

      it('triggers #afterError of failed request with #getState property', function(done){
        let promise = apiMiddleware(store)(next)(action);
        promise.then(()=> {
          expect(afterError2).to.have.been.calledWith(sinon.match({ getState: store.getState }));
          done();
        }).catch(done);
      });

      it('does not trigger #afterError of request after failed', function(done){
        let promise = apiMiddleware(store)(next)(action);
        promise.then(()=> {
          expect(afterError3).not.to.have.been.called;
          done();
        }).catch(done);
      });

      it('dispatches action with #type = #errorType of failed request', function(done){
        store.dispatch = sinon.stub();
        let promise = apiMiddleware(store)(next)(action);
        promise.then(()=> {
          expect(store.dispatch).to.be.calledWith(sinon.match({ type: errorType2 }));
          done();
        }).catch(done);
      });

      it('dispatches errorType action with #error field of failed request', function(done){
        store.dispatch = sinon.spy();
        let promise = apiMiddleware(store)(next)(action);
        promise.then(()=> {
          const lastCallArgs = store.dispatch.args.pop();
          expect(lastCallArgs[0].error).to.be.instanceOf(Error);
          done();
        }).catch(done);
      });

      it('does not dispatch action with #type = #errorType of requests after failed', function(done){
        store.dispatch = sinon.stub();
        let promise = apiMiddleware(store)(next)(action);
        promise.then(()=> {
          expect(store.dispatch).not.to.be.calledWith(sinon.match({ type: errorType3 }));
          done();
        }).catch(done);
      });
    });
  });


  describe('when action object is without #[CALL_API] and #[CHAIN_API] field', function(){
    it('passes the action to next middleware', function(){
      action = { type: 'not-CALL_API' };
      apiMiddleware(store)(next)(action);
      expect(next).to.have.been.calledWith(action);
    });
  });

  describe('when action is with #[CALL_API]`', function(){
    /**
     * CHAIN_API structure:
     * {
     *   [CHAIN_API]: [
     *     ()=>{
     *       return {
     *         [CALL_API]: actionMetaInfo
     *       }
     *     }
     *   ]
     * }
     */
    beforeEach(function(){
      action = {
        [CALL_API]: {}
      };
    });

    it('redispatches action wrapped with #[CHAIN_API] structure', function(){
      store.dispatch = sinon.stub();
      apiMiddleware(store)(next)(action);
      expect(store.dispatch).have.been.calledWith({
        [CHAIN_API]: [
          ()=>{}
        ]
      });
    });

    it('redispatches action there (#[CHAIN_API]#0)() return action ', function(){
      store.dispatch = sinon.spy();
      apiMiddleware(store)(next)(action);
      //sinon.spy().args[0][0] = 1st argument of 1st call
      const dispatchedAction = store.dispatch.args[0][0];
      expect(dispatchedAction[CHAIN_API][0]()).to.be.equal(action);
    });
  });
});
