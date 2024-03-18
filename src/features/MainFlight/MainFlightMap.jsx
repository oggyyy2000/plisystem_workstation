import React, { useEffect } from "react";
import { useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
  Popup,
} from "react-leaflet";
import L from "leaflet";

import { Box } from "@mui/material";

import DroneIcon from "../../assets/images/drone2.png";
import ErrorIcon from "../../assets/images/error-icon.png";
import markerIcon from "../../assets/images/mdi--powerline.svg";

import "./css/MainFlightMap.css";
import axios from "axios";

const MainFlightMap = ({
  centerGPS,
  zoom,
  currentLocation,
  defectInfo,
  streetLine,
  powerlineId,
}) => {
  //map variable
  const [typeMap, setTypeMap] = useState("roadmap");
  const [buttonText, setButtonText] = useState("Bản đồ");
  const [poleCoordinates, setPoleCoordinates] = useState({});
  console.log(poleCoordinates);
  const [polyline, setPolyline] = useState([]);
  console.log(polyline);
  // const polyline = Object.keys(poleCoordinates) > 0
  //   ? poleCoordinates.coordinates.map((coordinate) => {
  //       const [latitude, longtitude] = coordinate.split(",");
  //       return {
  //         lat: parseFloat(latitude),
  //         lng: parseFloat(longtitude),
  //       };
  //     })
  //   : null;
  //   console.log(polyline)

  useEffect(() => {
    const getCoordinatesPole = async () => {
      try {
        const urlGetPoleCoordinate =
          process.env.REACT_APP_API_URL +
          "powerlinelocation/?powerline_id=" +
          powerlineId;
        const responseData = await axios.get(urlGetPoleCoordinate);
        setPoleCoordinates(responseData.data);
        console.log(responseData.data);
        const coordinatesPolyline =
          responseData.data &&
          responseData.data.map((data) => {
            console.log("data: ", data);
            const [latitude, longtitude] = data.coordinates.split(",");
            return {
              lat: parseFloat(latitude),
              lng: parseFloat(longtitude),
            };
          });
        setPolyline(coordinatesPolyline);
      } catch (error) {
        console.log(error);
      }
    };
    if (powerlineId !== "") getCoordinatesPole();
  }, [powerlineId]);

  // useEffect(() => {
  //   const coordinatesPolyline =
  //     poleCoordinates.coordinates &&
  //     poleCoordinates.coordinates.map((coordinate) => {
  //       const [latitude, longtitude] = coordinate.split(",");
  //       return {
  //         lat: parseFloat(latitude),
  //         lng: parseFloat(longtitude),
  //       };
  //     });

  //   setPolyline(coordinatesPolyline);
  // }, [poleCoordinates]);

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
              pole.coordinates.split(",");
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

        {polyline ? (
          <Polyline pathOptions={{ color: "green" }} positions={polyline} />
        ) : (
          <></>
        )}
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

    // const customMarkerIcon = new L.Icon({
    //   iconUrl: markerIcon,
    //   iconSize: [50, 50],
    // });

    return (
      <>
        <div>
          <MapContainer
            center={[centerGPS.lat, centerGPS.lng]}
            zoomControl={false}
            zoom={zoom}
            className="mainflight-map"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url={
                typeMap === "roadmap"
                  ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              }
            />
            {/* render all pole  */}
            {renderMarkerPole()}
            {/* {poleCoordinates.length > 0 && poleCoordinates.map((pole, index) => {
              const [latitudeString, longitudeString] =
                pole.coordinates.split(",");
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
            })} */}
            {currentLocation.latitude && currentLocation.longtitude !== "" ? (
              <Marker
                key={1}
                position={{
                  lat: parseFloat(currentLocation.latitude),
                  lng: parseFloat(currentLocation.longtitude),
                }}
                icon={customIcon}
                // animation={1}
              ></Marker>
            ) : (
              <></>
            )}
            {renderMarkerError(defectInfo)}
            {currentLocation.latitude && currentLocation.longtitude !== "" ? (
              <SetCenterMapOnClick
                coords={[currentLocation.latitude, currentLocation.longtitude]}
              />
            ) : (
              <></>
            )}
            {streetLine && (
              <Polyline pathOptions={{ color: "red" }} positions={streetLine} />
            )}
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
