import React from "react";
import FlightManage from "../features/FlightManage/FlightManage";
import MainFlight from "../features/MainFlight/MainFlight";
import PowerlineRouteManage from "../features/PowerlineRouteManage/PowerlineRouteManage";

import Page404 from "../components/NavigateErrorTabs/Page404";
import Redirect404 from "../components/NavigateErrorTabs/Redirect404";

const publicRoutes = [
  { path: "/", component: <MainFlight /> },
  // failed => navigate to error tabs
  { path: "/404", component: <Page404 /> },
  { path: "*", component: <Redirect404 /> },
];

const privateRoutes = [
  {
    path: "/MainFlight",
    component: <MainFlight />,
  },
  {
    path: "/FlightManage",
    component: <FlightManage />,
  },
  {
    path: "/PowerlineRouteManage",
    component: <PowerlineRouteManage />,
  },
];

export { publicRoutes, privateRoutes };
