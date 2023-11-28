import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import {
  CurrentLocation,
  CurrentVT,
  CurrentFrame,
} from "../../redux/selectors";

import { Dialog, Fade } from "@mui/material";
import Icon from "../../assets/images/expand-icon.png";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import videoRGB from "../../assets/images/RGBVID/BT_DJI_0701.mp4";
import videoThermal from "../../assets/images/ThermalVID/T_DJI_0701.mp4";

import "./css/DemoFlightInMission.css";

export default function DemoFlightInMission({ startfly, progress }) {
  const [openZoomView, setOpenZoomView] = useState(false);
  const [closeRightPanel, setCloseRightPanel] = useState(false);

  const currentLocation = useSelector(CurrentLocation);
  const VT = useSelector(CurrentVT);
  const currentFrame = useSelector(CurrentFrame);
  console.log(currentFrame);

  useEffect(() => {
    if (startfly) {
      setCloseRightPanel(true);
    }
  }, [startfly, currentFrame]);

  const zoomView = () => {
    return (
      <>
        <Dialog
          open={openZoomView}
          onClose={() => setOpenZoomView(false)}
          sx={{
            "& .MuiDialog-container": {
              justifyContent: "flex-start",
              alignItems: "flex-start",
            },
          }}
          PaperProps={{
            sx: { height: "681px", width: "1535px", maxWidth: "1535px" },
          }}
          // hideBackdrop={true}
        >
          <div className="flightroute-expandcam-container">
            <div className="flightroute-rgbcam-expand-container">
              <div className="flightroute-rgbcam-expand-title">RGB</div>
              {/* <div className="flightroute-before-datareturned">no rgb</div> */}
              <div className="flightroute-rgbcam-expand-content">
                <video src={videoRGB} autoPlay loop controls muted />
              </div>
            </div>
            <div className="flightroute-thermalcam-expand-container">
              <div className="flightroute-thermalcam-expand-title">thermal</div>
              {/* <div className="flightroute-before-datareturned">no thermal</div> */}
              <div className="flightroute-thermalcam-expand-content">
                <video src={videoThermal} autoPlay loop controls muted />
              </div>
            </div>
          </div>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <div
        className={`flightroute-close-rightpanel ${
          closeRightPanel === true ? "onclose-btn-rightpanel" : ""
        }`}
      >
        <button onClick={() => setCloseRightPanel(!closeRightPanel)}>
          {closeRightPanel === true ? (
            <KeyboardArrowRightIcon />
          ) : (
            <KeyboardArrowLeftIcon />
          )}
        </button>
      </div>
      <Fade in={closeRightPanel} timeout={1200}>
        <div
          className={`flightroute-right-panel ${
            closeRightPanel ? "onclose-rightpanel" : ""
          }`}
        >
          <div className="flightroute-tableinfo">
            <table>
              <tr>
                <td>VTHT: {VT}</td>
                <td rowSpan={2}>
                  Longtitude: {parseFloat(currentLocation.longtitude)} <br />
                  Latitude: {parseFloat(currentLocation.latitude)} <br />
                  Altitude: {parseFloat(currentLocation.altitude)}
                </td>
              </tr>
              <tr>
                <td>FPS:</td>
              </tr>
              <tr>
                <td colSpan={2}>Process: {progress}</td>
              </tr>
            </table>
          </div>
          <div className="flightroute-rgbview-container">
            <div className="flightroute-rgb-title">RGB</div>
            <div className="flightroute-rgb-expandbtn">
              <button onClick={() => setOpenZoomView(true)}>
                <img src={Icon} alt="Icon" height={"100%"} width={"100%"} />
              </button>
            </div>
            {/* <div className="flightroute-before-datareturned">no rgb</div> */}
            <div>
              <video src={videoRGB} width="100%" autoPlay loop controls muted />
            </div>
          </div>
          <div className="flightroute-thermalview-container">
            <div className="flightroute-thermal-title">Thermal</div>
            {/* <div className="flightroute-before-datareturned">no thermal</div> */}
            <video
              src={videoThermal}
              width="100%"
              autoPlay
              loop
              controls
              muted
            />
          </div>
          {zoomView()}
        </div>
      </Fade>
    </>
  );
}
