import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { VTInfo, MissionId } from "../../redux/selectors";

import * as HomePageAPIService from "../../APIServices/HomePageAPIService";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import HSandTSBoundaries from "../../components/HSandTSBoundaries/HSandTSBoundaries";

import { Box } from "@mui/material";

import errorIcon from "../../assets/images/error-icon.png";
import markerIcon from "../../assets/images/powerpole_logo.png";
import "./css/FlightManageMap.css";

const FlightManageMap = () => {
  const [typeMap, setTypeMap] = useState("roadmap");
  const [buttonText, setButtonText] = useState("Bản đồ");
  const [center, setCenter] = useState({
    lat: 21.007556875711494,
    lng: 105.84322259736739,
  });
  const [zoom, setZoom] = useState(16);

  const [electricPoleCoordinate, setElectricPoleCoordinate] = useState([]);
  const [electricLineCoordinate, setElectricLineCoordinate] = useState([]);

  const [missionData, setMissionData] = useState({});
  const [GISlist, setGISlist] = useState([]);
  const VTdetail = useSelector(VTInfo);
  const missionId = useSelector(MissionId);

  useEffect(() => {
    const getListGIS = () => {
      const listGIS = [];
      for (var key in VTdetail.data) {
        if (typeof VTdetail.data[key] !== "string") {
          VTdetail.data[key].forEach((item) => {
            const [latitude, longtitude] = item.image_gis.split("_");
            const errorName = item.image_title;

            const location = {
              latitude: latitude,
              longtitude: longtitude,
              errorname: errorName,
            };
            listGIS.push(location);
          });
        }
      }
      setGISlist(listGIS);
    };
    getListGIS();
  }, [VTdetail.data]);

  useEffect(() => {
    const getChoseMissionData = async () => {
      const response = await HomePageAPIService.getData();
      if (response) {
        setMissionData(response.find((id) => id.schedule_id === missionId));
      }
    };
    if (missionId) getChoseMissionData();
  }, [missionId]);

  useEffect(() => {
    if (missionData && missionData.powerline_coordinates) {
      const modifiedPoleLocation = [];
      missionData.powerline_coordinates.map((pole, index) => {
        const nextPole = missionData.powerline_coordinates[index + 1];
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

      const electricLineCoordinates = missionData?.powerline_coordinates
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
    setZoom(17);
    const map = useMap();
    map.setView(coords, zoom);

    return null;
  };

  const renderMapwithAMarker = (GISlist, center) => {
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
          className="flightmanage-map__btn-change-maptype"
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
            zoom={zoom}
            maxZoom={16}
            className="flightmanage-map"
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
                    <Tooltip
                      position={{
                        lat: parseFloat(latitudeString),
                        lng: parseFloat(longitudeString),
                      }}
                    >
                      <Box className="map__tooltip">
                        <p>ID cột: {info.poleName}</p>
                        <p>
                          Tọa độ: {latitudeString} , {longitudeString}
                        </p>
                      </Box>
                    </Tooltip>
                  </Marker>
                </>
              );
            })}

            {/* hien thi cac cot bi loi */}
            {JSON.stringify(VTdetail) !== "{}" ? (
              GISlist.map((item, index) => {
                console.log(item);
                var latitude = parseFloat(item.latitude);
                var longtitude = parseFloat(item.longtitude);
                return (
                  <>
                    <Marker
                      key={index}
                      eventHandlers={{
                        mouseover: (event) => event.target.openTooltip(),
                        click: (event) => event.target.openPopup(),
                      }}
                      position={{ lat: latitude, lng: longtitude }}
                      icon={customErrorIcon}
                    >
                      <Popup position={{ lat: latitude, lng: longtitude }}>
                        <Box className="map__popup">
                          <p>Tên lỗi: {item.errorname}</p>
                          <p>
                            Tọa độ: {latitude} , {longtitude}
                          </p>
                        </Box>
                      </Popup>
                      <Tooltip>
                        <Box className="map__tooltip">
                          <p>Tên lỗi: {item.errorname}</p>
                          <p>
                            Tọa độ: {latitude} , {longtitude}
                          </p>
                        </Box>
                      </Tooltip>
                    </Marker>

                    <SetCenterMapOnClick coords={[latitude, longtitude]} />
                  </>
                );
              })
            ) : (
              <></>
            )}
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

  return <>{GISlist !== "[]" && renderMapwithAMarker(GISlist, center)}</>;
};

export default FlightManageMap;
