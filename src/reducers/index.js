import { combineReducers } from 'redux'
import questions from '../reducers/questions'
import questionDetail from '../reducers/questionDetail'
import users from '../reducers/users'
import userDetail from '../reducers/userDetail'

const rootReducer = combineReducers({
  questions,
  questionDetail,
  users,
  userDetail
});

export default rootReducer;
