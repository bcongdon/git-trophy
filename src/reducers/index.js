import { combineReducers } from 'redux'
import { authReducer as auth } from 'redux-implicit-oauth2'
import app from './app'

export default combineReducers({
  app,
  auth
})
