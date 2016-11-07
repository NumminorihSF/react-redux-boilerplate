import { CALL_API, CHAIN_API } from '../middleware/api'

export const LOADED_QUESTIONS = Symbol('LOADED_QUESTIONS');
export function loadQuestions() {
  return {
    [CALL_API]: {
      method: 'get',
      path: '/api/questions',
      successType: LOADED_QUESTIONS
    }
  }
}

export const LOAD_QUESTION_DETAIL = Symbol('LOAD_QUESTION_DETAIL');
export const LOADED_QUESTION_DETAIL = Symbol('LOADED_QUESTION_DETAIL');
export const LOADED_QUESTION_USER = Symbol('LOADED_QUESTION_USER');
export function loadQuestionDetail ({ id, history }) {
  return {
    [CHAIN_API]: [
      ()=> {
        return {
          [CALL_API]: {
            method: 'get',
            path: `/api/questions/${id}`,
            startType: LOAD_QUESTION_DETAIL,
            successType: LOADED_QUESTION_DETAIL,
            afterError: ()=> {
              history.push('/')
            }
          }
        }
      },
      (question) => {
        return {
          [CALL_API]: {
            method: 'get',
            path: `/api/users/${question.userId}`,
            successType: LOADED_QUESTION_USER
          }
        }
      }
    ]
  }
}
