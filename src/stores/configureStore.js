import { createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk'
import promiseMiddleware from 'redux-promise-middleware'
import logger from 'redux-logger'
import reducers from '../reducers'

const middlewares = [
	thunkMiddleware,
	promiseMiddleware(),
	logger()
]

const enhancer = compose(
	applyMiddleware(...middlewares),
)


export default function(end = 'admin', initialState = {}) {
	let store = createStore(reducers, initialState, enhancer)
	let nextReducer = require('../reducers')
	//const store = applyMiddleware(...middlewares)(createStore)(reducers, initialState)



  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      store.replaceReducer(nextReducer)
    })
  }

  return store
}
