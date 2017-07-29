import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reduxThunk from 'redux-thunk'
import reducers from './reducers'
import { authMiddleware } from 'redux-implicit-oauth2'
import { createLogger } from 'redux-logger'

const middleware = [reduxThunk, authMiddleware]

if(process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}

const store = applyMiddleware(...middleware)(createStore)(reducers)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
