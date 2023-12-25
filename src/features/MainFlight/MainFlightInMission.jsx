import React, { useState, useEffect, useCallback } from "react";

import { Dialog, Fade } from "@mui/material";
import Icon from "../../assets/images/expand-icon.png";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import Webcam from "react-webcam";

import "./css/MainFlightInMission.css";

const MainFlightInMission = ({ startfly, currentvt, currentlocation }) => {
  const [openZoomView, setOpenZoomView] = useState(false);
  const [openInMissionPanel, setOpenInMissionPanel] = useState(false);

  useEffect(() => {
    setOpenInMissionPanel(startfly);
  }, [startfly]);

  // lay cam tu uav
  const [devices, setDevices] = useState([]);

  const handleDevices = useCallback(
    (mediaDevices) =>
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    [setDevices]
  );

  useEffect(() => {
    if (navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then(handleDevices);
    }
  }, [handleDevices, devices]);

  const WebcamCapture = () => {
    return (
      <>
        <Webcam className="info-panel__camera" audio={false} />
      </>
    );
  };

  const cameraZoom = () => {
    return (
      <>
        <Dialog
          open={openZoomView}
          onClose={() => setOpenZoomView(false)}
          sx={{
            "& .MuiDialog-container": {
              justifyContent: "center",
              alignItems: "center",
            },
          }}
          fullWidth
          maxWidth={"xl"}
        >
          <div className="info-panel__camera-zoom-dialog">
            {/* {devices.find(({ label }) =>
              label.includes("USB Video (534d:2109)")
            ) ? ( */}
            {/* {WebcamCapture()} */}
            {/* ) : (
              <div className="info-panel__no-signal">không có tín hiệu</div>
            )} */}

            {devices !== "[]" ? (
              WebcamCapture()
            ) : (
              <div className="info-panel__no-signal">không có tín hiệu</div>
            )}
          </div>
        </Dialog>
      </>
    );
  };

  return (
    <>
      <div
        className={`info-panel__btn ${
          openInMissionPanel === true
            ? "info-panel__btn--open"
            : "info-panel__btn--close"
        }`}
      >
        <button onClick={() => setOpenInMissionPanel(!openInMissionPanel)}>
          {openInMissionPanel === true ? (
            <KeyboardArrowRightIcon />
          ) : (
            <KeyboardArrowLeftIcon />
          )}
        </button>
      </div>
      <Fade in={openInMissionPanel} timeout={1200}>
        <div
          className={`info-panel__container ${
            openInMissionPanel
              ? "info-panel__container--open"
              : "info-panel__container--close"
          }`}
        >
          <div className="info-panel__tableinfo">
            <table>
              <tr>
                <td>VTHT: {currentvt}</td>
                <td>
                  <span>Longtitude: {parseFloat(currentlocation.longtitude)} </span> <br />
                  <span>Latitude: {parseFloat(currentlocation.latitude)} </span> <br />
                  <span>Altitude: {parseFloat(currentlocation.altitude)} </span>
                 </td>
              </tr>
            </table>
          </div>
          <div className="info-panel__cameraview">
            <div className="info-panel__zoom-btn">
              <button onClick={() => setOpenZoomView(true)}>
                <img src={Icon} alt="Icon" height={"100%"} width={"100%"} />
              </button>
            </div>

            {/* {devices.find(({ label }) =>
              label.includes("USB Video (534d:2109)")
            ) ? (
              WebcamCapture()
            ) : (
              <div className="info-panel__no-signal">không có tín hiệu</div>
            )} */}
            {devices !== "[]" ? (
              WebcamCapture()
            ) : (
              <div className="info-panel__no-signal">không có tín hiệu</div>
            )}
          </div>

          {cameraZoom()}
        </div>
      </Fade>
    </>
  );
};

export default MainFlightInMission;
