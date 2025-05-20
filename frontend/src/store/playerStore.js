import {
    configureStore,
    getDefaultMiddleware
  } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import {appConfigSlice} from  './appconfig/appConfigSlice';
import {onplayingSlice} from  './onplaying/onplayingSlice';
// import epicMiddleware, {rootEpic} from './playerEpics';

const middleware = [...getDefaultMiddleware(), thunk];

const store = configureStore({
  reducer: {
    appconfig: appConfigSlice.reducer,
    onplaying: onplayingSlice.reducer,
  },
  middleware,
  devTools: true,
});

// epicMiddleware.run(rootEpic);

export const appDispatch = store.dispatch;
export default store;