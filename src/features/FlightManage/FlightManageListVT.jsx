import React from "react";
import { useState, useEffect } from "react";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import itemIcon from "../../assets/images/powerpole_logo.png";

import axios from "axios";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import * as actions from "../../redux/types";
import { MissionId, VTInfo } from "../../redux/selectors";

import "./css/FlightManageListVT.css";

const FlightManageListVT = () => {
  const [missionData, setMissionData] = useState();
  const dispatch = useDispatch();
  const missionId = useSelector(MissionId);
  console.log(missionId)
  const VTdetail = useSelector(VTInfo);
  const urlhomePageView = process.env.REACT_APP_API_URL + "homepageapiview/";

  useEffect(() => {
    missionId &&
      axios
        .get(urlhomePageView)
        .then((res) => {
          console.log(res.data)
          setMissionData(
            res.data.find((id) => id.schedule_id === missionId)
          );
          console.log(res.data.find((id) => id.schedule_id === missionId));
        })
        .catch((err) => {
          console.log(err);
        });
  }, [missionId, urlhomePageView]);

  useEffect(() => {
    if (missionData) {
      console.log(missionData.supervision_results);
      const supervisionRes = Object.keys(missionData.supervision_results);
      dispatch({
        type: actions.VTInfo,
        data: {
          name: supervisionRes[0],
          data: missionData.supervision_results[supervisionRes[0]],
        },
      });
    }
  }, [missionData, dispatch]);

  console.log(VTdetail);

  const renderVT = () => {
    return (
      <>
        {typeof missionData.supervision_results !== "string" ? (
          Object.keys(missionData.supervision_results).map((item) => {
            let error = false;
            const handleListVTClick = () => {
              dispatch({
                type: actions.VTInfo,
                data: {
                  name: item,
                  data: missionData.supervision_results[item],
                },
              });
            };
            Object.keys(missionData.supervision_results[item]).forEach(
              (item2) => {
                if (missionData.supervision_results[item][item2].length > 0) {
                  error = true;
                }
              }
            );
            return (
              <>
                <div
                  className={`listVT-item ${
                    VTdetail.name === item ? "error" : ""
                  }`}
                  onClick={handleListVTClick}
                >
                  {error === true ? (
                    <CancelIcon
                      fontSize="small"
                      color="error"
                      style={{ float: "right" }}
                    />
                  ) : (
                    <CheckCircleIcon
                      fontSize="small"
                      color="success"
                      style={{ float: "right" }}
                    />
                  )}
                  <img
                    src={itemIcon}
                    alt="itemIcon"
                    style={{ width: "40px", height: "40px" }}
                  />
                  {item}
                </div>
              </>
            );
          })
        ) : (
          <>DATA UPDATING !</>
        )}
      </>
    );
  };

  return (
    <>
      <div className="line-seperate-items"></div>

      <div style={{ fontWeight: "bold", textAlign: "center" }}>
        {missionData &&
          missionData.powerline_id}{" "}
        {missionData &&
          missionData.powerline_name}
      </div>

      <div className="list-VT-container">
        {missionData && missionData.supervision_results && renderVT()}
      </div>
    </>
  );
};

export default FlightManageListVT;
