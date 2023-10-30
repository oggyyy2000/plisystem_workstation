import React, { useEffect } from "react";
import { useState } from "react";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import "./css/MainFlightDefectList.css";

const MainFlightDefectList = ({ startfly, currentvt, defectInfo }) => {
  const [close, setClose] = useState(false);

  useEffect(() => {
    if (startfly) {
      setClose(true);
    }
  }, [startfly]);

  const handleHidePanel = () => {
    setClose(!close);
  };

  const handleDefectItem = (defectInfo, currentvt) => {
    if (defectInfo.length > 0) {
      return (
        <>
          {defectInfo.map((gis1) => {
            console.log(gis1);
            return (
              <>
                <div className="mainflight-itemcard">
                  <div className="mainflight-itemcard-header">
                    <h1>Defect</h1>
                  </div>
                  <div class="mainflight-itemcard-content">
                    <p>{gis1.defect_name}</p>
                    <p>VI TRI: {currentvt}</p>
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
        className={`mainflight-close-leftpanel ${
          close === true ? "onclose-btn" : ""
        }`}
      >
        <button onClick={handleHidePanel}>
          {close === true ? (
            <KeyboardArrowLeftIcon />
          ) : (
            <KeyboardArrowRightIcon />
          )}
        </button>
      </div>
      <div className={`mainflight-left-panel ${close ? "onclose-panel" : ""}`}>
        {/* <div className="mainflight-itemcard">
          <div className="mainflight-itemcard-header">
            <h1>Defect</h1>
          </div>

          <div class="mainflight-itemcard-content">
            <p>CACHDIENTT:VOBAT</p>
            <p>VI TRI: VT8</p>
            <p>KD,VD: 20.988511, 105.863323</p>
            <p>DO CAO: 40.625999</p>
          </div>
        </div>

        <div className="mainflight-itemcard">
          <div className="mainflight-itemcard-header">
            <h1>Defect</h1>
          </div>

          <div class="mainflight-itemcard-content">
            <p>CACHDIENTT:VOBAT</p>
            <p>VI TRI: VT8</p>
            <p>KD,VD: 20.988511, 105.863323</p>
            <p>DO CAO: 40.625999</p>
          </div>
        </div> */}

        {handleDefectItem(defectInfo, currentvt)}
      </div>
    </>
  );
};

export default MainFlightDefectList;
