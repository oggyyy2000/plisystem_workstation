import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import * as actions from "../../redux/types";

import "./css/FlightManageListMission.css";

import FlightRoundedIcon from "@mui/icons-material/FlightRounded";
import ModalMissionData from "./FlightManageModal/FlightManageModalMissionData";

const FlightManageListMission = () => {
  const [clicked, setClicked] = useState("");
  const [listMissionData, setListMissionData] = useState([]);
  const dispatch = useDispatch();

  const urlhomePageView = process.env.REACT_APP_API_URL + "homepageapiview/";

  const handleListMissionClick = useCallback(
    (mission_id) => {
      // setClicked(mission_id);
      dispatch({ type: actions.MissionId, data: mission_id });
    },
    [dispatch]
  );

  useEffect(() => {
    axios
      .get(urlhomePageView)
      .then((res) => {
        console.log(res.data.data[0].schedule_id);
        setListMissionData(res.data.data);
        setClicked(res.data.data[0].schedule_id);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [urlhomePageView]);

  return (
    <>
      {listMissionData.map((listmission) => {
        return (
          <>
            <div
              className={`mission-card__container ${
                clicked === listmission.schedule_id
                  ? "mission-card__container--choosed"
                  : "mission-card__container--unchoosed"
              }`}
              onClick={() => handleListMissionClick(listmission.schedule_id)}
            >
              <div className="mission-card__header">
                <div className="mission-card__icon">
                  <FlightRoundedIcon fontSize="large" />
                </div>
                <div className="mission-card__title">
                  {listmission.implementation_date}
                </div>
              </div>
              <div className="mission-card__body">
                <ModalMissionData
                  schedule_id={listmission.schedule_id}
                  implementation_date={listmission.implementation_date}
                />
              </div>
            </div>
          </>
        );
      })}
    </>
  );
};

export default FlightManageListMission;
