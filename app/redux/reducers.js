// reducers.js
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import initReducer from './init/initReducer'; 
import persistConfig from './persistConfig';  

const rootReducer = combineReducers({
  init: initReducer,
  // Add more reducers as needed
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;