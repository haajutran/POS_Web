import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { routerReducer, routerMiddleware } from "react-router-redux";

import * as Login from "./Login";
import * as TableMap from "./TableMap";
import * as NotiCashier from "./NotiCashier";
import * as DetailEmpty from "./DetailEmpty";
import * as TableDetail from "./TableDetail";
import { Table } from "antd";

export default function configureStore(history, initialState) {
  const reducers = {
    login: Login.reducer,
    tableMap: TableMap.reducer,
    detailEmpty: DetailEmpty.reducer,
    notiCashier: NotiCashier.reducer,
    tableDetail: TableDetail.reducer
  };

  const middleware = [thunk, routerMiddleware(history)];

  // In development, use the browser's Redux dev tools extension if installed
  const enhancers = [];
  const isDevelopment = process.env.NODE_ENV === "development";
  if (
    isDevelopment &&
    typeof window !== "undefined" &&
    window.devToolsExtension
  ) {
    enhancers.push(window.devToolsExtension());
  }

  const rootReducer = combineReducers({
    ...reducers,
    routing: routerReducer
  });

  return createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middleware),
      ...enhancers
    )
  );
}
