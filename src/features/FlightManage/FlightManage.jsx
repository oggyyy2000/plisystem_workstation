import { Grid, Box } from "@mui/material";
import React from "react";
import FlightManageMap from "./FlightManageMap";
import FlightManageListMission from "./FlightManageListMission";
import FlightManageListVT from "./FlightManageListVT";
import FlightManageListTB from "./FlightManageListTB";

import "./css/FlightManage.css";

const FlightManage = () => {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={0} sx={{ height: "93vh" }}>
          <Grid item xs={1.7} className="flight-manage__list-mission-container">
            <FlightManageListMission />
          </Grid>
          <Grid item xs={8.3} className="flight-manage__map-container">
            <FlightManageMap />
          </Grid>
          <Grid
            container
            xs={2}
            sx={{
              display: "grid",
              gridTemplateRows: "1fr 1.5fr",
              height: "100%",
            }}
          >
            <Grid item xs={12} className="flight-manage__list-VT-container">
              <FlightManageListVT />
            </Grid>
            <Grid item xs={12} className="flight-manage__list-TB-container">
              <FlightManageListTB />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default FlightManage;
