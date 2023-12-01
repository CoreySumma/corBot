import { combineReducers } from "@reduxjs/toolkit";
import stateData from "./stateData";

const rootReducer = combineReducers({
  stateData: stateData,
});

export default rootReducer;