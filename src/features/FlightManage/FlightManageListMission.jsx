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
      setClicked(mission_id);
      dispatch({ type: actions.MissionId, data: mission_id });
    },
    [dispatch]
  );

  // const organizedData = listMissionData.reduce((acc, item) => {
  //   const date = item.implementation_date;

  //   if (!acc[date]) {
  //     acc[date] = [];
  //   }

  //   acc[date].push(item);

  //   console.log(acc);

  //   return acc;
  // }, {});

  useEffect(() => {
    axios
      .get(urlhomePageView)
      .then((res) => {
        console.log(res.data.data[0].schedule_id);
        setListMissionData(res.data.data);
        handleListMissionClick(res.data.data[0].schedule_id);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [handleListMissionClick, urlhomePageView]);

  return (
    <>
      {listMissionData.map((listmission) => {
        console.log(listmission);
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
                {listmission.powerline_id &&
                listmission.powerline_name &&
                clicked === listmission.schedule_id ? (
                  <ModalMissionData
                    schedule_id={listmission.schedule_id}
                    powerline_id={listmission.powerline_id}
                    powerline_name={listmission.powerline_name}
                  />
                ) : (
                  <></>
                )}
              </div>
            </div>
          </>
        );
      })}

      {/* <div>
        {Object.keys(organizedData).map((date) => (
          <div key={date}>
            <h2>{date}</h2>
            <div>
              {organizedData[date].map((powerline) => (
                <button key={powerline.powerline_id}>
                  {powerline.powerline_name} - {powerline.powerline_id}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div> */}

      {/* <div>
        {Object.keys(organizedData).map((date) => (
          <div
            key={date}
            className={`mission-card__container ${
              clicked === organizedData[date].schedule_id
                ? "mission-card__container--choosed"
                : "mission-card__container--unchoosed"
            }`}
            onClick={() =>
              handleListMissionClick(organizedData[date].schedule_id)
            }
          >
            <div className="mission-card__header">
              <div className="mission-card__icon">
                <FlightRoundedIcon fontSize="large" />
              </div>
              <div className="mission-card__title">{date}</div>
            </div>
            <div className="mission-card__body">
              {organizedData[date].map((powerline) =>
                // <button key={powerline.powerline_id}>
                //   {powerline.powerline_name} - {powerline.powerline_id}
                // </button>
                powerline.powerline_id &&
                powerline.powerline_name &&
                clicked === organizedData[date].schedule_id ? (
                  <ModalMissionData
                    schedule_id={powerline.schedule_id}
                    powerline_id={powerline.powerline_id}
                    powerline_name={powerline.powerline_name}
                  />
                ) : (
                  <></>
                )
              )}
            </div>
          </div>
        ))}
      </div> */}
    </>
  );
};

export default FlightManageListMission;
