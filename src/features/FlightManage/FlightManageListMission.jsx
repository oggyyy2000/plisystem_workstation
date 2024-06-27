import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import * as actions from "../../redux/types";

import "./css/FlightManageListMission.css";

import FlightRoundedIcon from "@mui/icons-material/FlightRounded";
import ModalMissionData from "./FlightManageModal/FlightManageModalMissionData";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const FlightManageListMission = () => {
  const [clickedMissionContainer, setClickedMissionContainer] = useState("");
  const [clicked, setClicked] = useState("");
  console.log(clicked);
  const [listMissionData, setListMissionData] = useState([]);
  console.log(listMissionData);
  const dispatch = useDispatch();

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

  const urlhomePageView = process.env.REACT_APP_API_URL + "homepageapiview/";

  const handleListMissionClick = useCallback(
    (mission_id) => {
      console.log(mission_id);
      setClicked(mission_id);
      dispatch({ type: actions.MissionId, data: mission_id });
    },
    [dispatch]
  );

  useEffect(() => {
    axios
      .get(urlhomePageView)
      .then((res) => {
        console.log(res.data[0].schedule_id);
        setClickedMissionContainer(res.data[0].implementation_date);
        setListMissionData(res.data);
        handleListMissionClick(res.data[0].schedule_id);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [handleListMissionClick, urlhomePageView]);

  useEffect(() => {
    if (hadImportNewData) {
      window.location.reload();
    }
  }, [hadImportNewData]);

  return (
    <>
      <div>
        {Object.keys(organizedData).map((date) => (
          <>
            <div
              key={date}
              className={`mission-card__container ${
                clickedMissionContainer === date
                  ? "mission-card__container--choosed"
                  : "mission-card__container--unchoosed"
              }`}
              onClick={() =>
                setClickedMissionContainer(
                  date === clickedMissionContainer ? null : date
                )
              }
            >
              <div className="mission-card__header">
                <div
                  className={`mission-card__icon-plane ${organizedData[
                    date
                  ].map((powerline) =>
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

                  <span >
                    {powerline.type === "D" ? "(ngày)" : "(đêm)"}
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
                    supervision_status={powerline.supervision_status}
                    hadImportNewData={hadImportNewData}
                    setHadImportNewData={setHadImportNewData}
                  />
                </div>
              ) : (
                <></>
              )
            )}
          </>
        ))}
      </div>
    </>
  );
};

export default FlightManageListMission;
