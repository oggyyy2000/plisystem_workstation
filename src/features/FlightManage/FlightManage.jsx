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
            md: "grid",
            sm: "none",
            xs: "none",
          },
        }}
      >
        <Grid
          container
          spacing={0}
          sx={{
            height: {
              xl: "calc(100vh - 64px)",
              lg: "calc(100vh - 64px)",
              md: "calc(100vh - 64px)",
            },
          }}
        >
          <Grid
            item
            md={3}
            lg={2.5}
            xl={2}
            className="flight-manage__list-mission-container"
          >
            <FlightManageListMission />
          </Grid>
          <Grid item md={5.5} lg={7.5} xl={8.2} className="flight-manage__map-container">
            <FlightManageMap />
          </Grid>
          <Grid
            container
            md={3.5}
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
            md: "none",
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
              sm: "calc(100vh - 64px)",
              xs: "calc(100vh - 64px)",
            },
          }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            className="flight-manage__map-container"
          >
            <FlightManageMap />
          </Grid>
          <Grid
            item
            xs={5}
            sm={4.5}
            className="flight-manage__list-mission-container"
            sx={{ height: "calc(100vh - 64px - 29vh)" }}
          >
            <FlightManageListMission />
          </Grid>

          <Grid
            container
            xs={7}
            sm={7.5}
            sx={{
              display: "grid",
              gridTemplateRows: "1fr 1.5fr",
              height: "calc(100vh - 64px - 29vh)",
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
