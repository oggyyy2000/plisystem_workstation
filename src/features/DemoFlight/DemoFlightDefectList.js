import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { DefectInfo, CurrentVT } from "../../redux/selectors";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import "./css/DemoFlightDefectList.css";

export default function DemoFlightDefectList({ startfly }) {
  const [close, setClose] = useState(false);
  const defectInfo = useSelector(DefectInfo);
  const VT = useSelector(CurrentVT);

  console.log("defectInfo: ", defectInfo);

  useEffect(() => {
    if (startfly) {
      setClose(true);
    }
  }, [startfly]);

  function handleHidePanel() {
    setClose(!close);
  }

  function handleDefectItem(defectInfo, VT) {
    if (defectInfo.length > 0) {
      return (
        <>
          {defectInfo.map((gis1) => {
            console.log(gis1);
            return (
              <>
                <div className="flightroute-itemcard">
                  <div className="flightroute-itemcard-header">
                    <h1>Defect</h1>
                  </div>

                  <div class="flightroute-itemcard-content">
                    <p>{gis1.defect_name}</p>
                    <p>VI TRI: {VT}</p>
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
  }
  return (
    <>
      <div
        className={`flightroute-close-leftpanel ${
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
      <div className={`flightroute-left-panel ${close ? "onclose-panel" : ""}`}>
        {/* <div className="flightroute-itemcard">
          <div className="flightroute-itemcard-header">
            <h1>Defect</h1>
          </div>

          <div class="flightroute-itemcard-content">
            <p>CACHDIENTT:VOBAT</p>
            <p>VI TRI: VT8</p>
            <p>KD,VD: 20.988511, 105.863323</p>
            <p>DO CAO: 40.625999</p>
          </div>
        </div>

        <div className="flightroute-itemcard">
          <div className="flightroute-itemcard-header">
            <h1>Defect</h1>
          </div>

          <div class="flightroute-itemcard-content">
            <p>CACHDIENTT:VOBAT</p>
            <p>VI TRI: VT8</p>
            <p>KD,VD: 20.988511, 105.863323</p>
            <p>DO CAO: 40.625999</p>
          </div>
        </div> */}

        {defectInfo && handleDefectItem(defectInfo, VT)}
      </div>
    </>
  );
}

