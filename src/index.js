import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './stores/configureStore';
import {Router, Route, browserHistory, IndexRoute} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'

import Main from './components/Main'
import Home from './components/Home'
import Product from './components/Product'

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store)


render(
  <Provider store={store}>
	  <Router history={history}>
		  <Route path="/" component={Main}>
			  <IndexRoute component={Home} />
			  <Route path="product" component={Product}/>
		  </Route>
	  </Router>
  </Provider>,
  document.getElementById('app')
);
