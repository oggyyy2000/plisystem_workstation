import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { resetHasShownLostConnectionToServerToast } from "../../utils/customAxios";

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
import HSandTSBoundaries from "../../components/HSandTSBoundaries/HSandTSBoundaries";

import markerIcon from "../../assets/images/powerpole_logo.png";

import { Box, Button, TextField, Autocomplete } from "@mui/material";

import Loading from "../../components/LoadingPage/LoadingPage";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import "./css/PowerlineRouteManage.css";

import * as PowerlineService from "../../APIServices/PowerlineService";
import * as ManageRouteService from "../../APIServices/ManageRouteService";

const PowerlineRouteManage = () => {
  const [openInfoContainer, setOpenInfoContainer] = useState(true);

  // map variable
  const [typeMap, setTypeMap] = useState("roadmap");
  const [buttonText, setButtonText] = useState("Bản đồ");
  const [center, setCenter] = useState({
    lat: 21.007556875711494,
    lng: 105.84322259736739,
  });
  const [zoom, setZoom] = useState(14);

  // select route variable
  const [routeName, setRouteName] = useState([]);
  const [routeID, setRouteID] = useState("");

  // route data
  const [manageRouteData, setManageRouteData] = useState({});
  const [electricPoleCoordinate, setElectricPoleCoordinate] = useState([]);
  const [electricLineCoordinate, setElectricLineCoordinate] = useState([]);
  const [defaultRouteName, setDefaultRouteName] = useState("");
  const [defaultRouteID, setDefaultRouteID] = useState("");

  // check variable
  const [deleteClicked, setDeleteClicked] = useState(false);
  const [updateClicked, setUpdateClicked] = useState(false);

  const location = useLocation();

  useEffect(() => {
    resetHasShownLostConnectionToServerToast();
  }, [location]);

  useEffect(() => {
    const getRouteNameOptions = async () => {
      const response = await PowerlineService.getAllData();
      if (response) {
        setRouteName(response);
      }
    };
    getRouteNameOptions();
  }, []);

  useEffect(() => {
    const getRouteInfo = async () => {
      const response = await ManageRouteService.getData({
        routeID: routeID,
      });
      if (response) {
        setManageRouteData(response);
        setDefaultRouteName(response.powerline_name_default);
        setDefaultRouteID(response.powerline_id_default);
      }
    };
    getRouteInfo();
  }, [routeID]);

  useEffect(() => {
    if (manageRouteData && manageRouteData.powerline_location_route) {
      const modifiedPoleLocation = [];
      manageRouteData.powerline_location_route.map((pole, index) => {
        const nextPole = manageRouteData.powerline_location_route[index + 1];
        if (nextPole === undefined) {
          return modifiedPoleLocation.push(
            {
              poleName: pole.point,
              poleLocation: pole.coordinates,
            },
            {
              poleName: pole.next_point,
              poleLocation: pole.next_coordinates,
            }
          );
        } else {
          return modifiedPoleLocation.push({
            poleName: pole.point,
            poleLocation: pole.coordinates,
          });
        }
      });
      setElectricPoleCoordinate(modifiedPoleLocation);

      const electricLineCoordinates = manageRouteData?.powerline_location_route
        .map((info) => {
          const [latitude, longtitude] = info.coordinates
            .split(",")
            .map((coord) => parseFloat(coord.trim()));
          const [prevLat, prevLng] = info.next_coordinates
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
              info.next_coordinates
            );
            return null;
          }
          return [
            [parseFloat(latitude), parseFloat(longtitude)],
            [parseFloat(prevLat), parseFloat(prevLng)],
          ];
        })
        .filter((coord) => coord !== null); // Loại bỏ các phần tử null;
      setElectricLineCoordinate(electricLineCoordinates);

      // If the coordinates array is not empty, set the map center and the center hasn't been set, set the map center
      if (
        electricLineCoordinates.length > 0 &&
        center.lat === 21.007556875711494 &&
        center.lng === 105.84322259736739
      ) {
        setCenter({
          lat: electricLineCoordinates[0].lat,
          lng: electricLineCoordinates[0].lng,
        });
      }
    }
  }, [manageRouteData, center]);

  const deleteRoute = async () => {
    const confirmed = window.confirm(
      "Việc xóa tuyến chỉ thực hiện khi có thông báo, việc tự ý xóa hoặc cập nhật tuyến có thể gây ảnh hưởng đến dữ liệu của hệ thống !"
    );

    if ((routeID || defaultRouteID) && confirmed) {
      setDeleteClicked(true);

      const response = await ManageRouteService.delData({
        defaultRouteID: defaultRouteID,
        routeID: routeID,
      });
      if (response) {
        setDeleteClicked(false);
        toast.success(response, {
          onClose: () => {
            window.location.reload();
          },
        });
      } else {
        setDeleteClicked(false);
      }
    }
  };

  const updateRoute = async () => {
    const confirmed = window.confirm(
      "Việc cập nhật tuyến chỉ thực hiện khi có thông báo, việc tự ý xóa hoặc cập nhật tuyến có thể gây ảnh hưởng đến dữ liệu của hệ thống !"
    );

    if ((routeID || defaultRouteID) && confirmed) {
      setUpdateClicked(true);

      const response = await ManageRouteService.updateData({
        defaultRouteID: defaultRouteID,
        routeID: routeID,
      });
      if (response) {
        setUpdateClicked(false);
        toast.success(response, {
          onClose: () => {
            window.location.reload();
          },
        });
      } else {
        setUpdateClicked(false);
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
            maxZoom={16}
            className="powerline-route-manage-map"
          >
            <TileLayer
              url={
                typeMap === "roadmap"
                  ? "file:///home/orin/OSM_offline_data/arcgis_roadmap_full_and_NorthVN_zoom_0_16/{z}_{y}_{x}.png"
                  : "file:///home/orin/OSM_offline_data/arcgis_satelite_full_and_NorthVN_zoom_0_16/{z}_{y}_{x}.png"
              }
            />
            <HSandTSBoundaries />
            {/* render GIS tat ca cac cot */}
            {electricPoleCoordinate.map((info, index) => {
              const [latitudeString, longitudeString] =
                info.poleLocation.split(",");
              const middleIndex = Math.round(electricPoleCoordinate.length / 2);
              const middlePoleCoordinates =
                electricPoleCoordinate[middleIndex].poleLocation.split(",");
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
                        <p>ID cột: {info.poleName}</p>

                        <p>
                          Tọa độ: {latitudeString} , {longitudeString}
                        </p>
                      </Box>
                    </Popup>
                    <Tooltip>
                      <Box className="map__tooltip">
                        <p>ID cột: {info.poleName}</p>

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
            {electricLineCoordinate !== undefined ? (
              <Polyline
                pathOptions={{ color: "red" }}
                positions={electricLineCoordinate}
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
      {updateClicked || deleteClicked ? <Loading /> : <></>}

      <div className="powerline-route-manage__container">
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
                disabled={routeID || defaultRouteID ? false : true}
                onClick={deleteRoute}
              >
                Xóa tuyến
              </Button>
              <Button
                className="powerline-route-manage__update-route-btn"
                variant="contained"
                color="info"
                disabled={routeID || defaultRouteID ? false : true}
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
