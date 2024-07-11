import * as types from "../types";

let initialState = false;

const myReducers = (state = initialState, action) => {
  switch (action.type) {
    case types.FlyMissionStart:
      return action.data;
    default:
      return state;
  }
};
export default myReducers;
