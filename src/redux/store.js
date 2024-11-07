import { createStore, combineReducers } from "redux";
import { sideBarCollapsed } from "./reducer/sideBarCollapsed.js";
import { isUpload } from "./reducer/isUpload.js";

const rootReducer = combineReducers({
  sideBarCollapsed,
  isUpload,
});

export const store = createStore(rootReducer);

store.subscribe(() => {
  console.log(store.getState());
});
