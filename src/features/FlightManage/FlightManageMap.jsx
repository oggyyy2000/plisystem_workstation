import React, { useEffect, useCallback } from "react";

import { Box } from "@mui/material";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";

import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { VTInfo, MissionId } from "../../redux/selectors";

import errorIcon from "../../assets/images/error-icon.png";
import markerIcon from "../../assets/images/logo.png";
import "./css/FlightManageMap.css";

const FlightManageMap = () => {
  const [typeMap, setTypeMap] = useState("roadmap");
  const [buttonText, setButtonText] = useState("Bản đồ");
  const [center, setCenter] = useState({
    lat: 21.007556875711494,
    lng: 105.84322259736739,
  });
  console.log(center);

  const [electricPoleCoordinate, setElectricPoleCoordinate] = useState([]);
  const [missionData, setMissionData] = useState({});
  console.log(missionData);
  const [GISlist, setGISlist] = useState([]);
  const [nameError, setNameError] = useState();
  const VTdetail = useSelector(VTInfo);
  const missionId = useSelector(MissionId);

  const urlhomePageView = process.env.REACT_APP_API_URL + "homepageapiview/";

  const getGIS = useCallback(() => {
    const listGIS = [];
    const errorName = [];

    for (var key in VTdetail.data) {
      if (typeof VTdetail.data[key] !== "string") {
        VTdetail.data[key].forEach((item) => {
          console.log(item);
          listGIS.push(item.defect_gis);
          errorName.push(item.defect_name);
        });
      }
    }

    setGISlist(listGIS);
    setNameError(errorName);
  }, [VTdetail.data]);

  useEffect(() => {
    getGIS();
  }, [getGIS]);

  useEffect(() => {
    missionId &&
      axios
        .get(urlhomePageView)
        .then((res) => {
          setMissionData(
            res.data.data.find((id) => id.schedule_id === missionId)
          );
        })
        .catch((err) => {
          console.log(err);
        });
  }, [missionId, urlhomePageView]);

  useEffect(() => {
    if (missionData?.powerline_coordinates) {
      const coordinates = missionData.powerline_coordinates.map(
        (coordinate) => {
          const [latitude, longitude] = coordinate.split(",");
          return {
            lat: parseFloat(latitude),
            lng: parseFloat(longitude),
          };
        }
      );
      setElectricPoleCoordinate(coordinates);

      // If the coordinates array is not empty, set the map center and the center hasn't been set, set the map center
      if (
        coordinates.length > 0 &&
        center.lat === 21.007556875711494 &&
        center.lng === 105.84322259736739
      ) {
        setCenter({
          lat: coordinates[0].lat,
          lng: coordinates[0].lng,
        });
      }
    }
  }, [missionData, center]);

  const handleChangeMapType = () => {
    setButtonText((prevButtonText) =>
      prevButtonText === "Vệ tinh" ? "Bản đồ" : "Vệ tinh"
    );
    setTypeMap((prevTypeMap) =>
      prevTypeMap === "satellite" ? "roadmap" : "satellite"
    );
  };

  const SetCenterMapOnClick = ({ coords }) => {
    const map = useMap();
    map.setView(coords, map.getZoom());

    return null;
  };

  const renderMapwithAMarker = (GISlist, nameError, center) => {
    const customErrorIcon = new L.Icon({
      iconUrl: errorIcon,
      iconSize: [30, 30],
    });

    const customMarkerIcon = new L.Icon({
      iconUrl: markerIcon,
      iconSize: [50, 50],
    });
    return (
      <>
        <button
          className={`flightmanage-map__btn-change-maptype`}
          value={"Vệ tinh"}
          onClick={handleChangeMapType}
        >
          {buttonText}
        </button>

        <div className="flightmanage-map__title">
          Tuyến {missionData.powerline_id} {missionData.powerline_name}
        </div>

        <div>
          <MapContainer
            center={center}
            zoomControl={false}
            zoom={16}
            className="flightmanage-map"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url={
                typeMap === "roadmap"
                  ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              }
            />
            {missionData?.powerline_coordinates?.map((coordinate, index) => {
              const [latitudeString, longitudeString] = coordinate.split(",");
              return (
                <>
                  <Marker
                    key={index}
                    position={{
                      lat: parseFloat(latitudeString),
                      lng: parseFloat(longitudeString),
                    }}
                    icon={customMarkerIcon}
                  >
                    <Popup
                      position={{
                        lat: parseFloat(latitudeString),
                        lng: parseFloat(longitudeString),
                      }}
                    >
                      <Box className="flightmanage-map__popup">
                        <p>
                          Tọa độ: {latitudeString} , {longitudeString}
                        </p>
                      </Box>
                    </Popup>
                  </Marker>
                </>
              );
            })}
            {GISlist.map((item, index) => {
              var latitude = parseFloat(item.latitude);
              var longtitude = parseFloat(item.longtitude);
              return (
                <>
                  <Marker
                    key={index}
                    position={{ lat: latitude, lng: longtitude }}
                    icon={customErrorIcon}
                  >
                    <Popup position={{ lat: latitude, lng: longtitude }}>
                      <Box className="flightmanage-map__popup">
                        <p>Tên lỗi: {nameError}</p>
                        <p>
                          Tọa độ: {latitude} , {longtitude}
                        </p>
                      </Box>
                    </Popup>
                  </Marker>
                </>
              );
            })}
            {electricPoleCoordinate !== undefined ? (
              <Polyline
                pathOptions={{ color: "red" }}
                positions={electricPoleCoordinate}
              />
            ) : (
              <></>
            )}
            {missionData?.powerline_coordinates?.map((coordinate, index) => {
              const [latitudeString, longitudeString] = coordinate.split(",");
              return (
                <>
                  <SetCenterMapOnClick coords={[latitudeString, longitudeString]}/>
                </>
              )
            })}
          </MapContainer>
        </div>
      </>
    );
  };

  return (
    <>
      {JSON.stringify(VTdetail) !== "{}" &&
        GISlist !== "[]" &&
        nameError !== "[]" &&
        renderMapwithAMarker(GISlist, nameError, center)}
    </>
  );
};

export default FlightManageMap;
