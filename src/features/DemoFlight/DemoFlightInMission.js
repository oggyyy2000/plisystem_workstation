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

import "./css/DemoFlightInMission.css";

export default function DemoFlightInMission({ startfly, progress }) {
  const [open, setOpen] = useState(false);
  const [close, setClose] = useState(false);
  const [listImageLink, setListImageLink] = useState([]);
  console.log(listImageLink);
  //test
  const [imageLink, setImageLink] = useState("");

  const currentLocation = useSelector(CurrentLocation);
  const VT = useSelector(CurrentVT);
  const currentFrame = useSelector(CurrentFrame);
  console.log(currentFrame);

  useEffect(() => {
    if (startfly) {
      setClose(true);
    }
    setListImageLink((prevListImage) => [...prevListImage, currentFrame]);
  }, [startfly, currentFrame]);

  useEffect(() => {
    const getDataThread = setTimeout(() => {
      if (listImageLink.length > 0) {
        setImageLink(listImageLink[0]);
        setListImageLink((prevListImage) => prevListImage.slice(1));
        // setImageLink(listImageLink.shift());
      }
    }, 0);

    return () => clearTimeout(getDataThread);
  }, [listImageLink]);
  // setTimeout(() => {
  //   if (listImageLink.length > 0) {
  //     setImageLink(listImageLink[0]);
  //     setListImageLink((prevListImage) => prevListImage.slice(1));
  //     // setImageLink(listImageLink.shift());
  //   }
  // }, 400);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleHidePanel() {
    setClose(!close);
  }

  const renderImage = (imagelink) => {
    return (
      <img
        key={currentFrame}
        src={imagelink}
        alt={currentFrame}
        height={"225px"}
        width={"409px"}
      />
    );
  };

  function zoomView() {
    return (
      <>
        <Dialog
          open={open}
          onClose={handleClose}
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
              {imageLink !== "" ? (
                <img
                  key={currentFrame}
                  src={imageLink}
                  alt={currentFrame}
                  height={"679px"}
                  width={"734px"}
                />
              ) : (
                <div className="flightroute-before-datareturned">no rgb</div>
              )}
            </div>
            <div className="flightroute-thermalcam-expand-container">
              <div className="flightroute-thermalcam-expand-title">thermal</div>
              <div className="flightroute-before-datareturned">no thermal</div>
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
          close === true ? "onclose-btn-rightpanel" : ""
        }`}
      >
        <button onClick={handleHidePanel}>
          {close === true ? (
            <KeyboardArrowRightIcon />
          ) : (
            <KeyboardArrowLeftIcon />
          )}
        </button>
      </div>
      <Fade in={close} timeout={1200}>
        <div
          className={`flightroute-right-panel ${
            close ? "onclose-rightpanel" : ""
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
              <button onClick={handleClickOpen}>
                <img src={Icon} alt="Icon" height={"100%"} width={"100%"} />
              </button>
            </div>

            {imageLink !== "" ? (
              // <img
              //   key={currentFrame}
              //   src={debouncedImageUrl}
              //   alt={currentFrame}
              //   height={"225px"}
              //   width={"409px"}
              // />
              renderImage(imageLink)
            ) : (
              <div className="flightroute-before-datareturned">no rgb</div>
            )}
          </div>
          <div className="flightroute-thermalview-container">
            <div className="flightroute-thermal-title">Thermal</div>
            <div className="flightroute-before-datareturned">no thermal</div>
          </div>
          {zoomView()}
        </div>
      </Fade>
    </>
  );
}
