import { createStore } from "redux";
import myReducer from "./allReducer";
import { composeWithDevTools } from "redux-devtools-extension";

const composedEnhancers = composeWithDevTools();

const store = createStore(myReducer, composedEnhancers);

export default store;
