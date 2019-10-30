import { combineReducers, createStore, applyMiddleware, compose } from 'redux'

import { holochainMiddleware } from '@holochain/hc-redux-middleware'
import { connect } from '@holochain/hc-web-client'

import reducer from './reducer'
import { URL } from './utils'

// in production the conductor will tell us where to connect. For dev must speficy a port
const url = process.env.NODE_ENV === 'production' ? undefined : 'ws://localhost:4000'
// put middleware in this array to have it applied
const middleware: Array<any> = [holochainMiddleware(connect({url}))]

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

function CreateStore () {
  return createStore(
  	reducer,
  	composeEnhancers(
      applyMiddleware(...middleware)
    )
  )
}

export default CreateStore
