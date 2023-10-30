import { Grid, Box } from "@mui/material";
import React from "react";
import FlightManageMap from "./FlightManageMap";
import FlightManageListMission from "./FlightManageListMission";
import FlightManageImageSlider from "./FlightManageImageSlider";
import FlightManageListVT from "./FlightManageListVT";
import FlightManageListTB from "./FlightManageListTB";

import "./css/FlightManage.css";

export default function FlightManage() {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={0}>
          <Grid item xs={1.7} className="home-left-panel">
            <FlightManageListMission />
          </Grid>
          <Grid container xs={5.3}>
            <Grid item xs={12} className="home-middle-panel-map">
              <FlightManageMap />
            </Grid>
            <Grid container xs={12}>
              <Grid item xs={8} className="home-middle-panel-listVT">
                <FlightManageListVT />
              </Grid>
              <Grid item xs={4} className="home-middle-panel-listTB">
                <FlightManageListTB />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={5} className="home-right-panel">
            <FlightManageImageSlider />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

