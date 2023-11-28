import React from "react";
import { useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";

import DroneIcon from "../../assets/images/drone2.png";
import ErrorIcon from "../../assets/images/error-icon.png";

import "./css/MainFlightMap.css";

const MainFlightMap = ({
  centerGPS,
  zoom,
  currentLocation,
  defectInfo,
  streetLine,
}) => {
  //map variable
  const [typeMap, setTypeMap] = useState("roadmap");
  const [buttonText, setButtonText] = useState("Bản đồ");

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

    return (
      <>
        <div>
          <MapContainer
            center={[centerGPS.lat, centerGPS.lng]}
            zoomControl={false}
            zoom={zoom}
            className="map"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url={
                typeMap === "roadmap"
                  ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              }
            />
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
        className="map__btn-change-maptype"
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
