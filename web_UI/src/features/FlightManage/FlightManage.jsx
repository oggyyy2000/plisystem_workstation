import React from "react";
import { Box } from "@mui/material";
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
          height: "calc(100vh - 64px)",
          width: "100vw",
          position: "relative",
          display: {
            xl: "grid",
            lg: "grid",
            md: "grid",
            sm: "none",
            xs: "none",
          },
        }}
      >
        <Box className="flight-manage__list-mission-container">
          <FlightManageListMission />
        </Box>
        <Box className="flight-manage__map-container">
          <FlightManageMap />
        </Box>
        <Box className="flight-manage__list-VT-container">
          <FlightManageListVT />
        </Box>
        <Box className="flight-manage__list-TB-container">
          <FlightManageListTB />
        </Box>
      </Box>
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          bgcolor: "#A0A0A0",
          position: "relative",
          display: {
            xs: "grid",
            sm: "grid",
            md: "none",
            lg: "none",
            xl: "none",
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            backgroundColor: "#f0f0f0",
            borderRadius: "10px",
            height: "calc(100% - 64px - 16px)",
            width: { xs: "50%", sm: "250px" },
            margin: 1,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            overflowY: "auto"
          }}
        >
          <FlightManageListMission />
        </Box>
        <Box
          sx={{
            position: "relative",
            left: {xs: "calc(16px + 50%)",sm: "calc(8px + 250px)"},
            margin: { xs: "8px 0", sm: 1 },
            borderRadius: "10px",
            height: "50%",
            width: {
              xs: "calc(100vw - 50% - 24px)",
              sm: "calc(100vw - 250px - 24px)",
            },
          }}
        >
          <FlightManageMap />
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: "calc(16px + 50%)",
            left: {xs: "calc(16px + 50%)", sm: "calc(8px + 250px)"},
            margin: { xs: "0 8px 0 0", sm: "0 8px 8px 8px" },
            borderRadius: "10px",
            height: "calc(50% - 24px - 64px)",
            width: {xs: "calc((100vw - 50% - 24px) / 2)", sm: "calc((100vw - 250px - 24px) / 3 * 2)"},
            backgroundColor: "#FFFFFF",
            overflow: "auto"
          }}
        >
          <FlightManageListVT />
        </Box> 
        <Box
          sx={{
            position: "absolute",
            top: "calc(16px + 50%)",
            left: {xs: "calc(24px + 50% + ((100vw - 50% - 24px) / 2))", sm: "calc(16px + 250px + ((100vw - 250px - 24px) / 3 * 2))"},
            margin: {xs: "0 8px 0 0", sm: "0 8px 8px 8px"},
            borderRadius: "10px",
            height: "calc(50% - 24px - 64px)",
            width: {xs: "calc((100vw - 50% - 32px) / 2)", sm: "calc((100vw - 250px - 24px - 24px) / 3)"},
            backgroundColor: "#FFFFFF",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            overflow: "auto",
          }}
        >
          <FlightManageListTB />
        </Box>
      </Box>
    </>
  );
};

export default FlightManage;
