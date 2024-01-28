import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import globalReducer from './states/slice.js'
import { apiSlice } from './states/apislice.js'
import { setupListeners } from '@reduxjs/toolkit/query'
import storage from 'redux-persist/lib/storage';
import { persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { registerLicense } from '@syncfusion/ej2-base';
registerLicense("ORg4AjUWIQA/Gnt2VlhhQlJCfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn9RdkJhWH5dc3FcQWNa");

const persistConfig = {
    key: "root",
    version: 1,
    storage,
}

const reducer = combineReducers({
    global: globalReducer,
})

const persistedReducer = persistReducer(persistConfig, reducer);

const store=configureStore({
  reducer:{
    persistedReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({serializableCheck: false}).concat(apiSlice.middleware),
})
setupListeners(store.dispatch)
const persistor = persistStore(store);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>
  </React.StrictMode>,
)
