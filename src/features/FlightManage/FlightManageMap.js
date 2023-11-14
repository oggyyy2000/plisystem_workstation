import React, { useEffect, useCallback } from "react";

import { Box } from "@mui/material";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";

import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { VTInfo, MissionId } from "../../redux/selectors";

import errorIcon from "../../assets/images/error-icon.png";
import "./css/FlightManageMap.css";

export default function FlightManageMap() {
  const [typeMap, setTypeMap] = useState("roadmap");
  const [buttonText, setButtonText] = useState("Bản đồ");
  const [center, setCenter] = useState({
    lat: 21.007556875711494,
    lng: 105.84322259736739,
  });
  const [missionData, setMissionData] = useState({});
  const [GISlist, setGISlist] = useState([]);
  const [nameError, setNameError] = useState();
  const [activeMarker, setActiveMarker] = useState(null);
  const VTdetail = useSelector(VTInfo);
  const missionId = useSelector(MissionId);

  const urlhomePageView = process.env.REACT_APP_API_URL + "homepageapiview/";
  // const urlLocations = process.env.REACT_APP_API_URL + "powerlinelocations";

  // console.log(missionData);

  const getGIS = useCallback(() => {
    const listGIS = [];
    const errorName = [];

    for (var key in VTdetail.data) {
      if (typeof VTdetail.data[key] !== "string") {
        VTdetail.data[key].forEach((item) => {
          listGIS.push(item.defect_gis);
          errorName.push(item.defect_name);
        });
      }
    }

    // Object.values(VTdetail.data).forEach((data) => {
    //   if (Array.isArray(data)) {
    //     data.forEach((item) => {
    //       listGIS.push(item.defect_gis);
    //       errorName.push(item.defect_name);
    //     });
    //   }
    // });

    setGISlist(listGIS);
    setNameError(errorName);
  }, [VTdetail.data])

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
          console.log(typeof res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
  }, [missionId, urlhomePageView]);

  // const { isLoaded } = useJsApiLoader({
  //   id: "google-map-script",
  //   googleMapsApiKey: "AIzaSyAxTvKumZ34dP0Qf_veNQoliDMC5GgrblM",
  // });
  // if (!isLoaded) return <div>...Loading</div>;

  const handleChangeMapType = (event) => {
    setButtonText("Vệ tinh");
    if (buttonText === "Vệ tinh") {
      setButtonText("Bản đồ");
    }
    if (event.target.value === "Vệ tinh") {
      setTypeMap("satellite");
      if (typeMap === "satellite") {
        setTypeMap("roadmap");
      }
    }
  };

  const handleActiveMarker = (marker, item) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
    setCenter({ lat: item.latitude, lng: item.longtitude });
  };

  // function renderMapwithAMarker(GISlist, nameError) {
  //   return (
  //     <>
  //       <div>
  //         <div id="home-btn-container">
  //           <button
  //             className={`home-btn-change-maptype`}
  //             value={"Vệ tinh"}
  //             onClick={handleChangeMapType}
  //           >
  //             {buttonText}
  //           </button>
  //         </div>
  //         <div className="home-map-title">
  //           Tuyến {missionData.powerline_id} {missionData.powerline_name}
  //         </div>
  //         <GoogleMap
  //           mapContainerClassName="home-google-map"
  //           center={center}
  //           zoom={12}
  //           mapTypeId={typeMap}
  //           options={{ zoomControl: false }}
  //           onClick={() => setActiveMarker(null)}
  //         >
  //           {GISlist.map((item, index) => {
  //             let iconMarker = new window.google.maps.MarkerImage(
  //               "https://lh3.googleusercontent.com/pw/AM-JKLUs1eX_HbHDXCbEZIr6Zb1lRJPWjhiJk8pFAn82uOebQq77t0n41BzrLrJ8y79pxoYApFx6FznLaHG_fim_tqElBo4gmxIXatokQGC1Y7z3sC00uSoaU6qekd0bkhKGsa30h8Ze9pKx016_4v07kEtg=w1179-h943-no",
  //               null /* size is determined at runtime */,
  //               null /* origin is 0,0 */,
  //               null /* anchor is bottom center of the scaled image */,
  //               new window.google.maps.Size(25, 25)
  //             );
  //             // console.log(typeof index);
  //             var latitude = parseFloat(item.latitude);
  //             var longtitude = parseFloat(item.longtitude);
  //             return (
  //               <>
  //                 <MarkerF
  //                   key={index}
  //                   position={{ lat: latitude, lng: longtitude }}
  //                   icon={iconMarker}
  //                   // animation={1}
  //                   onClick={() => {
  //                     handleActiveMarker(index, item);
  //                   }}
  //                 >
  //                   {activeMarker === index && (
  //                     <InfoWindowF
  //                       position={{ lat: latitude, lng: longtitude }}
  //                     >
  //                       <Box
  //                         className={"infobox"}
  //                         style={{
  //                           color: "black",
  //                           width: 100,
  //                           wordWrap: "break-word",
  //                         }}
  //                       >
  //                         <p>Tên lỗi: {nameError}</p>
  //                         <p>
  //                           Tọa độ: {latitude} , {longtitude}
  //                         </p>
  //                       </Box>
  //                     </InfoWindowF>
  //                   )}
  //                 </MarkerF>
  //               </>
  //             );
  //           })}
  //         </GoogleMap>
  //       </div>
  //     </>
  //   );
  // }

  const renderMapwithAMarker = (GISlist, nameError) => {
    const customIcon = new Icon({
      iconUrl: errorIcon,
      iconSize: [30, 30],
    });
    return (
      <>
        <div>
          <div className="home-btn-container">
            <button
              className={`home-btn-change-maptype`}
              value={"Vệ tinh"}
              onClick={handleChangeMapType}
            >
              {buttonText}
            </button>
          </div>
          <div className="home-map-title">
            Tuyến {missionData.powerline_id} {missionData.powerline_name}
          </div>
          <MapContainer
            center={center}
            zoomControl={false}
            zoom={13}
            className="home-google-map"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url={
                typeMap === "roadmap"
                  ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              }
            />
            {GISlist.map((item, index) => {
              var latitude = parseFloat(item.latitude);
              var longtitude = parseFloat(item.longtitude);
              return (
                <>
                  <Marker
                    key={index}
                    position={{ lat: latitude, lng: longtitude }}
                    icon={customIcon}
                    onClick={() => {
                      handleActiveMarker(index, item);
                    }}
                  >
                    {activeMarker === index && (
                      <Popup position={{ lat: latitude, lng: longtitude }}>
                        <Box
                          className={"infobox"}
                          style={{
                            color: "black",
                            width: 100,
                            wordWrap: "break-word",
                          }}
                        >
                          <p>Tên lỗi: {nameError}</p>
                          <p>
                            Tọa độ: {latitude} , {longtitude}
                          </p>
                        </Box>
                      </Popup>
                    )}
                  </Marker>
                </>
              );
            })}
            {/* <Marker icon={customIcon} position={center}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker> */}
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
}
