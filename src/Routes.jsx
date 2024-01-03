import React from "react";
import FlightManage from "./features/FlightManage/FlightManage";
// import FlightRouteMap from "./features/DemoFlight/DemoFlight";
// import PowerlineCorridor from "./features/PowerlineCorridor/PowerlineCorridor";
import MainFlight from "./features/MainFlight/MainFlight";

import Page404 from "./components/NavigateErrorTabs/Page404";
import Redirect404 from "./components/NavigateErrorTabs/Redirect404";

const routes = [
  { path: "/", element: <MainFlight /> },
  { path: "/MainFlight", element: <MainFlight /> },
  // { path: "/DemoFlight", element: <FlightRouteMap /> },
  { path: "/FlightManage", element: <FlightManage /> },
  // { path: "/PowerlineCorridor", element: <PowerlineCorridor /> },

  // failed => navigate to error tabs

  { path: "/404", element: <Page404 /> },
  { path: "*", element: <Redirect404 /> },
];

export default routes;
