import React, { useState, useEffect, useCallback, useRef } from "react";

import Icon from "../../assets/images/expand-icon.png";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PowerlinePoleIcon from "../../assets/images/mdi--powerline.svg";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";

import Webcam from "react-webcam";

import "./css/MainFlightInMission.css";

const MainFlightInMission = ({
  startfly,
  currentvt,
  currentlocation,
  superviseType,
  defectBoxCoordinate,
  minMaxThermal,
}) => {
  const [openInMissionPanel, setOpenInMissionPanel] = useState(true);
  const [openZoomView, setOpenZoomView] = useState(false);
  const [rectInfos, setRectInfos] = useState([]);
  const canvasRef = useRef(null);
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // useEffect(() => {
  //   setOpenInMissionPanel(startfly);
  // }, [startfly]);

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

  useEffect(() => {
    if (defectBoxCoordinate) {
      setRectInfos(defectBoxCoordinate);
    }
  }, [defectBoxCoordinate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Hàm để vẽ hình chữ nhật
    function drawRect(x, y, width, height, labelText) {
      ctx.strokeStyle = "fuchsia";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);

      // Calculate dimensions of quarter rectangles
      const quarterWidth = width / 4;
      const quarterHeight = height / 4;

      // Draw top-left quarter rectangle (green top edge)
      ctx.beginPath(); // Start a new path for the top edge
      ctx.strokeStyle = "lime"; // Set stroke color for the top edge
      ctx.lineWidth = 6; // Adjust stroke width as needed
      ctx.moveTo(x + quarterWidth, y); // Start at the top-left corner
      ctx.lineTo(x, y); // Draw the top edge
      ctx.lineTo(x, y + quarterHeight); // Draw the top edge
      ctx.stroke(); // Draw the stroke

      // Draw top-right quarter rectangle (green top edge)
      ctx.beginPath();
      ctx.strokeStyle = "lime";
      ctx.lineWidth = 6;
      ctx.moveTo(x + width - quarterWidth, y);
      ctx.lineTo(x + width, y);
      ctx.lineTo(x + width, y + quarterHeight);
      ctx.stroke();

      // Draw bottom-left quarter rectangle (lime bottom edge)
      ctx.beginPath(); // Start a new path for the bottom edge
      ctx.strokeStyle = "lime"; // Set stroke color for the bottom edge
      ctx.lineWidth = 6; // Adjust stroke width as needed
      ctx.moveTo(x + quarterWidth, y + height); // Start at bottom-left corner
      ctx.lineTo(x, y + height); // Draw the bottom edge
      ctx.lineTo(x, y + height - quarterHeight); // Draw the bottom edge
      ctx.stroke(); // Draw the stroke

      // Draw bottom-right quarter rectangle (lime bottom edge)
      ctx.beginPath();
      ctx.strokeStyle = "lime";
      ctx.lineWidth = 6;
      ctx.moveTo(x - quarterWidth + width, y + height);
      ctx.lineTo(x + width, y + height); // Draw the bottom edge (to the right corner)
      ctx.lineTo(x + width, y + height - quarterHeight); // Draw the bottom edge (to the right corner)
      ctx.stroke();

      // Calculate label position and dimensions
      if (labelText) {
        // Calculate label position and dimensions
        const labelMargin = 5; // Adjust label margin as needed
        const labelX = x - labelMargin; // Adjust based on font size
        const labelY = y - labelMargin; // Position above the top edge

        // Draw the label background (outside the rectangle)
        ctx.fillStyle = "fuchsia"; // Set background color for the label
        const textWidth = ctx.measureText(labelText).width; // Get text width
        const labelWidth = textWidth + labelMargin * 2; // Calculate label width with margin
        const labelHeight = textWidth / 2.5; // Set label height (adjust as needed)
        ctx.fillRect(labelX, labelY - labelHeight, labelWidth, labelHeight); // Draw background rectangle

        // Draw the label text
        ctx.fillStyle = "black"; // Set text color
        openZoomView
          ? (ctx.font = "16px bold Roboto")
          : (ctx.font = "10px bold Roboto"); // Set font style and size (adjust as needed)
        ctx.fillText(labelText, labelX + labelMargin, labelY); // Center text within label background
      }
    }

    // const drawCircleBox = (centerXWS, centerYWS, radiusWS) => {
    //   const ctx = canvas.getContext("2d");

    //   const centerX = centerXWS;
    //   const centerY = centerYWS;
    //   const radius = radiusWS;
    //   // const radius = Math.min(centerX, centerY);
    //   const gap = radius / 4; // Adjust gap size as needed
    //   // const dotRadius = radius / 10; // Adjust dot size as needed

    //   ctx.beginPath();
    //   ctx.arc(centerX, centerY, radius, 0, Math.PI * 2); // Full circle

    //   // Divide the circle into four quadrants
    //   for (let i = 0; i < 4; i++) {
    //     const startAngle = (Math.PI * i) / 2;
    //     const endAngle = (Math.PI * (i + 1)) / 2 - gap / radius; // Adjust endAngle for gap

    //     ctx.beginPath();
    //     ctx.strokeStyle = "green"; // Set stroke color for the quadrant border
    //     ctx.lineWidth = 4; // Adjust line width as needed
    //     ctx.arc(centerX, centerY, radius, startAngle, endAngle); // Quadrant arc
    //     ctx.stroke(); // Draw the arc (border)
    //   }
    //   // // Draw center dot
    //   // ctx.beginPath();
    //   // ctx.fillStyle = "black"; // Set fill color for the dot (adjust as needed)
    //   // ctx.arc(centerX, centerY, dotRadius, 0, Math.PI * 2); // Full circle for the dot
    //   // ctx.fill(); // Fill the dot
    // };

    // Xóa toàn bộ nội dung của canvas nếu dữ liệu rỗng
    if (rectInfos.length === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // drawCircleBox();
    } else if (rectInfos.length > 0) {
      // Vẽ tất cả các hộp chữ nhật từ dữ liệu mới
      if (superviseType === "nhiệt") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // for (const [circleData, radius] of rectInfos) {
        //   const [x, y] = circleData;
        //   if (openZoomView) {
        //     return drawCircleBox(x * 2, y * 1.7578125, radius);
        //   } else {
        //     return drawCircleBox(x * 0.6390625, y * 0.59765625, radius);
        //   }
        // }
        rectInfos.forEach((info) => {
          if (info && info.boxe) {
            const [x, y, width, height] = info.boxe;
            if (
              openZoomView &&
              window.innerWidth > 1500 &&
              window.innerHeight > 843
            ) {
              return drawRect(
                (x - width / 2) * 2,
                (y - height / 2) * 1.40625,
                width * 2,
                height * 1.40625,
                info.label + "°C"
              );
            } else if (
              openZoomView &&
              ((window.innerWidth < 1500 && window.innerHeight < 843) ||
                (window.innerWidth < 1500 && window.innerHeight > 843) ||
                (window.innerWidth > 1500 && window.innerHeight < 843))
            ) {
              return drawRect(
                x - width / 2,
                (y - height / 2) * 0.9375,
                width,
                height * 0.9375,
                info.label + "°C"
              );
            } else {
              return drawRect(
                (x - width / 2) * 0.6390625,
                (y - height / 2) * 0.59765625,
                width * 0.6390625,
                height * 0.59765625,
                info.label + "°C"
              );
            }
          }
        });
      } else if (superviseType === "thiết bị") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        rectInfos.forEach((info) => {
          if (info) {
            const [x, y, width, height] = info;
            if (
              openZoomView &&
              window.innerWidth > 1500 &&
              window.innerHeight > 843
            ) {
              return drawRect(x - width / 2, y - height / 2, width, height);
            } else if (
              openZoomView &&
              ((window.innerWidth < 1500 && window.innerHeight < 843) ||
                (window.innerWidth < 1500 && window.innerHeight > 843) ||
                (window.innerWidth > 1500 && window.innerHeight < 843))
            ) {
              return drawRect(
                (x - width / 2) * 0.5,
                (y - height / 2) * 0.6667,
                width * 0.5,
                height * 0.6667
              );
            } else {
              return drawRect(
                (x - width / 2) * 0.31953125,
                (y - height / 2) * 0.425,
                width * 0.31953125,
                height * 0.425
              );
            }
          }
        });
      }
    }
  }, [rectInfos, openZoomView, superviseType, windowWidth, windowHeight]);

  /*
   * Tỷ lệ chiều rộng: 409/1280​≈0.31953125
   * Tỷ lệ chiều cao: 306/720≈0.425
   */

  const WebcamCapture = () => {
    return (
      <>
        <canvas
          ref={canvasRef}
          className={`${
            openZoomView === true
              ? "info-panel__detect-box-zoomed"
              : "info-panel__detect-box"
          }`}
          width={
            openZoomView
              ? window.innerWidth > 1500 && window.innerHeight > 843
                ? 1280
                : 640
              : 409
          }
          height={
            openZoomView
              ? window.innerWidth > 1500 && window.innerHeight > 843
                ? 720
                : 480
              : 306
          }
        ></canvas>

        <Webcam
          className={`${
            openZoomView === true
              ? "info-panel__camera-zoom-dialog"
              : "info-panel__camera"
          }`}
          audio={false}
          autoPlay
        />
      </>
    );
  };

  return (
    <>
      {startfly && (
        <div className="info-panel__tableinfo">
          <table>
            <tr>
              <td>
                <VisibilityIcon color="warning" />
              </td>
              <td>
                <span>Kiểu giám sát: {superviseType}</span>
              </td>
            </tr>
            <tr>
              <td>
                <img
                  src={PowerlinePoleIcon}
                  srcSet={PowerlinePoleIcon}
                  alt="powerlinePoleIcon"
                  width={"25px"}
                  height={"25px"}
                />
              </td>
              <td>
                <span>Vị trí hiện tại: {currentvt}</span>
              </td>
            </tr>
            <tr>
              <td>
                <LocationOnIcon color="info" />
              </td>
              <td>
                <span>Kinh độ: {parseFloat(currentlocation.longtitude)}</span>{" "}
                <br />
                <span>Vĩ độ: {parseFloat(currentlocation.latitude)}</span>{" "}
                <br />
                <span>Độ cao: {parseFloat(currentlocation.altitude)}</span>{" "}
                <br />
              </td>
            </tr>
            {superviseType === "nhiệt" && (
              <tr>
                <td>
                  <DeviceThermostatIcon color="error" />
                </td>
                <td>
                  <span>
                    Nhiệt độ thấp nhất: <br />
                    {minMaxThermal ? minMaxThermal.T_min : ""}°C
                  </span>
                  <br />
                  <span>
                    Nhiệt độ cao nhất: <br />
                    {minMaxThermal ? minMaxThermal.T_max : ""}°C
                  </span>
                  <br />
                </td>
              </tr>
            )}
          </table>
        </div>
      )}

      <div
        className={`${
          openZoomView === true ? "info-panel__btn-zoomed" : "info-panel__btn"
        } ${
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

      <div
        className={`info-panel__container ${
          openInMissionPanel
            ? "info-panel__container--open"
            : "info-panel__container--close"
        }`}
      >
        <div
          className={`${
            openZoomView === true
              ? "info-panel__cameraview-zoomed"
              : "info-panel__cameraview"
          }`}
        >
          <div
            className={`${
              openZoomView === true
                ? "info-panel__zoom-btn-zoomed"
                : "info-panel__zoom-btn"
            }`}
          >
            <button onClick={() => setOpenZoomView(!openZoomView)}>
              <img src={Icon} alt="Icon" height={"100%"} width={"100%"} />
            </button>
          </div>

          {devices !== "[]" ? (
            WebcamCapture()
          ) : (
            <div className="info-panel__no-signal">không có tín hiệu</div>
          )}
        </div>
      </div>
    </>
  );
};

export default MainFlightInMission;
