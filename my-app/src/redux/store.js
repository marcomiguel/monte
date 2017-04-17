import React from 'react';
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import SimpleForm from '../components/SimpleForm'

const reducers = {
  // ... your other reducers here ...
  form: formReducer     // <---- Mounted at 'form'
}
const reducer = combineReducers(reducers)
const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
// const store =
//   (window.devToolsExtension ? window.devToolsExtension()(createStore) : createStore)(reducer)

export const Store = () => {
  return (
    <Provider store={store}>
        <SimpleForm/>
    </Provider>
  )
}