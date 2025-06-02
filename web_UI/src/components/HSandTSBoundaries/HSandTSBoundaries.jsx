import React from "react";

import { Polyline, Tooltip } from "react-leaflet";

const HoangSaCoordinate = [
  [17.206, 111.259],
  [17.188, 112.363],
  [16.784, 112.923],
  [15.922, 112.714],
  [15.623, 111.069],
  [16.526, 111.121],
  [17.206, 111.259],
];

const TruongSaCoordinate = [
  [9.017, 112.6988],
  [8.671, 112.7867],
  [8.459, 111.973],
  [8.497, 111.577],
  [8.668, 111.473],
  [8.885, 111.643],
  [9.145, 112.352],
  [9.017, 112.6988],
];

const HSandTSBoundaries = () => {
  return (
    <>
      <Polyline
        pathOptions={{ color: "#9B91AF" }}
        positions={HoangSaCoordinate}
      >
        <Tooltip permanent>Hoàng Sa</Tooltip>
      </Polyline>
      <Polyline
        pathOptions={{ color: "#9B91AF" }}
        positions={TruongSaCoordinate}
      >
        <Tooltip permanent>Trường Sa</Tooltip>
      </Polyline>
    </>
  );
};

export default HSandTSBoundaries;
