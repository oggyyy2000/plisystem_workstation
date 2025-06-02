import React, { useEffect, useState } from "react";
import * as PowerlineLocationService from "../../APIServices/PowerlineLocationService";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
  Popup,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import HSandTSBoundaries from "../../components/HSandTSBoundaries/HSandTSBoundaries";

import { Box } from "@mui/material";

import DroneIcon from "../../assets/images/drone2.png";
import ErrorIcon from "../../assets/images/error-icon.png";
import markerIcon from "../../assets/images/powerpole_logo.png";
import blueDot from "../../assets/images/blue_dot.png";

import "./css/MainFlightMap.css";

const MainFlightMap = ({
  centerGPS,
  zoom,
  currentLocation,
  defectInfo,
  streetLine,
  powerlineId,
  startFly,
}) => {
  //map variable
  const [typeMap, setTypeMap] = useState("roadmap");
  const [buttonText, setButtonText] = useState("Bản đồ");
  const [poleCoordinates, setPoleCoordinates] = useState([]);
  const [polyline, setPolyline] = useState([]);

  useEffect(() => {
    const getCoordinates = async () => {
      const response = await PowerlineLocationService.getData(powerlineId);
      const modifiedPoleLocation = [];
      if (response) {
        response.map((pole, index) => {
          const nextPole = response[index + 1];
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
        setPoleCoordinates(modifiedPoleLocation);

        const coordinatesPolyline = response
          .map((data) => {
            const [latitude, longtitude] = data.coordinates
              .split(",")
              .map((coord) => parseFloat(coord.trim()));
            const [prevLat, prevLng] = data.next_coordinates
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
                data.coordinates,
                data.next_coordinates
              );
              return null;
            }
            return [
              [parseFloat(latitude), parseFloat(longtitude)],
              [parseFloat(prevLat), parseFloat(prevLng)],
            ];
          })
          .filter((coord) => coord !== null); // Loại bỏ các phần tử null;
        setPolyline(coordinatesPolyline);
      }
    };
    if (powerlineId !== "" && startFly === true) getCoordinates();
  }, [powerlineId, startFly]);

  useEffect(() => {
    if (!startFly) {
      setPoleCoordinates({});
      setPolyline([]);
    }
  }, [startFly]);

  // ------------- Function Handle Map ---------------

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

  const renderMarkerPole = () => {
    const customMarkerIcon = new L.Icon({
      iconUrl: markerIcon,
      iconSize: [40, 40],
    });

    return (
      <>
        {poleCoordinates.length > 0 &&
          poleCoordinates.map((pole, index) => {
            const [latitudeString, longitudeString] =
              pole.poleLocation.split(",");
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
                      <p>ID cột: {pole.poleName}</p>
                      <p>
                        Tọa độ: {latitudeString} , {longitudeString}
                      </p>
                    </Box>
                  </Popup>
                  <Tooltip>
                    <Box className="map__tooltip">
                      <p>ID cột: {pole.poleName}</p>
                      <p>
                        Tọa độ: {latitudeString} , {longitudeString}
                      </p>
                    </Box>
                  </Tooltip>
                </Marker>

                {polyline !== undefined ? (
                  <Polyline
                    pathOptions={{ color: "red" }}
                    positions={polyline}
                  />
                ) : (
                  <></>
                )}
              </>
            );
          })}
      </>
    );
  };

  const renderMarkerError = (defectInfo) => {
    const customIcon = new L.Icon({
      iconUrl: ErrorIcon,
      iconSize: [27, 27],
    });

    if (defectInfo.length > 0) {
      return (
        <>
          {defectInfo.map((gis1, index) => {
            return (
              <>
                <Marker
                  key={index}
                  position={{
                    lat: parseFloat(gis1.defect_gis.latitude),
                    lng: parseFloat(gis1.defect_gis.longtitude),
                  }}
                  eventHandlers={{
                    mouseover: (event) => event.target.openTooltip(),
                    click: (event) => event.target.openPopup(),
                  }}
                  icon={customIcon}
                  animation={1}
                >
                  <Popup
                    position={{
                      lat: parseFloat(gis1.defect_gis.latitude),
                      lng: parseFloat(gis1.defect_gis.longtitude),
                    }}
                  >
                    <Box className="map__popup">
                      <p>Tên lỗi: {gis1.defect_name}</p>
                      <p>
                        Tọa độ: {parseFloat(gis1.defect_gis.latitude)} ,{" "}
                        {parseFloat(gis1.defect_gis.longtitude)}
                      </p>
                    </Box>
                  </Popup>
                  <Tooltip>
                    <Box className="map__tooltip">
                      <p>Tên lỗi: {gis1.defect_name}</p>
                      <p>
                        Tọa độ: {parseFloat(gis1.defect_gis.latitude)} ,{" "}
                        {parseFloat(gis1.defect_gis.longtitude)}
                      </p>
                    </Box>
                  </Tooltip>
                </Marker>
              </>
            );
          })}
        </>
      );
    }
  };

  const renderPolyline = () => {
    const customIcon = new L.Icon({
      iconUrl: blueDot,
      iconSize: [5, 5],
    });
    if (streetLine.length > 0) {
      return (
        <>
          {streetLine.map((gis1, index) => {
            return (
              <>
                <Marker
                  key={index}
                  position={gis1}
                  icon={customIcon}
                  animation={1}
                ></Marker>
              </>
            );
          })}
        </>
      );
    }
  };

  const renderMapWithMarker = () => {
    const customIcon = new L.Icon({
      iconUrl: DroneIcon,
      iconSize: [30, 30],
    });

    return (
      <>
        <div>
          <MapContainer
            center={[centerGPS.lat, centerGPS.lng]}
            zoomControl={false}
            zoom={zoom}
            maxZoom={16}
            className="mainflight-map"
          >
            <TileLayer
              url={
                typeMap === "roadmap"
                  ? "file:///home/orin/OSM_offline_data/arcgis_roadmap_full_and_NorthVN_zoom_0_16/{z}_{y}_{x}.png"
                  : "file:///home/orin/OSM_offline_data/arcgis_satelite_full_and_NorthVN_zoom_0_16/{z}_{y}_{x}.png"
              }
            />
            <HSandTSBoundaries />
            {/* render tat ca cot */}
            {renderMarkerPole()}

            {/* render marker may bay bay theo lo trinh */}
            {currentLocation.latitude && currentLocation.longtitude !== "" ? (
              <Marker
                key={1}
                position={{
                  lat: parseFloat(currentLocation.latitude),
                  lng: parseFloat(currentLocation.longtitude),
                }}
                icon={customIcon}
              ></Marker>
            ) : (
              <></>
            )}

            {/* render loi */}
            {renderMarkerError(defectInfo)}

            {/* set center map theo may bay */}
            {currentLocation.latitude && currentLocation.longtitude !== "" ? (
              <SetCenterMapOnClick
                coords={[currentLocation.latitude, currentLocation.longtitude]}
              />
            ) : (
              <></>
            )}

            {/* render duong di may bay  */}
            {streetLine && streetLine.length > 0 && renderPolyline()}
          </MapContainer>
        </div>
      </>
    );
  };

  return (
    <>
      <button
        className="mainflight-map__btn-change-maptype"
        value={"Vệ tinh"}
        onClick={handleChangeMapType}
      >
        {buttonText}
      </button>

      {renderMapWithMarker()}
    </>
  );
};

export default MainFlightMap;
