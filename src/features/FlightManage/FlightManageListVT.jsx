import React from "react";
import { useState, useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import itemIcon from "../../assets/images/logo.png";

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
  const VTdetail = useSelector(VTInfo);
  const urlhomePageView = process.env.REACT_APP_API_URL + "homepageapiview/";

  useEffect(() => {
    missionId &&
      axios
        .get(urlhomePageView)
        .then((res) => {
          // console.log(res)
          // console.log(res.data.data.find((el) => el.schedule_id == missionId));
          // console.log(missionId);
          setMissionData(
            res.data.data.find((id) => id.schedule_id === missionId)
          );
          console.log(res.data.data.find((id) => id.schedule_id === missionId));
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
            // console.log(Object.values(missionData.supervision_results));
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
                // console.log(missionData.supervision_results[item][item2]);

                if (missionData.supervision_results[item][item2].length > 0) {
                  error = true;
                }
              }
            );
            return (
              <>
                <div
                  className={`home-listVT-item ${
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
      <div className="home-listVT-container">
        {missionData && missionData.supervision_results && renderVT()}
      </div>
    </>
  );
};

export default FlightManageListVT;
