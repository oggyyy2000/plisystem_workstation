import React from "react";
import { useState, useEffect } from "react";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import itemIcon from "../../assets/images/powerpole_logo.png";

import * as HomePageAPIService from "../../APIServices/HomePageAPIService";

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

  useEffect(() => {
    if (missionId) {
      const getChoseMissionData = async () => {
        const response = await HomePageAPIService.getData();
        if (response) {
          setMissionData(
            response.find((id) => id.schedule_id === missionId)
          );
        }
      };
      getChoseMissionData();
    }
  }, [missionId]);

  useEffect(() => {
    if (missionData && missionData.supervision_results) {
      const listSupervisedPole = Object.keys(missionData.supervision_results);
      dispatch({
        type: actions.VTInfo,
        data: {
          name: listSupervisedPole[0],
          data: missionData.supervision_results[listSupervisedPole[0]],
        },
      });
    }
  }, [missionData, dispatch]);

  const handleListVTClick = ({ name, data }) => {
    dispatch({
      type: actions.VTInfo,
      data: {
        name: name,
        data: data,
      },
    });
  };

  const renderVT = () => {
    return (
      <>
        {typeof missionData.supervision_results !== "string" ? (
          Object.keys(missionData.supervision_results).map((item) => {
            let error = false;
            Object.keys(missionData.supervision_results[item]).forEach(
              (item2) => {
                console.log("item2", item2);
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
                  onClick={() =>
                    handleListVTClick({
                      name: item,
                      data: missionData.supervision_results[item],
                    })
                  }
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

      <div className="list-VT-title">
        {missionData && missionData.powerline_id}{" "}
        {missionData && missionData.powerline_name}
      </div>

      <div className="list-VT-container">
        {missionData && missionData.supervision_results && renderVT()}
      </div>
    </>
  );
};

export default FlightManageListVT;
