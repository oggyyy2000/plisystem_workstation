import React from "react";
import { useState, useEffect } from "react";

import axios from "axios";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";

import markerIcon from "../../assets/images/powerpole_logo.png";

import { Box, Button, TextField, Autocomplete } from "@mui/material";

import Loading from "../../components/LoadingPage/LoadingPage";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import "./css/PowerlineRouteManage.css";

const PowerlineRouteManage = () => {
  const [openInfoContainer, setOpenInfoContainer] = useState(true);
  // map variable
  const [typeMap, setTypeMap] = useState("roadmap");
  const [buttonText, setButtonText] = useState("Bản đồ");
  const [center, setCenter] = useState({
    lat: 21.007556875711494,
    lng: 105.84322259736739,
  });
  console.log(center);
  const [zoom, setZoom] = useState(14);

  // select route variable
  const [routeName, setRouteName] = useState([]);
  console.log("routeName: ", routeName);
  const [routeID, setRouteID] = useState("");

  // route data
  const [manageRouteData, setManageRouteData] = useState({});
  const [electricPoleCoordinate, setElectricPoleCoordinate] = useState([]);
  console.log("electricPoleCoordinate: ", electricPoleCoordinate);
  const [defaultRouteName, setDefaultRouteName] = useState("");
  const [defaultRouteID, setDefaultRouteID] = useState("");

  // check variable
  const [deleteClicked, setDeleteClicked] = useState(false);
  const [updateClicked, setUpdateClicked] = useState(false);

  useEffect(() => {
    const powerlines = process.env.REACT_APP_API_URL + "powerline/";

    axios
      .get(powerlines)
      .then((res) => {
        console.log("data:", res.data);
        setRouteName(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const routeAPI =
      process.env.REACT_APP_API_URL +
      "manageroute/" +
      (routeID ? "?powerline_id=" + routeID : "");

    axios
      .get(routeAPI)
      .then((res) => {
        console.log("data:", res.data);
        setManageRouteData(res.data);
        setDefaultRouteName(res.data.powerline_name_default);
        setDefaultRouteID(res.data.powerline_id_default);
      })
      .catch((err) => {
        err.response && console.log(err.response.data.error);
      });
  }, [routeID]);

  useEffect(() => {
    if (manageRouteData?.powerline_location_route) {
      const coordinates = manageRouteData?.powerline_location_route
        .map((info) => {
          const [latitude, longtitude] = info.coordinates
            .split(",")
            .map((coord) => parseFloat(coord.trim()));
          const [prevLat, prevLng] = info.prev_coordinates
            .split(",")
            .map((coord) => parseFloat(coord.trim()));

          if (
            isNaN(latitude) ||
            isNaN(longtitude) ||
            isNaN(prevLat) ||
            isNaN(prevLng)
          ) {
            console.error(
              "Invalid coordinates",
              info.coordinates,
              info.prev_coordinates
            );
            return null;
          }
          return [
            [parseFloat(latitude), parseFloat(longtitude)],
            [parseFloat(prevLat), parseFloat(prevLng)],
          ];
        })
        .filter((coord) => coord !== null); // Loại bỏ các phần tử null;
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
  }, [manageRouteData, center]);

  const deleteRoute = async () => {
    const routeAPI =
      process.env.REACT_APP_API_URL +
      "manageroute/" +
      (routeID
        ? "?powerline_id=" + routeID
        : "?powerline_id=" + defaultRouteID);
    const confirmed = window.confirm(
      "Việc xóa hoặc cập nhật tuyến chỉ thực hiện khi có thông báo, việc tự ý xóa hoặc cập nhật tuyến có thể gây ảnh hưởng đến dữ liệu của hệ thống !"
    );

    if ((routeID || defaultRouteID) && confirmed) {
      setDeleteClicked(true);
      try {
        const response = await axios.delete(routeAPI);
        setDeleteClicked(false);
        alert(response.data.message);
        window.location.reload();
      } catch (error) {
        setDeleteClicked(false);
        alert(error.response.data.error);
        window.location.reload();
      }
    }
  };

  const updateRoute = async () => {
    const routeAPI =
      process.env.REACT_APP_API_URL +
      "manageroute/" +
      (routeID
        ? "?powerline_id=" + routeID
        : "?powerline_id=" + defaultRouteID);
    const confirmed = window.confirm(
      "Việc xóa hoặc cập nhật tuyến chỉ thực hiện khi có thông báo, việc tự ý xóa hoặc cập nhật tuyến có thể gây ảnh hưởng đến dữ liệu của hệ thống !"
    );

    if ((routeID || defaultRouteID) && confirmed) {
      setUpdateClicked(true);
      try {
        const response = await axios.put(routeAPI);
        setUpdateClicked(false);
        alert(response.data.message);
        window.location.reload();
      } catch (error) {
        setUpdateClicked(false);
        alert(error.response.data.error);
        window.location.reload();
      }
    }
  };

  const handleChangeMapType = () => {
    setButtonText((prevButtonText) =>
      prevButtonText === "Vệ tinh" ? "Bản đồ" : "Vệ tinh"
    );
    setTypeMap((prevTypeMap) =>
      prevTypeMap === "satellite" ? "roadmap" : "satellite"
    );
  };

  const SetCenterMapOnClick = ({ coords }) => {
    setZoom(14);
    const map = useMap();
    map.setView(coords, zoom);

    return null;
  };

  const mapWithMarkers = () => {
    const customMarkerIcon = new L.Icon({
      iconUrl: markerIcon,
      iconSize: [50, 50],
    });
    return (
      <>
        <div
          className={` ${
            openInfoContainer
              ? "powerline-route-manage-map__container-open-info-container"
              : "powerline-route-manage-map__container-close-info-container"
          }`}
        >
          <button
            className="powerline-route-manage__btn-change-maptype"
            value={"Vệ tinh"}
            onClick={handleChangeMapType}
          >
            {buttonText}
          </button>

          <MapContainer
            center={center}
            zoomControl={false}
            zoom={zoom}
            className={`powerline-route-manage-map ${
              !openInfoContainer
                ? "powerline-route-manage-map--close-info-container"
                : ""
            }`}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url={
                typeMap === "roadmap"
                  ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              }
            />
            {/* render GIS tat ca cac cot */}
            {manageRouteData?.powerline_location_route?.map((info, index) => {
              const [latitudeString, longitudeString] =
                info.coordinates.split(",");
              const middleIndex = Math.round(
                manageRouteData?.powerline_location_route?.length / 2
              );
              const middlePoleCoordinates =
                manageRouteData?.powerline_location_route[
                  middleIndex
                ].coordinates.split(",");
              return (
                <>
                  <Marker
                    key={index}
                    eventHandlers={{
                      mouseover: (event) => event.target.openTooltip(),
                      click: (event) => event.target.openPopup(),
                    }}
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
                      <Box className="map__popup">
                        <p>ID cột: {info.location_id}</p>
                        <p>Tên cột: {info.location_name}</p>
                        <p>
                          Tọa độ: {latitudeString} , {longitudeString}
                        </p>
                      </Box>
                    </Popup>
                    <Tooltip>
                      <Box className="map__tooltip">
                        <p>ID cột: {info.location_id}</p>
                        <p>Tên cột: {info.location_name}</p>
                        <p>
                          Tọa độ: {latitudeString} , {longitudeString}
                        </p>
                      </Box>
                    </Tooltip>
                  </Marker>

                  <SetCenterMapOnClick coords={middlePoleCoordinates} />
                </>
              );
            })}

            {/* duong noi giua cac cot */}
            {electricPoleCoordinate !== undefined ? (
              <Polyline
                pathOptions={{ color: "red" }}
                positions={electricPoleCoordinate}
              />
            ) : (
              <></>
            )}
          </MapContainer>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="powerline-route-manage__container">
        {updateClicked || deleteClicked ? <Loading /> : <></>}
        <div
          className={`powerline-route-manage__info-container ${
            openInfoContainer
              ? "powerline-route-manage__info-container--open"
              : "powerline-route-manage__info-container--close"
          }`}
        >
          <div className="powerline-route-manage__all-route-info-container">
            <span>Tổng số tuyến: {manageRouteData.total_powerlines}</span>
            <span>Tổng số cột: {manageRouteData.total_location}</span>
          </div>

          <div className="powerline-route-manage__specific-route-info-container">
            <div className="powerline-route-manage__select-route">
              {defaultRouteName !== "" && (
                <Autocomplete
                  options={routeName}
                  defaultValue={{
                    powerline_id: defaultRouteID,
                    powerline_name: defaultRouteName,
                  }}
                  getOptionLabel={(option) =>
                    option.powerline_id + " -- " + option.powerline_name
                  }
                  onChange={(event, newValue) => {
                    newValue != null
                      ? setRouteID(newValue.powerline_id)
                      : setRouteID("");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      defaultValue="ĐZ 171 E1.1 Đông Anh - 172 E1.24 Hải Bối"
                      label="Tên Tuyến"
                    />
                  )}
                  sx={{ width: "80%" }}
                />
              )}
            </div>

            <div className="powerline-route-manage__specific-route-info">
              <span>
                Tổng số cột trong tuyến: {manageRouteData.total_location_route}
              </span>
              <span>Độ dài tuyến: {manageRouteData.distance_route}km</span>
            </div>

            <div className="powerline-route-manage__btn-container">
              <Button
                className="powerline-route-manage__delete-route-btn"
                variant="contained"
                color="error"
                onClick={deleteRoute}
              >
                Xóa tuyến
              </Button>
              <Button
                className="powerline-route-manage__update-route-btn"
                variant="contained"
                color="info"
                onClick={updateRoute}
              >
                Cập nhật tuyến
              </Button>
            </div>
          </div>
        </div>

        <div className="powerline-route-manage__open-info-container-btn">
          <button onClick={() => setOpenInfoContainer(!openInfoContainer)}>
            {openInfoContainer ? (
              <KeyboardArrowUpIcon fontSize="small" />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </button>
        </div>

        {mapWithMarkers()}
      </div>
    </>
  );
};

export default PowerlineRouteManage;
