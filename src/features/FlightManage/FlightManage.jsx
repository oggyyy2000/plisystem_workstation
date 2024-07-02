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
      <Box
        sx={{
          flexGrow: 1,
          display: {
            xl: "grid",
            lg: "grid",
            md: "none",
            sm: "none",
            xs: "none",
          },
        }}
      >
        <Grid
          container
          spacing={0}
          sx={{
            height: { xl: "calc(100vh - 64px)", lg: "calc(100vh - 64px)" },
          }}
        >
          <Grid
            item
            lg={2}
            xl={1.7}
            className="flight-manage__list-mission-container"
          >
            <FlightManageListMission />
          </Grid>
          <Grid item lg={8} xl={8.5} className="flight-manage__map-container">
            <FlightManageMap />
          </Grid>
          <Grid
            container
            lg={2}
            xl={1.8}
            sx={{
              display: "grid",
              gridTemplateRows: "1fr 1.5fr",
              height: "100%",
            }}
          >
            <Grid item lg={12} className="flight-manage__list-VT-container">
              <FlightManageListVT />
            </Grid>
            <Grid item lg={12} className="flight-manage__list-TB-container">
              <FlightManageListTB />
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          display: {
            xs: "grid",
            sm: "grid",
            md: "grid",
            lg: "none",
            xl: "none",
          },
        }}
      >
        <Grid
          container
          spacing={0}
          sx={{
            height: {
              md: "calc(100vh - 64px)",
              sm: "calc(100vh - 64px)",
              xs: "calc(100vh - 64px)",
            },
          }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            className="flight-manage__map-container"
          >
            <FlightManageMap />
          </Grid>
          <Grid
            item
            xs={3}
            sm={4.5}
            md={3}
            className="flight-manage__list-mission-container"
            sx={{ height: "calc(100vh - 64px - 35%)" }}
          >
            <FlightManageListMission />
          </Grid>

          <Grid
            container
            xs={9}
            sm={7.5}
            md={9}
            sx={{
              display: "grid",
              gridTemplateRows: "1fr 1.5fr",
              height: "calc(100vh - 64px - 35%)",
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
