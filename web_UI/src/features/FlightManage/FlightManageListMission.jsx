import React, { useCallback, useEffect, useState } from "react";

import * as HomePageApiService from "../../APIServices/HomePageAPIService";

import { useDispatch } from "react-redux";
import * as actions from "../../redux/types";

import "./css/FlightManageListMission.css";

import FlightRoundedIcon from "@mui/icons-material/FlightRounded";
import ModalMissionData from "./FlightManageModal/FlightManageModalMissionData";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { useLocation } from "react-router-dom";
import { resetHasShownLostConnectionToServerToast } from "../../utils/customAxios";

const FlightManageListMission = () => {
  const [clickedMissionContainer, setClickedMissionContainer] = useState("");
  const [clicked, setClicked] = useState("");
  const [listMissionData, setListMissionData] = useState([]);
  const dispatch = useDispatch();
  const location = useLocation();

  const organizedData = listMissionData.reduce((acc, item) => {
    const date = item.implementation_date;

    if (!acc[date]) {
      acc[date] = [];
    }

    acc[date].push(item);

    return acc;
  }, {});
  console.log("organizedData: ", organizedData);

  const [hadImportNewData, setHadImportNewData] = useState(false);

  const handleListMissionClick = useCallback(
    (mission_id) => {
      console.log(mission_id);
      setClicked(mission_id);
      dispatch({ type: actions.MissionId, data: mission_id });
    },
    [dispatch]
  );

  useEffect(() => {
    resetHasShownLostConnectionToServerToast();
  }, [location]);

  useEffect(() => {
    const getListMission = async () => {
      const response = await HomePageApiService.getData();
      if (response) {
        setClickedMissionContainer(response[0].implementation_date);
        setListMissionData(response);
        handleListMissionClick(response[0].schedule_id);
      }
    };
    getListMission();
  }, [handleListMissionClick]);

  useEffect(() => {
    if (hadImportNewData) {
      window.location.reload();
    }
  }, [hadImportNewData]);

  return (
    <>
      {Object.keys(organizedData).map((date) => (
        <>
          <div
            key={date}
            className={`mission-card__container ${
              clickedMissionContainer === date
                ? "mission-card__container--choosed"
                : "mission-card__container--unchoosed"
            }`}
          >
            <div
              className="mission-card__header"
              onClick={() =>
                setClickedMissionContainer(
                  date === clickedMissionContainer ? null : date
                )
              }
            >
              <div
                className={`mission-card__icon-plane ${organizedData[date].map(
                  (powerline) =>
                    powerline.supervision_status === "done"
                      ? "mission-card__icon-plane-done"
                      : ""
                )}`}
              >
                <FlightRoundedIcon fontSize="large" sx={{ color: "white" }} />
              </div>
              <div className="mission-card__title">{date}</div>
              <div className="mission-card__icon-drop">
                {clickedMissionContainer === date ? (
                  <ArrowDropDownIcon />
                ) : (
                  <ArrowDropUpIcon />
                )}
              </div>
            </div>
            {organizedData[date].map((powerline) =>
              powerline.powerline_id_id &&
              powerline.powerline_name &&
              clickedMissionContainer === date ? (
                <div
                  className={`mission-card__body ${
                    clicked === powerline.schedule_id
                      ? "mission-card__body--choosed"
                      : "mission-card__body--unchoosed"
                  }`}
                  onClick={() => handleListMissionClick(powerline.schedule_id)}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    &sdot; {powerline.powerline_id_id} --{" "}
                    {powerline.powerline_name} <br />
                  </span>

                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    {`(${powerline.typeName})`}
                    {powerline.supervision_status === "done" ? (
                      <CheckCircleIcon
                        color="success"
                        fontSize="small"
                        style={{ marginLeft: "5px" }}
                      />
                    ) : (
                      <></>
                    )}
                  </span>
                  <ModalMissionData
                    powerline_id={powerline.powerline_id_id}
                    powerline_name={powerline.powerline_name}
                    schedule_id={powerline.schedule_id}
                    implementation_date={powerline.implementation_date}
                    docNo={powerline.docNo}
                    type_ticket={powerline.type}
                    typeName={powerline.typeName}
                    supervision_status={powerline.supervision_status}
                    setHadImportNewData={setHadImportNewData}
                  />
                </div>
              ) : (
                <></>
              )
            )}
          </div>
        </>
      ))}
    </>
  );
};

export default FlightManageListMission;
