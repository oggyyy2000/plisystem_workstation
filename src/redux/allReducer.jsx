import { combineReducers } from "redux";
import MissionId from "./reducers/MissionId";
import VTInfo from "./reducers/VTInfo";
import CurrentLocation from "./reducers/CurrentLocation";
import DefectInfo from "./reducers/DefectInfo";
import CurrentVT from "./reducers/CurrentVT";
import CurrentFrame from "./reducers/CurrentFrame"

const myReducer = combineReducers({
  MissionId,
  VTInfo,
  CurrentLocation,
  DefectInfo,
  CurrentVT,
  CurrentFrame,
});

export default myReducer;
