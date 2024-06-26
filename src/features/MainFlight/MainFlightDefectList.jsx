import React, { useEffect } from "react";
import { useState } from "react";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import "./css/MainFlightDefectList.css";

const MainFlightDefectList = ({ startfly, currentvt, defectInfo }) => {
  const [open, setOpen] = useState(false);
  const [hadDefect, setHadDefect] = useState({});

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

  // const showImageError = (info, index) => {
  //   return (
  //     <img
  //       src={process.env.REACT_APP_IMG + info}
  //       srcSet={process.env.REACT_APP_IMG + info}
  //       alt={info}
  //       loading="lazy"
  //       width={"100%"}
  //       height={"100%"}
  //     />
  //   );
  // };

  const handleDefectItem = (defectInfo, currentvt) => {
    if (defectInfo.length > 0) {
      console.log(defectInfo);
      return (
        <>
          {/* {showImageError(hadDefect.info, hadDefect.index)} */}

          {defectInfo
            .slice()
            .reverse()
            .map((gis1, index) => {
              console.log(gis1);
              return (
                <>
                  <div
                    className="defect-items-card"
                    onClick={() =>
                      Object.keys(hadDefect).length !== 0
                        ? setHadDefect({})
                        : setHadDefect({
                            info: gis1.defect_image[0],
                            index: index,
                          })
                    }
                  >
                    <div className="defect-items-card__header">
                      <h1>Defect</h1>
                    </div>
                    <div class="defect-items-card__body">
                      <p>{gis1.defect_name}</p>
                      <p>VI TRI: {gis1.location_defect}</p>
                      <p>
                        KD,VD: {parseFloat(gis1.defect_gis.latitude)},{" "}
                        {parseFloat(gis1.defect_gis.longtitude)}
                      </p>
                      <p>ĐỘ CAO: {parseFloat(gis1.defect_gis.altitude)}</p>
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
        {handleDefectItem(defectInfo, currentvt)}
      </div>
    </>
  );
};

export default MainFlightDefectList;
