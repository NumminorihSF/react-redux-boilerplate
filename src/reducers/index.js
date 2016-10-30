import { combineReducers } from 'redux'
import questions from '../reducers/questions'
import questionDetail from '../reducers/questionDetail'
import users from '../reducers/users'
import userDetail from '../reducers/userDetail'
//import { routerReducer } from 'react-router-redux'
import routing from './routing';

const rootReducer = combineReducers({
  routing,
  questions,
  questionDetail,
  users,
  userDetail
});

export default rootReducer;
