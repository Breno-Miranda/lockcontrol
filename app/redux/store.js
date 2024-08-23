import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Usar localStorage como armazenamento
import rootReducer from './reducers'; // Seu arquivo de reducers

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

let store;
let persistor;

if (typeof window !== 'undefined') {
  // Estamos no lado do cliente
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  
  store = createStore(
    persistedReducer,
    composeEnhancers(applyMiddleware())
  );

  persistor = persistStore(store);
} else {
  // Estamos no lado do servidor
  store = createStore(
    rootReducer,
    applyMiddleware()
  );
  persistor = null; // O persistStore não deve ser usado no lado do servidor
}

export { store, persistor };
