import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reduxThunk from 'redux-thunk'
import reducers from './reducers'
import { authMiddleware } from 'redux-implicit-oauth2'
import { createLogger } from 'redux-logger'
import { fetchContributionsData } from './actions'

const middleware = [reduxThunk, authMiddleware]

if(process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}

const store = applyMiddleware(...middleware)(createStore)(reducers)

const urlParams = new URLSearchParams(window.location.search)
if (urlParams.get('entity') && urlParams.get('year')) {
  const year = urlParams.get('year')
  const entity = urlParams.get('entity')
  if(parseInt(year) && entity) {
    fetchContributionsData(entity, year)(store.dispatch)
  }
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
