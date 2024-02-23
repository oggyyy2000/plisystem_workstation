import React from "react";
import FlightManage from "../features/FlightManage/FlightManage";
// import FlightRouteMap from "./features/DemoFlight/DemoFlight";
// import PowerlineCorridor from "./features/PowerlineCorridor/PowerlineCorridor";
import MainFlight from "../features/MainFlight/MainFlight";

// import Login from "../components/Login/Login";

import Page404 from "../components/NavigateErrorTabs/Page404";
import Redirect404 from "../components/NavigateErrorTabs/Redirect404";

// import CheckIfLatestDataReceived from "../components/customComponents/CheckIfDataReceived";

const publicRoutes = [
  { path: "/", component: <MainFlight /> },
  // failed => navigate to error tabs
  { path: "/404", component: <Page404 /> },
  { path: "*", component: <Redirect404 /> },
];

const privateRoutes = [
  {
    path: "/MainFlight",
    component: (
      // <CheckIfLatestDataReceived>
      <MainFlight />
      // </CheckIfLatestDataReceived>
    ),
  },
  // { path: "/DemoFlight", component: <FlightRouteMap /> },
  {
    path: "/FlightManage",
    component: (
      // <CheckIfLatestDataReceived>
      <FlightManage />
      // </CheckIfLatestDataReceived>
    ),
  },
  // { path: "/PowerlineCorridor", component: <PowerlineCorridor /> },
];

export { publicRoutes, privateRoutes };
