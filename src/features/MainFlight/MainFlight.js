import React from "react";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { WSContext } from "../../components/context/WSContext";
import axios from "axios";

// import {
//   GoogleMap,
//   useJsApiLoader,
//   MarkerF,
//   PolylineF,
// } from "@react-google-maps/api";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
} from "react-leaflet";
import { Icon } from "leaflet";

import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  TextField,
  Tabs,
  Tab,
  Typography,
  Backdrop,
  Modal,
  Fade,
  FormControlLabel,
  Checkbox,
  Grid,
  ImageList,
  ImageListItem,
  DialogTitle,
} from "@mui/material";

import DroneIcon from "../../assets/images/drone2.png";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import CropFreeIcon from "@mui/icons-material/CropFree";
import ErrorIcon from "../../assets/images/error-icon.png";

import "./css/MainFlight.css";
import MainFlightDefectList from "./MainFlightDefectList";
import MainFlightInMission from "./MainFlightInMission";

const errorLabel = [
  "binhthuong",
  "cachdientt-vobat",
  "cachdienslc-rachtan",
  "daydien-tuasoi",
  "macdivat",
  "mongcot-satlo",
  "troita",
];

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const MainFlight = () => {
  const [open, setOpen] = useState(true);

  // modal after fly variable
  const [openModalAfterFly, setOpenModalAfterFly] = useState(false);
  const [errorImageBoxChecked, setErrorImageBoxChecked] = useState(false);
  const [openZoomingImg, setOpenZoomingImg] = useState("");
  const [openEditLabel, setOpenEditLabel] = useState("");
  const [imgList2, setImgList2] = useState({});
  const [imageNewLabels, setImageNewLabels] = useState([]);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [editLabelSelectedValue, setEditLabelSelectedValue] = useState([]);
  const [getImgData, setGetImgData] = useState("");

  //check variable change
  const [change, setChange] = useState(false);
  const [checked, setChecked] = useState([]);
  const [hadSubmittedError, setHadSubmittedError] = useState(false);

  // common variable
  const [startFly, setStartFly] = useState(false);
  const [currentVT, setCurrentVT] = useState("");
  const [DefectInfo, setDefectInfo] = useState([]);
  const [currentLocation, setCurrentLocation] = useState({});

  //modal addmission variable
  const [hadSubmited, setHadSubmited] = useState(false);
  const [tab, setTab] = useState(0);
  var dt = new Date();
  var date = `${dt.getFullYear().toString().padStart(4, "0")}-${(
    dt.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${dt.getDate().toString().padStart(2, "0")}`;
  const values = {
    someDate: date,
  };
  const [DateDB, setDateDB] = useState(date);
  const [tuyen, setTuyen] = useState();
  const [superviseType, setSuperviseType] = useState();

  //map variable
  const [typeMap, setTypeMap] = useState("roadmap");
  const [buttonText, setButtonText] = useState("Bản đồ");
  const [zoom, setZoom] = useState(13);
  const [streetLine, setStreetLine] = useState([]);
  const [center, setCenter] = useState({
    lat: 21.028511,
    lng: 105.804817,
  });

  const { ws, connect, disconnect } = useContext(WSContext);

  const urlPostFlightInfo =
    process.env.REACT_APP_API_URL + "supervisionstreaming/";
  const urlPostNewImageLabel =
    process.env.REACT_APP_API_URL + "supervisiondetails/";
  const urlPostFlightData = process.env.REACT_APP_API_URL + "flightdatas/";
  const urlGetData =
    process.env.REACT_APP_API_URL +
    "supervisiondetails/?spv_results_path=" +
    getImgData +
    `&img_state=${errorImageBoxChecked === true ? "defect" : "all"}`;

  useEffect(() => {
    // disconnect();
    if (open === true) {
      connect();
    }
  }, [open, connect]);

  useEffect(() => {
    try {
      if (!ws.current) return;
      ws.current.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.data_state === "supervise_complete") {
          setGetImgData(data.data);
          setStartFly(false);
          setOpenModalAfterFly(true);
        }
        console.log("data:", data);
        const gis = data.data.gis;
        const defectWS = data.data.defects;
        const VT = data.data.location;
        setCurrentVT(VT);

        if (gis !== undefined) {
          console.log("WS", gis);
          setCurrentLocation(gis);
          setCenter({
            lat: parseFloat(gis.latitude),
            lng: parseFloat(gis.longtitude),
          });
          const temppoly = [...streetLine];
          temppoly.push({
            lat: parseFloat(gis.latitude),
            lng: parseFloat(gis.longtitude),
          });
          setStreetLine(temppoly);
          setZoom(13);
          if (defectWS.length > 0) {
            setDefectInfo(defectWS);
          }
        }
      };
    } catch (e) {
      console.log(e);
    }
  }, [startFly, streetLine, ws]);

  useEffect(() => {
    setChange(false);
    setImageNewLabels([]);

    axios
      .get(urlGetData)
      .then((res) => {
        console.log("data:", res.data);
        setImgList2(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [getImgData, change, hadSubmittedError, errorImageBoxChecked, urlGetData]);

  // ---------- Add Info for mission dialog ----------

  const handleClickOpen = () => {
    setOpen(true);
    setStartFly(false);
    setHadSubmited(false);
    setTuyen(null);
    setCurrentLocation({});
    setZoom(13);
    setDefectInfo([]);
  };

  const handleClose = () => {
    setOpen(false);
    setTuyen(null);
    disconnect();
  };

  const AddMissionDialog = () => {
    return (
      <>
        <Dialog
          open={open}
          PaperProps={{
            sx: { maxWidth: "100%", width: "515px", height: "410px" },
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tab}
                onChange={handleChangeTabs}
                aria-label="basic tabs example"
              >
                <Tab label="giám sát thiết bị" {...a11yProps(0)} />
                <Tab label="giám sát hành lang" {...a11yProps(1)} />

                <div className="mainflight-dialog-icon">
                  <FlightTakeoffIcon color="primary" fontSize="large" />
                </div>
              </Tabs>
            </Box>
            {tab === 0 && (
              <CustomTabPanel value={tab} index={0}>
                <DialogContent>
                  <DialogContentText>
                    Thông tin:
                    <Box className="mainflight-select-date">
                      <TextField
                        id="date"
                        label="Ngày quay"
                        type="date"
                        value={DateDB}
                        defaultValue={values.someDate}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={onChangeDateDB}
                      />
                    </Box>
                    <Box className="mainflight-select-tuyen">
                      <FormControl fullWidth>
                        <InputLabel>Tên Tuyến</InputLabel>
                        <Select
                          id="route"
                          value={tuyen}
                          label="Tên Tuyến"
                          onChange={onChangeSelectTuyen}
                          defaultValue={""}
                        >
                          <MenuItem value={"T87"}>Mai Động-Thanh Nhàn</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Box className="mainflight-select-superviseType">
                      <FormControl fullWidth>
                        <InputLabel>Kiểu giám sát</InputLabel>
                        <Select
                          id="superviseType"
                          value={superviseType}
                          label="Kiểu giám sát"
                          onChange={onChangeSelectSuperviseType}
                          defaultValue={""}
                        >
                          <MenuItem value={"day"}>Dây</MenuItem>
                          <MenuItem value={"thietbi"}>Thiết bị</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Hủy
                  </Button>
                  {tuyen != null && hadSubmited === false ? (
                    <Button onClick={handleSubmitInfoBeforeFly} color="primary">
                      Xác nhận
                    </Button>
                  ) : (
                    <Button disabled>
                      {hadSubmited === false ? "Xác nhận" : "Đang xử lý..."}
                    </Button>
                  )}
                </DialogActions>
              </CustomTabPanel>
            )}
            {tab === 1 && (
              <CustomTabPanel value={tab} index={1}>
                <DialogContent>
                  <DialogContentText>
                    Thông tin:
                    <Box className="mainflight-select-date">
                      <TextField
                        id="date"
                        label="Ngày quay"
                        type="date"
                        value={DateDB}
                        defaultValue={values.someDate}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={onChangeDateDB}
                      />
                    </Box>
                    <Box className="mainflight-select-tuyen">
                      <FormControl fullWidth>
                        <InputLabel>Tên Tuyến</InputLabel>
                        <Select
                          id="route"
                          value={tuyen}
                          label="IDTuyen"
                          onChange={onChangeSelectTuyen}
                          defaultValue={""}
                        >
                          <MenuItem value={"T87"}>Mai Động-Thanh Nhàn</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Hủy
                  </Button>
                  {tuyen != null && hadSubmited === false ? (
                    <Button onClick={handleSubmitInfoBeforeFly} color="primary">
                      Xác nhận
                    </Button>
                  ) : (
                    <Button disabled>
                      {hadSubmited === false ? "Xác nhận" : "Đang xử lý..."}
                    </Button>
                  )}
                </DialogActions>
              </CustomTabPanel>
            )}
          </Box>
        </Dialog>
      </>
    );
  };

  const handleChangeTabs = (event, newValue) => {
    setTab(newValue);
  };

  const onChangeDateDB = (e) => {
    e.preventDefault();
    setDateDB(e.target.value);
  };

  const onChangeSelectTuyen = (e) => {
    setTuyen(e.target.value);
  };

  const onChangeSelectSuperviseType = (e) => {
    setSuperviseType(e.target.value);
  };

  const handleSubmitInfoBeforeFly = (e) => {
    e.preventDefault();
    setHadSubmited(true);
    setStreetLine([]);

    const formData = new FormData();

    formData.append(
      "data",
      JSON.stringify({
        powerline_id: tuyen,
        implementation_date: DateDB,
        supervise_type: superviseType,
      })
    );

    sendPostRequest(formData);
  };

  const sendInfo = (data) => {
    if (!ws.current) return;
    ws.current.send(JSON.stringify(data));
    setOpen(false);
  };

  const sendPostRequest = async (formData) => {
    try {
      const response = await axios.post(urlPostFlightInfo, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      if (response.data) {
        setStartFly(true);
      }
      sendInfo(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // ------------ Main Dialog ------------

  // --------- Ham de xu ly click input va label ---------
  const handleLabelClick = (label) => {
    if (selectedLabels.includes(label)) {
      setSelectedLabels(selectedLabels.filter((l) => l !== label));
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  const handleInputClick = (event) => {
    var updatedList = [...checked];
    if (event.target.checked) {
      updatedList = [...checked, event.target.value];
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
    }
    console.log(updatedList);
    setChecked(updatedList);
  };

  // --------- Ham de loc chi anh bat thuong  ---------
  const handleErrorImageBoxChecked = (e) => {
    setErrorImageBoxChecked(e.target.checked);
  };

  // --------- Ham de submit tat ca cac anh nguoi dung chon --------
  const handleSubmitErrorImage = () => {
    console.log(checked);
    setHadSubmittedError(false);
    axios
      .post(urlPostFlightData, checked)
      .then((response) => {
        // console.log(response);
        if (response.status === 200) {
          alert(response.data);
          setHadSubmittedError(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // ------------ Zooming Dialog ------------

  const zoomingDialog = (info) => {
    return (
      <>
        <Button
          variant="contained"
          style={{
            height: "36px",
            minWidth: "10px",
            top: 0,
            right: 10,
          }}
          onClick={() => setOpenZoomingImg(info.img_path)}
        >
          <CropFreeIcon />
        </Button>

        <Dialog
          open={openZoomingImg === info.img_path ? true : false}
          onClose={() => setOpenZoomingImg(false)}
          sx={{
            "& .MuiDialog-container": {
              justifyContent: "flex-start",
              alignItems: "flex-start",
            },
          }}
          PaperProps={{
            sx: {
              height: "681px",
              width: "1535px",
              maxWidth: "1535px",
            },
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <img
            src={process.env.REACT_APP_IMG + info.img_path}
            srcSet={process.env.REACT_APP_IMG + info.img_path}
            alt={info.img_path}
            loading="lazy"
            width={"100%"}
            height={"100%"}
          />
        </Dialog>
      </>
    );
  };

  // ------------- Edit Label Dialog---------------

  const handleCheckboxChooseNewLabel = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setImageNewLabels([...imageNewLabels, value]);
    } else {
      setImageNewLabels(imageNewLabels.filter((label) => label !== value));
    }

    if (value === "binhthuong" || imageNewLabels === "binhthuong") {
      if (editLabelSelectedValue.includes(value)) {
        setImageNewLabels([]);
        setEditLabelSelectedValue([]);
      } else {
        setImageNewLabels([value]);
        setEditLabelSelectedValue([value]);
      }
    } else {
      setEditLabelSelectedValue([value]);
    }

    console.log(imageNewLabels);
  };

  const isDisabled = (value) => {
    return (
      editLabelSelectedValue.includes("binhthuong") && value !== "binhthuong"
    );
  };

  const handleSubmitEditLabel = (imageLink) => {
    const imageLabel = {
      img_path: imageLink,
      new_label: imageNewLabels.join("_"),
    };

    axios
      .post(urlPostNewImageLabel, imageLabel)
      .then((response) => {
        console.log(response);
        if (response.data === "Change Success") {
          alert("Thay đổi nhãn thành công!");
          setChange(true);
          setOpenEditLabel(false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const editLabelDialog = (info) => {
    return (
      <>
        <Button
          variant="contained"
          style={{
            minHeight: "35px",
            minWidth: "10px",
            top: 0,
            right: 0,
          }}
          onClick={() => {
            setOpenEditLabel(info.img_path);
            setImageNewLabels([...info.label.split("_")]);
          }}
          disabled={info.sent_check === 1}
        >
          <EditIcon />
        </Button>
        <Dialog
          sx={{
            "& .MuiDialog-paper": {
              width: "80%",
              maxHeight: 435,
            },
          }}
          maxWidth="xs"
          open={openEditLabel === info.img_path ? true : false}
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              sx: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          }}
        >
          <DialogTitle>Cập nhật nhãn bất thường</DialogTitle>
          <DialogContent dividers>
            {errorLabel.map((label) => (
              <label key={label} style={{ fontSize: "20px" }}>
                <input
                  type="checkbox"
                  value={label}
                  checked={imageNewLabels.includes(label)}
                  onChange={(e) => handleCheckboxChooseNewLabel(e)}
                  disabled={isDisabled(label)}
                />
                {label} <br />
              </label>
            ))}
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => setOpenEditLabel(false)}>
              Hủy
            </Button>
            <Button onClick={() => handleSubmitEditLabel(info.img_path)}>
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  const renderImageList = () => {
    return Object.keys(imgList2).map((vt) => {
      return (
        <>
          <div>
            <div className="mainflight-line-seperate-items"></div>

            <div className="mainflight-imagelist-title">{vt}</div>

            <ImageList
              sx={{
                position: "relative",
                overflowY: "hidden",
              }}
              cols={3}
            >
              {imgList2[vt].map((info, index) => {
                return (
                  <>
                    <ImageListItem key={index}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <TextField
                          id="outlined-multiline-flexible"
                          label="Tình trạng"
                          value={info.label.split("_").join("\n")}
                          multiline
                          maxRows={3}
                          style={{ height: "70%", marginTop: "7px" }}
                          disabled
                        />

                        <div>
                          {/* Zoom Dialog */}
                          {zoomingDialog(info)}

                          {/* Edit label Dialog */}
                          {editLabelDialog(info)}
                        </div>
                      </div>

                      <label
                        for={`choose-img-${info.img_path}`}
                        className={`homemodal-imagelist-label ${
                          info.sent_check === 1 ? "hadsubmitted" : ""
                        } ${
                          selectedLabels.includes(info.img_path) ||
                          info.sent_check === 1
                            ? "choosed"
                            : ""
                        }`}
                        onClick={() => handleLabelClick(info.img_path)}
                      >
                        <img
                          src={process.env.REACT_APP_IMG + info.img_path}
                          srcSet={process.env.REACT_APP_IMG + info.img_path}
                          alt={info.img_path}
                          loading="lazy"
                          width={"100%"}
                          height={"100%"}
                        />
                      </label>

                      {selectedLabels.includes(info.img_path) ? (
                        <div className="checkmark-hadchoosed"></div>
                      ) : (
                        <></>
                      )}

                      {info.sent_check === 1 ? (
                        <div className="checkmark-hadsent"></div>
                      ) : (
                        <></>
                      )}
                    </ImageListItem>

                    <input
                      id={`choose-img-${info.img_path}`}
                      type="checkbox"
                      value={info.img_path}
                      style={{
                        display: "none",
                      }}
                      onChange={handleInputClick}
                    />
                  </>
                );
              })}
            </ImageList>
          </div>
        </>
      );
    });
  };

  // function handle map

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

  // const renderMarkerError = (defectInfo) => {
  //   if (defectInfo.length > 0) {
  //     return (
  //       <>
  //         {defectInfo.map((gis1) => {
  //           console.log(gis1);
  //           let iconMarker = new window.google.maps.MarkerImage(
  //             "https://lh3.googleusercontent.com/pw/AM-JKLUs1eX_HbHDXCbEZIr6Zb1lRJPWjhiJk8pFAn82uOebQq77t0n41BzrLrJ8y79pxoYApFx6FznLaHG_fim_tqElBo4gmxIXatokQGC1Y7z3sC00uSoaU6qekd0bkhKGsa30h8Ze9pKx016_4v07kEtg=w1179-h943-no",
  //             null /* size is determined at runtime */,
  //             null /* origin is 0,0 */,
  //             null /* anchor is bottom center of the scaled image */,
  //             new window.google.maps.Size(27, 27)
  //           );
  //           return (
  //             <>
  //               <MarkerF
  //                 key={1}
  //                 position={{
  //                   lat: parseFloat(gis1.defect_gis.latitude),
  //                   lng: parseFloat(gis1.defect_gis.longtitude),
  //                 }}
  //                 icon={iconMarker}
  //                 animation={1}
  //               ></MarkerF>
  //             </>
  //           );
  //         })}
  //       </>
  //     );
  //   }
  // };

  // const renderGGMapWithMarker = () => {
  //   let iconMarker = new window.google.maps.MarkerImage(
  //     DroneIcon,
  //     null /* size is determined at runtime */,
  //     null /* origin is 0,0 */,
  //     null /* anchor is bottom center of the scaled image */,
  //     new window.google.maps.Size(30, 30)
  //   );
  //   return (
  //     <>
  //       <GoogleMap
  //         mapContainerClassName="mainflight-google-map"
  //         center={center}
  //         zoom={zoom}
  //         mapTypeId={typeMap}
  //         options={{ zoomControl: false, fullscreenControl: false }}
  //       >
  //         {currentLocation && (
  //           <MarkerF
  //             key={1}
  //             position={{
  //               lat: parseFloat(currentLocation.latitude),
  //               lng: parseFloat(currentLocation.longtitude),
  //             }}
  //             icon={iconMarker}
  //             // animation={1}
  //           ></MarkerF>
  //         )}
  //         {/*{renderMarkerError(DefectInfo)}
  //         {streetLine && (
  //           <PolylineF
  //             path={streetLine}
  //             options={{
  //               strokeColor: "red",
  //               strokeOpacity: 0.75,
  //               strokeWeight: 2,
  //             }}
  //           />
  //         )} */}
  //       </GoogleMap>
  //     </>
  //   );
  // };

  const renderMarkerError = (defectInfo) => {
    const customIcon = new Icon({
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
    const customIcon = new Icon({
      iconUrl: DroneIcon,
      iconSize: [30, 30],
    });

    return (
      <>
        <div>
          <MapContainer
            center={center}
            zoomControl={false}
            zoom={zoom}
            className="mainflight-google-map"
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
            {renderMarkerError(DefectInfo)}
            {streetLine && (
              <Polyline
                pathOptions={{ color: "lime" }}
                positions={streetLine}
              />
            )}
          </MapContainer>
        </div>
      </>
    );
  };

  // const { isLoaded } = useJsApiLoader({
  //   id: "google-map-script",
  //   googleMapsApiKey: "AIzaSyAxTvKumZ34dP0Qf_veNQoliDMC5GgrblM",
  // });

  // if (!isLoaded) return <div>...Loading</div>;

  return (
    <>
      <div>
        <div className="mainflight-btn-container">
          <button
            className={`mainflight-btn-change-maptype`}
            value={"Vệ tinh"}
            onClick={handleChangeMapType}
          >
            {buttonText}
          </button>

          <Button
            className="mainflight-btn-addmission"
            variant="contained"
            onClick={handleClickOpen}
            disabled={startFly === false ? false : true}
          >
            Bay
            <FlightTakeoffIcon />
          </Button>

          {/* <Button
            style={{
              backgroundColor: "chartreuse",
              borderRadius: "10%",
              color: "white",
            }}
            onClick={() => {
              setOpenModalAfterFly(true);
            }}
          >
            xem dữ liệu
          </Button> */}

          {/* Modal Addmission*/}
          {AddMissionDialog()}
        </div>

        <MainFlightDefectList
          startfly={startFly}
          currentvt={currentVT}
          defectInfo={DefectInfo}
        />
        <MainFlightInMission
          startfly={startFly}
          currentvt={currentVT}
          currentlocation={currentLocation}
        />
        {/* Modal after fly */}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={openModalAfterFly}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={openModalAfterFly}>
            <Box
              className="mainflight"
              sx={{
                bgcolor: "background.paper",
              }}
            >
              <Grid container className="mainflight-container" spacing={0}>
                <Grid container xs={12}>
                  <Grid
                    item
                    xs={12}
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Ảnh bất thường"
                      style={{ margin: 0, height: "33px" }}
                      onChange={handleErrorImageBoxChecked}
                    />

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Button
                        variant="outlined"
                        style={{
                          backgroundColor: "#1976d2",
                          color: "white",
                          height: "32.5px",
                          marginRight: "45px",
                        }}
                        onClick={handleSubmitErrorImage}
                      >
                        SUBMIT
                      </Button>

                      <Button
                        className="mainflight-btn-close"
                        color="error"
                        variant="contained"
                        onClick={() => setOpenModalAfterFly(false)}
                      >
                        <CloseIcon fontSize="small" />
                      </Button>
                    </div>
                  </Grid>
                  <Grid item className="mainflight-imgdata" xs={12}>
                    <div className="mainflight-imgdata-container">
                      <div className="mainflight-imagelist">
                        {getImgData !== "" && renderImageList()}
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        </Modal>

        {/* {renderGGMapWithMarker()} */}
        {renderMapWithMarker()}
      </div>
    </>
  );
};

export default MainFlight;
