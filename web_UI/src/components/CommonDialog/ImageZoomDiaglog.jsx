import React, { useState, useRef, useEffect } from "react";

import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";

import { Dialog } from "@mui/material";

import "./css/ImageZoomDialog.css";

const ImageZoomDiaglog = ({ info, openZoomingImg, setOpenZoomingImg }) => {
  console.log("info image: ", info);
  // State for image scale
  const [scale, setScale] = useState(1);

  // State for image position
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Reference to the image element
  const imageRef = useRef(null);

  // Zoom in function
  const handleZoomIn = () => {
    setScale((scale) => scale + 0.1);
  };

  // Zoom out function
  const handleZoomOut = () => {
    setScale((scale) => scale - 0.1);
  };

  useEffect(() => {
    if (!openZoomingImg) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [openZoomingImg]);

  // Effect for handling image dragging and zooming
  useEffect(() => {
    const image = imageRef.current;
    let isDragging = false;
    let prevPosition = { x: 0, y: 0 };

    // Mouse down event handler for starting image drag
    const handleMouseDown = (e) => {
      isDragging = true;
      prevPosition = { x: e.clientX, y: e.clientY };
    };

    // Mouse move event handler for dragging the image
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevPosition.x;
      const deltaY = e.clientY - prevPosition.y;
      prevPosition = { x: e.clientX, y: e.clientY };
      setPosition((position) => ({
        x: position.x + deltaX,
        y: position.y + deltaY,
      }));
    };

    // Mouse up event handler for ending image drag
    const handleMouseUp = () => {
      isDragging = false;
    };

    // Add event listeners
    image?.addEventListener("mousedown", handleMouseDown);
    image?.addEventListener("mousemove", handleMouseMove);
    image?.addEventListener("mouseup", handleMouseUp);

    // Remove event listeners on component unmount
    return () => {
      image?.removeEventListener("mousedown", handleMouseDown);
      image?.removeEventListener("mousemove", handleMouseMove);
      image?.removeEventListener("mouseup", handleMouseUp);
    };
  }, [imageRef, scale]);

  return (
    <>
      <Dialog
        open={openZoomingImg === info ? true : false}
        onClose={() => setOpenZoomingImg(false)}
        sx={{
          "& .MuiDialog-container": {
            justifyContent: "center",
            alignItems: "center",
          },
          "& .MuiDialog-paper": {
            overflow: "hidden", // Ẩn overflow dọc
            position: "relative",
          },
        }}
        fullWidth
        maxWidth={"lg"}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="btn-container">
          {/* Button to zoom in */}
          <button onClick={handleZoomIn}>
            <span>
              <ZoomInIcon />
            </span>
          </button>
          {/* Button to zoom out */}
          <button onClick={handleZoomOut}>
            <span>
              <ZoomOutIcon />
            </span>
          </button>
        </div>
        <img
          ref={imageRef}
          src={info}
          srcSet={info}
          alt={info}
          loading="lazy"
          width={"100%"}
          height={"100%"}
          style={{
            position: "relative",
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
            cursor: "move",
          }}
          draggable={false}
        />
      </Dialog>
    </>
  );
};

export default ImageZoomDiaglog;
