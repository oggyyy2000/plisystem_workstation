import React, { useEffect } from "react";
import { useState } from "react";

import { Button } from "@mui/material";

import PinDropIcon from "@mui/icons-material/PinDrop";
import NearMeIcon from "@mui/icons-material/NearMe";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import "./css/MainFlightDefectList.css";

const MainFlightDefectList = ({
  startfly,
  defectInfo,
  setOpenZoomingImg,
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (startfly && defectInfo.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [startfly, defectInfo.length]);

  const handleHidePanel = () => {
    setOpen(!open);
  };

  const handleDefectItem = (defectInfo) => {
    if (defectInfo.length > 0) {
      console.log(defectInfo);
      return (
        <>
          {defectInfo
            .slice()
            .reverse()
            .map((gis1, index) => {
              console.log(gis1);
              return (
                <>
                  <div
                    className="defect-items-card"
                  >
                    <div className="defect-items-card__header">
                      <h1>{gis1.defect_name}</h1>
                    </div>
                    <div class="defect-items-card__body">
                      <table>
                        <tr>
                          <td>
                            <NearMeIcon sx={{ color: "#00C8F8" }} />
                          </td>
                          <td colSpan={2}>VỊ TRÍ: {gis1.location_defect}</td>
                        </tr>
                        <tr>
                          <td rowSpan={2} width={"30px"}>
                            <PinDropIcon style={{ color: "#00C8F8" }} />
                          </td>
                          <td>
                            TỌA ĐỘ: {parseFloat(gis1.defect_gis.latitude)},{" "}
                            {parseFloat(gis1.defect_gis.longtitude)}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            ĐỘ CAO: {parseFloat(gis1.defect_gis.altitude)}m
                          </td>
                        </tr>
                      </table>
                    </div>
                    <div className="defect-items-card__footer">
                      <Button
                        variant="outlined"
                        onClick={() =>
                          setOpenZoomingImg(
                            process.env.REACT_APP_IMG + gis1.defect_image[0]
                          )
                        }
                      >
                        Xem ảnh
                      </Button>
                    </div>
                  </div>
                </>
              );
            })}
        </>
      );
    }
  };

  return (
    <>
      <div
        className={`defect-list__btn ${
          open ? "defect-list__btn--open" : "defect-list__btn--close"
        }`}
      >
        <button onClick={handleHidePanel}>
          {open ? <KeyboardArrowLeftIcon /> : <KeyboardArrowRightIcon />}
        </button>
      </div>

      <div
        className={`defect-list__container ${
          open
            ? "defect-list__container--open"
            : "defect-list__container--close"
        }`}
      >
        {handleDefectItem(defectInfo)}
      </div>
    </>
  );
};

export default MainFlightDefectList;
