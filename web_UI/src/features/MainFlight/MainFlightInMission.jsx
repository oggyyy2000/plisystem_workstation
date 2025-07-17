import React, { useState, useEffect, useRef } from "react";
import Icon from "../../assets/images/expand-icon.png";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PowerlinePoleIcon from "../../assets/images/mdi--powerline.svg";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import Webcam from "react-webcam";

import "./css/MainFlightInMission.css";

const MainFlightInMission = ({
  startfly,
  currentvt,
  currentlocation,
  superviseType,
  avgThermalBox,
  defectBoxCoordinate,
}) => {
  const [openInMissionPanel, setOpenInMissionPanel] = useState(true);
  const [openZoomView, setOpenZoomView] = useState(false);
  const canvasRef = useRef(null);

  // lay cam tu uav
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    if (!navigator.mediaDevices?.enumerateDevices) return;

    navigator.mediaDevices
      .enumerateDevices()
      .then((mediaDevices) => {
        const videoDevices = mediaDevices.filter(
          ({ kind }) => kind === "videoinput"
        );
        setDevices(videoDevices);
      })
      .catch((err) => console.warn("Media devices error:", err));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ===== HELPER FUNCTIONS (Tách riêng để dễ maintain) =====
    // Helper lấy scale theo loại giám sát
    const getZoomConfig = (type = "nhiệt") => {
      if (type === "thiết bị") {
        // Optical (box thiết bị)
        if (!openZoomView)
          return { type: "normal", scaleX: 0.31953125, scaleY: 0.425 };
        const isLargeScreen =
          window.innerWidth > 1500 && window.innerHeight > 843;
        return isLargeScreen
          ? { type: "large", scaleX: 1, scaleY: 1 }
          : { type: "small", scaleX: 0.5, scaleY: 0.6667 };
      } else {
        // Thermal (box nhiệt)
        if (!openZoomView)
          return { type: "normal", scaleX: 0.6390625, scaleY: 0.59765625 };
        const isLargeScreen =
          window.innerWidth > 1500 && window.innerHeight > 843;
        return isLargeScreen
          ? { type: "large", scaleX: 2, scaleY: 1.40625 }
          : { type: "small", scaleX: 1, scaleY: 0.9375 };
      }
    };

    // Hàm scale toạ độ theo loại box
    const scaleCoordinates = (x, y, type = "nhiệt") => {
      const config = getZoomConfig(type);
      return {
        x: x * config.scaleX,
        y: y * config.scaleY,
      };
    };

    // Hàm để vẽ box cho giám sát quang
    const drawOpticalBox = (x, y, width, height) => {
      // Vẽ main box
      ctx.strokeStyle = "fuchsia";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);

      // Vẽ 4 góc lime cùng lúc (tối ưu hơn)
      const qW = width / 4,
        qH = height / 4;
      ctx.strokeStyle = "lime";
      ctx.lineWidth = 6;

      ctx.beginPath();
      // Top-left
      ctx.moveTo(x + qW, y);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y + qH);
      // Top-right
      ctx.moveTo(x + width - qW, y);
      ctx.lineTo(x + width, y);
      ctx.lineTo(x + width, y + qH);
      // Bottom-left
      ctx.moveTo(x + qW, y + height);
      ctx.lineTo(x, y + height);
      ctx.lineTo(x, y + height - qH);
      // Bottom-right
      ctx.moveTo(x + width - qW, y + height);
      ctx.lineTo(x + width, y + height);
      ctx.lineTo(x + width, y + height - qH);
      ctx.stroke();
    };

    // Hàm để vẽ box cho giám sát nhiệt
    function drawThermalBox(x, y, width, height, color) {
      ctx.strokeStyle = color;
      ctx.lineWidth = openZoomView ? 3 : 2;
      ctx.strokeRect(x, y, width, height);
    }

    // Hàm vẽ spot (hotspot/coldspot)
    function drawSpot(x, y, spotType) {
      const borderRadius = openZoomView ? 5 : 3;

      // Vẽ border (outline)
      ctx.beginPath();
      ctx.arc(x, y, borderRadius, 0, 2 * Math.PI);
      ctx.fillStyle = spotType === "hot" ? "#ff0000" : "#0066ff";
      ctx.fill();
    }

    // Hàm vẽ temperature info table
    function drawThermalTable(x, y, minTemp, maxTemp, avgTemp) {
      const fontSize = openZoomView ? 16 : 10;
      const lineHeight = openZoomView ? 18 : 14;
      const padding = openZoomView ? 8 : 6;
      const dotRadius = 4;
      const tableWidth = openZoomView ? 120 : 85;
      const tableHeight = lineHeight * 3 + padding * 2;

      // Font setup
      ctx.font = `${fontSize}px Roboto`;
      ctx.textBaseline = "middle";

      // Draw semi-transparent background
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(x, y, tableWidth, tableHeight);

      const startY = y + padding + lineHeight / 2;
      const labelX = x + padding + dotRadius * 2 + 6;
      const valueX = x + tableWidth - padding;

      const rows = [
        { label: "Max", value: `${maxTemp.toFixed(1)}°C`, color: "#ff0000" },
        { label: "Min", value: `${minTemp.toFixed(1)}°C`, color: "#0066ff" },
        { label: "Avg", value: `${avgTemp.toFixed(1)}°C`, color: "#ffffff" },
      ];

      rows.forEach((row, index) => {
        const cy = startY + index * lineHeight;

        // Draw color dot
        ctx.beginPath();
        ctx.arc(x + padding + dotRadius, cy, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = row.color;
        ctx.fill();

        // Draw label
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        ctx.fillText(`${row.label}:`, labelX, cy);

        // Draw value aligned to right
        ctx.textAlign = "right";
        ctx.fillText(row.value, valueX, cy);
      });
    }

    // ===== UNIFIED RENDER FUNCTIONS =====
    const renderThermalData = (thermalData, color) => {
      if (!thermalData?.boxe?.length) return;

      let firstBoxPosition = null;

      thermalData.boxe.forEach(([x, y, w, h], index) => {
        const scaledPos = scaleCoordinates(x - w / 2, y - h / 2, "nhiệt");
        const scaledSize = scaleCoordinates(w, h, "nhiệt");

        // ✅ Lưu điểm trên cùng bên trái của box để vẽ table
        if (index === 0) {
          firstBoxPosition = scaledPos;
        }

        drawThermalBox(
          scaledPos.x,
          scaledPos.y,
          scaledSize.x,
          scaledSize.y,
          color
        );
      });

      // Draw spots
      if (thermalData.hotspot?.length >= 2) {
        const [hx, hy] = thermalData.hotspot;
        const scaled = scaleCoordinates(hx, hy, config);
        drawSpot(scaled.x, scaled.y, "hot");
      }

      if (thermalData.coldspot?.length >= 2) {
        const [cx, cy] = thermalData.coldspot;
        const scaled = scaleCoordinates(cx, cy, config);
        drawSpot(scaled.x, scaled.y, "cold");
      }

      // ✅ Draw table - sử dụng firstBoxPosition thay vì scaledPos
      if (thermalData.min_temp !== undefined && firstBoxPosition) {
        const tableX = Math.min(
          Math.max(10, firstBoxPosition.x),
          canvas.width - 140
        );
        const tableY = Math.min(
          Math.max(10, firstBoxPosition.y - 70),
          canvas.height - 70
        );

        drawThermalTable(
          tableX,
          tableY,
          thermalData.min_temp,
          thermalData.max_temp,
          thermalData.avg_temp
        );
      }
    };

    const renderOpticalData = (coords) => {
      const [x, y, w, h] = coords;
      const scaledPos = scaleCoordinates(x - w / 2, y - h / 2, "thiết bị");
      const scaledSize = scaleCoordinates(w, h, "thiết bị");
      drawOpticalBox(scaledPos.x, scaledPos.y, scaledSize.x, scaledSize.y);
    };

    // ===== MAIN RENDER LOGIC =====
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!defectBoxCoordinate?.length && !avgThermalBox?.length) return;

    const config = getZoomConfig();

    // Render defects
    if (defectBoxCoordinate?.length) {
      if (superviseType === "nhiệt") {
        defectBoxCoordinate.forEach((rects) =>
          renderThermalData(rects, "red", config)
        );
      } else if (superviseType === "thiết bị") {
        defectBoxCoordinate.forEach((coords) =>
          renderOpticalData(coords, config)
        );
      }
    }

    // Render thermal analysis
    if (superviseType === "nhiệt" && avgThermalBox?.length) {
      avgThermalBox.forEach((thermal) =>
        renderThermalData(thermal, "green", config)
      );
    }
  }, [
    avgThermalBox,
    defectBoxCoordinate,
    openZoomView,
    superviseType,
  ]);

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
