import React, { useEffect, useCallback } from "react";

import { Box } from "@mui/material";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";

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
  const [missionData, setMissionData] = useState({});
  console.log(missionData.powerline_coordinates);
  const [GISlist, setGISlist] = useState([]);
  const [nameError, setNameError] = useState();
  const [activeMarker, setActiveMarker] = useState(null);
  const VTdetail = useSelector(VTInfo);
  const missionId = useSelector(MissionId);

  const urlhomePageView = process.env.REACT_APP_API_URL + "homepageapiview/";
  // const urlLocations = process.env.REACT_APP_API_URL + "powerlinelocations";

  // console.log(VTdetail.data);

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

  const handleChangeMapType = () => {
    setButtonText((prevButtonText) =>
      prevButtonText === "Vệ tinh" ? "Bản đồ" : "Vệ tinh"
    );
    setTypeMap((prevTypeMap) =>
      prevTypeMap === "satellite" ? "roadmap" : "satellite"
    );
  };

  const handleActiveMarker = ({ marker, item }) => {
    const { latitude, longtitude } = item;
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
    setCenter({ lat: parseFloat(latitude), lng: parseFloat(longtitude) });
  };

  const renderMapwithAMarker = (GISlist, nameError) => {
    const customErrorIcon = new Icon({
      iconUrl: errorIcon,
      iconSize: [30, 30],
    });

    const customMarkerIcon = new Icon({
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
            zoom={13}
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
              // console.log("latitudeString: ", latitudeString, "longitudeString: ", longitudeString)
              return (
                <Marker
                  key={index}
                  position={{
                    lat: parseFloat(latitudeString),
                    lng: parseFloat(longitudeString),
                  }}
                  icon={customMarkerIcon}
                  onClick={() => {
                    handleActiveMarker({
                      index: index,
                      item: {
                        latitude: latitudeString,
                        longtitude: longitudeString,
                      },
                    });
                  }}
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
                    onClick={() => {
                      handleActiveMarker({
                        index: index,
                        item: { latitude: latitude, longtitude: longtitude },
                      });
                    }}
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
        renderMapwithAMarker(GISlist, nameError)}
    </>
  );
};

export default FlightManageMap;
