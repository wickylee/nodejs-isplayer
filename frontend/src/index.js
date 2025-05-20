import "./scss/app.scss";
import "./scss/config.scss";
import "core-js";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./app";
// import configureStore from "./store/configure";
import playerStore from './store/playerStore';

// const store = configureStore();

ReactDOM.render(
  <Provider store={playerStore}>
    <Suspense fallback="loading..."> 
      <BrowserRouter>
        <App />
      </BrowserRouter>
     </Suspense>
  </Provider>,
  document.getElementById("app")
);
