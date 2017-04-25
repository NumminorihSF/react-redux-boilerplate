"use strict";
import { Map } from 'immutable';

import config from 'config';

import handle from './index';

const { constants: { API: { CODE, FIELD: API_FIELD }, STATE: { VALIDATION } }} = config;

describe('reducer::', function(){
  describe('decorator::handleApiValidationError(types, reducer)', function(){
    describe('(itself)', function(){
      it('returns function', function(){
        const result = handle('', function(){});
        expect(result).to.be.instanceOf(Function);
      });

      it('returns function with 2 arguments', function(){
        const result = handle('', function(){});
        expect(result.length).to.be.equal(2);
      });

      it('throws if reducer is not a function', function(){
        expect(() => handle('')).to.throw(Error);
      });

      it('does not throws if reducer is arrow function', function(){
        expect(() => handle('', ()=>{})).not.to.throw(Error);
      });
    });

    describe('(result on 1 type)', function(){
      const TYPE = 'ERROR_TYPE';
      let reducer;
      let origReducer;
      let action;
      let state;

      beforeEach(function(){
        origReducer = sinon.spy();
        state = Map({ validationErrors: {}});
        action = {
          type: TYPE,
        };
        reducer = handle(TYPE, origReducer);
      });

      describe('on another action\'s type', function(){
        it('calls reducer', function(){
          action.type = 'TYPE_WITHOUT_ERROR';
          reducer(state, action);
          expect(origReducer).to.be.called;
        });

        it('calls reducer with the same args as itself', function(){
          action.type = 'TYPE_WITHOUT_ERROR';
          reducer(state, action);
          expect(origReducer).to.be.calledWith(state, action);
        });
      });

      describe('on error action\'s type', function(){
        describe('if no response field', function(){
          it('calls reducer', function(){
            reducer(state, action);
            expect(origReducer).to.be.called;
          });

          it('calls reducer with the same args as itself', function(){
            reducer(state, action);
            expect(origReducer).to.be.calledWith(state, action);
          });
        });

        describe('if has response field', function(){
          beforeEach(function(){
            action.response = {};
          });

          describe('and code !== error_code from config', function(){
            it('calls reducer', function(){
              reducer(state, action);
              expect(origReducer).to.be.called;
            });

            it('calls reducer with the same args as itself', function(){
              reducer(state, action);
              expect(origReducer).to.be.calledWith(state, action);
            });
          });

          describe('and code === error_code from config', function(){
            let validationErrors;
            beforeEach(function(){
              action.response.code = CODE.VALIDATION_ERROR;
              validationErrors = [];
              action.response[API_FIELD.VALIDATION_ERRORS] = validationErrors;
            });

            it('calls reducer', function(){
              reducer(state, action);
              expect(origReducer).to.be.called;
            });

            it('calls reducer with the new state', function(){
              reducer(state, action);
              expect(origReducer.getCall(0).args[0]).not.to.be.equal(state);
            });

            it('calls reducer with the same action as itself', function(){
              reducer(state, action);
              expect(origReducer.getCall(0).args[1]).to.be.equal(action);
            });

            it('sets validation details field to value from api', function(){
              const myValue = 'my value from validation details';
              action.response[API_FIELD.VALIDATION_DETAILS] = myValue;
              reducer(state, action);
              const newState = origReducer.getCall(0).args[0].toJS();
              expect(newState[VALIDATION.DETAIL_FIELD]).to.be.deep.equal(myValue);
            });

            it('sets validation errors field to values from api for many fields', function(){
              const error1 = 'my error 1';
              const error2 = 'my error 2';
              validationErrors.push({ field: 'field1', errors: [error1]});
              validationErrors.push({ field: 'field2', errors: [error2]});
              reducer(state, action);
              const newState = origReducer.getCall(0).args[0].toJS();
              const expectedResult = {
                field1: [error1],
                field2: [error2],
              };
              expect(newState[VALIDATION.ERRORS_FIELD]).to.be.deep.equal(expectedResult);
            });

            it('sets validation errors field to values from api for 1 field and many errors', function(){
              const error1 = 'my error 1';
              const error2 = 'my error 2';
              validationErrors.push({ field: 'field1', errors: [error1, error2]});
              reducer(state, action);
              const newState = origReducer.getCall(0).args[0].toJS();
              const expectedResult = {
                field1: [error1, error2],
              };
              expect(newState[VALIDATION.ERRORS_FIELD]).to.be.deep.equal(expectedResult);
            });

            it('makes validation errors field as empty Map if validationErrors is empty array', function(){
              state = state.set(VALIDATION.ERRORS_FIELD, { someField: 1 });
              reducer(state, action);
              const newState = origReducer.getCall(0).args[0].toJS();
              expect(newState[VALIDATION.ERRORS_FIELD]).to.be.deep.equal({});
            });

            it('sets validation details field to null if no details', function(){
              state = state.set(VALIDATION.DETAIL_FIELD, '123');
              reducer(state, action);
              const newState = origReducer.getCall(0).args[0].toJS();
              expect(newState[VALIDATION.DETAIL_FIELD]).to.be.deep.equal(null);
            });
          });
        });
      });
    });

    describe('(result on array of types)', function(){
      describe('on first type', function(){
        const TYPE = 'ERROR_TYPE';
        let reducer;
        let origReducer;
        let action;
        let state;

        beforeEach(function(){
          origReducer = sinon.spy();
          state = Map({ validationErrors: {}});
          action = {
            type: TYPE,
          };
          reducer = handle([TYPE, 'ANOTHER_TYPE', 'ANOTHER_TYPE_2'], origReducer);
        });

        describe('on another action\'s type', function(){
          it('calls reducer', function(){
            action.type = 'TYPE_WITHOUT_ERROR';
            reducer(state, action);
            expect(origReducer).to.be.called;
          });

          it('calls reducer with the same args as itself', function(){
            action.type = 'TYPE_WITHOUT_ERROR';
            reducer(state, action);
            expect(origReducer).to.be.calledWith(state, action);
          });
        });

        describe('on error action\'s type', function(){
          describe('if no response field', function(){
            it('calls reducer', function(){
              reducer(state, action);
              expect(origReducer).to.be.called;
            });

            it('calls reducer with the same args as itself', function(){
              reducer(state, action);
              expect(origReducer).to.be.calledWith(state, action);
            });
          });

          describe('if has response field', function(){
            beforeEach(function(){
              action.response = {};
            });

            describe('and code !== error_code from config', function(){
              it('calls reducer', function(){
                reducer(state, action);
                expect(origReducer).to.be.called;
              });

              it('calls reducer with the same args as itself', function(){
                reducer(state, action);
                expect(origReducer).to.be.calledWith(state, action);
              });
            });

            describe('and code === error_code from config', function(){
              let validationErrors;
              beforeEach(function(){
                action.response.code = CODE.VALIDATION_ERROR;
                validationErrors = [];
                action.response[API_FIELD.VALIDATION_ERRORS] = validationErrors;
              });

              it('calls reducer', function(){
                reducer(state, action);
                expect(origReducer).to.be.called;
              });

              it('calls reducer with the new state', function(){
                reducer(state, action);
                expect(origReducer.getCall(0).args[0]).not.to.be.equal(state);
              });

              it('calls reducer with the same action as itself', function(){
                reducer(state, action);
                expect(origReducer.getCall(0).args[1]).to.be.equal(action);
              });

              it('sets validation details field to value from api', function(){
                const myValue = 'my value from validation details';
                action.response[API_FIELD.VALIDATION_DETAILS] = myValue;
                reducer(state, action);
                const newState = origReducer.getCall(0).args[0].toJS();
                expect(newState[VALIDATION.DETAIL_FIELD]).to.be.deep.equal(myValue);
              });

              it('sets validation errors field to values from api for many fields', function(){
                const error1 = 'my error 1';
                const error2 = 'my error 2';
                validationErrors.push({ field: 'field1', errors: [error1]});
                validationErrors.push({ field: 'field2', errors: [error2]});
                reducer(state, action);
                const newState = origReducer.getCall(0).args[0].toJS();
                const expectedResult = {
                  field1: [error1],
                  field2: [error2],
                };
                expect(newState[VALIDATION.ERRORS_FIELD]).to.be.deep.equal(expectedResult);
              });

              it('sets validation errors field to values from api for 1 field and many errors', function(){
                const error1 = 'my error 1';
                const error2 = 'my error 2';
                validationErrors.push({ field: 'field1', errors: [error1, error2]});
                reducer(state, action);
                const newState = origReducer.getCall(0).args[0].toJS();
                const expectedResult = {
                  field1: [error1, error2],
                };
                expect(newState[VALIDATION.ERRORS_FIELD]).to.be.deep.equal(expectedResult);
              });

              it('makes validation errors field as empty Map if validationErrors is empty array', function(){
                state = state.set(VALIDATION.ERRORS_FIELD, { someField: 1 });
                reducer(state, action);
                const newState = origReducer.getCall(0).args[0].toJS();
                expect(newState[VALIDATION.ERRORS_FIELD]).to.be.deep.equal({});
              });

              it('sets validation details field to null if no details', function(){
                state = state.set(VALIDATION.DETAIL_FIELD, '123');
                reducer(state, action);
                const newState = origReducer.getCall(0).args[0].toJS();
                expect(newState[VALIDATION.DETAIL_FIELD]).to.be.deep.equal(null);
              });
            });
          });
        });
      });

      describe('on second type', function(){
        const TYPE = 'ERROR_TYPE';
        let reducer;
        let origReducer;
        let action;
        let state;

        beforeEach(function(){
          origReducer = sinon.spy();
          state = Map({ validationErrors: {}});
          action = {
            type: TYPE,
          };
          reducer = handle(['ANOTHER_TYPE', TYPE, 'ANOTHER_TYPE_2'], origReducer);
        });

        describe('on another action\'s type', function(){
          it('calls reducer', function(){
            action.type = 'TYPE_WITHOUT_ERROR';
            reducer(state, action);
            expect(origReducer).to.be.called;
          });

          it('calls reducer with the same args as itself', function(){
            action.type = 'TYPE_WITHOUT_ERROR';
            reducer(state, action);
            expect(origReducer).to.be.calledWith(state, action);
          });
        });

        describe('on error action\'s type', function(){
          describe('if no response field', function(){
            it('calls reducer', function(){
              reducer(state, action);
              expect(origReducer).to.be.called;
            });

            it('calls reducer with the same args as itself', function(){
              reducer(state, action);
              expect(origReducer).to.be.calledWith(state, action);
            });
          });

          describe('if has response field', function(){
            beforeEach(function(){
              action.response = {};
            });

            describe('and code !== error_code from config', function(){
              it('calls reducer', function(){
                reducer(state, action);
                expect(origReducer).to.be.called;
              });

              it('calls reducer with the same args as itself', function(){
                reducer(state, action);
                expect(origReducer).to.be.calledWith(state, action);
              });
            });

            describe('and code === error_code from config', function(){
              let validationErrors;
              beforeEach(function(){
                action.response.code = CODE.VALIDATION_ERROR;
                validationErrors = [];
                action.response[API_FIELD.VALIDATION_ERRORS] = validationErrors;
              });

              it('calls reducer', function(){
                reducer(state, action);
                expect(origReducer).to.be.called;
              });

              it('calls reducer with the new state', function(){
                reducer(state, action);
                expect(origReducer.getCall(0).args[0]).not.to.be.equal(state);
              });

              it('calls reducer with the same action as itself', function(){
                reducer(state, action);
                expect(origReducer.getCall(0).args[1]).to.be.equal(action);
              });

              it('sets validation details field to value from api', function(){
                const myValue = 'my value from validation details';
                action.response[API_FIELD.VALIDATION_DETAILS] = myValue;
                reducer(state, action);
                const newState = origReducer.getCall(0).args[0].toJS();
                expect(newState[VALIDATION.DETAIL_FIELD]).to.be.deep.equal(myValue);
              });

              it('sets validation errors field to values from api for many fields', function(){
                const error1 = 'my error 1';
                const error2 = 'my error 2';
                validationErrors.push({ field: 'field1', errors: [error1]});
                validationErrors.push({ field: 'field2', errors: [error2]});
                reducer(state, action);
                const newState = origReducer.getCall(0).args[0].toJS();
                const expectedResult = {
                  field1: [error1],
                  field2: [error2],
                };
                expect(newState[VALIDATION.ERRORS_FIELD]).to.be.deep.equal(expectedResult);
              });

              it('sets validation errors field to values from api for 1 field and many errors', function(){
                const error1 = 'my error 1';
                const error2 = 'my error 2';
                validationErrors.push({ field: 'field1', errors: [error1, error2]});
                reducer(state, action);
                const newState = origReducer.getCall(0).args[0].toJS();
                const expectedResult = {
                  field1: [error1, error2],
                };
                expect(newState[VALIDATION.ERRORS_FIELD]).to.be.deep.equal(expectedResult);
              });

              it('makes validation errors field as empty Map if validationErrors is empty array', function(){
                state = state.set(VALIDATION.ERRORS_FIELD, { someField: 1 });
                reducer(state, action);
                const newState = origReducer.getCall(0).args[0].toJS();
                expect(newState[VALIDATION.ERRORS_FIELD]).to.be.deep.equal({});
              });

              it('sets validation details field to null if no details', function(){
                state = state.set(VALIDATION.DETAIL_FIELD, '123');
                reducer(state, action);
                const newState = origReducer.getCall(0).args[0].toJS();
                expect(newState[VALIDATION.DETAIL_FIELD]).to.be.deep.equal(null);
              });
            });
          });
        });
      });

      describe('on last type', function(){
        const TYPE = 'ERROR_TYPE';
        let reducer;
        let origReducer;
        let action;
        let state;

        beforeEach(function(){
          origReducer = sinon.spy();
          state = Map({ validationErrors: {}});
          action = {
            type: TYPE,
          };
          reducer = handle(['ANOTHER_TYPE', 'ANOTHER_TYPE_2', TYPE], origReducer);
        });

        describe('on another action\'s type', function(){
          it('calls reducer', function(){
            action.type = 'TYPE_WITHOUT_ERROR';
            reducer(state, action);
            expect(origReducer).to.be.called;
          });

          it('calls reducer with the same args as itself', function(){
            action.type = 'TYPE_WITHOUT_ERROR';
            reducer(state, action);
            expect(origReducer).to.be.calledWith(state, action);
          });
        });

        describe('on error action\'s type', function(){
          describe('if no response field', function(){
            it('calls reducer', function(){
              reducer(state, action);
              expect(origReducer).to.be.called;
            });

            it('calls reducer with the same args as itself', function(){
              reducer(state, action);
              expect(origReducer).to.be.calledWith(state, action);
            });
          });

          describe('if has response field', function(){
            beforeEach(function(){
              action.response = {};
            });

            describe('and code !== error_code from config', function(){
              it('calls reducer', function(){
                reducer(state, action);
                expect(origReducer).to.be.called;
              });

              it('calls reducer with the same args as itself', function(){
                reducer(state, action);
                expect(origReducer).to.be.calledWith(state, action);
              });
            });

            describe('and code === error_code from config', function(){
              let validationErrors;
              beforeEach(function(){
                action.response.code = CODE.VALIDATION_ERROR;
                validationErrors = [];
                action.response[API_FIELD.VALIDATION_ERRORS] = validationErrors;
              });

              it('calls reducer', function(){
                reducer(state, action);
                expect(origReducer).to.be.called;
              });

              it('calls reducer with the new state', function(){
                reducer(state, action);
                expect(origReducer.getCall(0).args[0]).not.to.be.equal(state);
              });

              it('calls reducer with the same action as itself', function(){
                reducer(state, action);
                expect(origReducer.getCall(0).args[1]).to.be.equal(action);
              });

              it('sets validation details field to value from api', function(){
                const myValue = 'my value from validation details';
                action.response[API_FIELD.VALIDATION_DETAILS] = myValue;
                reducer(state, action);
                const newState = origReducer.getCall(0).args[0].toJS();
                expect(newState[VALIDATION.DETAIL_FIELD]).to.be.deep.equal(myValue);
              });

              it('sets validation errors field to values from api for many fields', function(){
                const error1 = 'my error 1';
                const error2 = 'my error 2';
                validationErrors.push({ field: 'field1', errors: [error1]});
                validationErrors.push({ field: 'field2', errors: [error2]});
                reducer(state, action);
                const newState = origReducer.getCall(0).args[0].toJS();
                const expectedResult = {
                  field1: [error1],
                  field2: [error2],
                };
                expect(newState[VALIDATION.ERRORS_FIELD]).to.be.deep.equal(expectedResult);
              });

              it('sets validation errors field to values from api for 1 field and many errors', function(){
                const error1 = 'my error 1';
                const error2 = 'my error 2';
                validationErrors.push({ field: 'field1', errors: [error1, error2]});
                reducer(state, action);
                const newState = origReducer.getCall(0).args[0].toJS();
                const expectedResult = {
                  field1: [error1, error2],
                };
                expect(newState[VALIDATION.ERRORS_FIELD]).to.be.deep.equal(expectedResult);
              });

              it('makes validation errors field as empty Map if validationErrors is empty array', function(){
                state = state.set(VALIDATION.ERRORS_FIELD, { someField: 1 });
                reducer(state, action);
                const newState = origReducer.getCall(0).args[0].toJS();
                expect(newState[VALIDATION.ERRORS_FIELD]).to.be.deep.equal({});
              });

              it('sets validation details field to null if no details', function(){
                state = state.set(VALIDATION.DETAIL_FIELD, '123');
                reducer(state, action);
                const newState = origReducer.getCall(0).args[0].toJS();
                expect(newState[VALIDATION.DETAIL_FIELD]).to.be.deep.equal(null);
              });
            });
          });
        });
      });
    });

  });
});
