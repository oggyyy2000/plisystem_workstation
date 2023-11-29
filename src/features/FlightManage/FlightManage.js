import { Grid, Box } from "@mui/material";
import React from "react";
import FlightManageMap from "./FlightManageMap";
import FlightManageListMission from "./FlightManageListMission";
import FlightManageImageSlider from "./FlightManageImageSlider";
import FlightManageListVT from "./FlightManageListVT";
import FlightManageListTB from "./FlightManageListTB";

import "./css/FlightManage.css";

const FlightManage = () => {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={0} sx={{ height: "95vh" }}>
          <Grid item xs={1.7} className="flight-manage__list-mission-container">
            <FlightManageListMission />
          </Grid>
          <Grid container xs={5.3}>
            <Grid item xs={12} className="flight-manage__map-container">
              <FlightManageMap />
            </Grid>
            <Grid container xs={12}>
              <Grid item xs={8} className="flight-manage__list-VT-container">
                <FlightManageListVT />
              </Grid>
              <Grid item xs={4} className="flight-manage__list-TB-container">
                <FlightManageListTB />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={5} className="flight-manage__image-slide-container">
            <FlightManageImageSlider />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default FlightManage;
