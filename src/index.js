import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reduxThunk from 'redux-thunk'
import reducers from './reducers'
import { authMiddleware } from 'redux-implicit-oauth2'
import { createLogger } from 'redux-logger'
import { updateSelectedEntity } from './actions'
import { UPDATE_SELECTED_YEAR, START_MODEL_LOADING } from './types'

const middleware = [reduxThunk, authMiddleware]

if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}

const store = applyMiddleware(...middleware)(createStore)(reducers)

// Pull in initial state from querystring arguments
const urlParams = new URLSearchParams(window.location.search)
if (urlParams.get('entity') && urlParams.get('year')) {
  const year = urlParams.get('year')
  const entity = urlParams.get('entity')
  if (parseInt(year) && entity) {
    store.dispatch({type: START_MODEL_LOADING})
    store.dispatch({type: UPDATE_SELECTED_YEAR, year})
    updateSelectedEntity(entity)(store.dispatch, store.getState)
  }
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
