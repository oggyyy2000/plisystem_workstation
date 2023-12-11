import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { WSContext } from "../../components/context/WSContext";
// import Webcam from "react-webcam";

import { useDispatch } from "react-redux";
import * as actions from "../../redux/types";
import { useSelector } from "react-redux";
import {
  CurrentFrame,
  CurrentLocation,
  DefectInfo,
} from "../../redux/selectors";

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
} from "@mui/material";
import PropTypes from "prop-types";

import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import { Icon } from "leaflet";

import "./css/DemoFlight.css";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import SaveIcon from "@mui/icons-material/Save";
import DroneIcon from "../../assets/images/drone2.png";
import ErrorIcon from "../../assets/images/error-icon.png";

import DemoFlightDefectList from "./DemoFlightDefectList";
import DemoFlightInMission from "./DemoFlightInMission";
import DemoFlightDialogAfterFly from "./DemoFlightDialogAfterFly";

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

export default function FlightRouteMap() {
  const [open, setOpen] = useState(true);

  const [hadSubmited, setHadSubmited] = useState(false);
  const [startFly, setStartFly] = useState(false);
  const [progress, setProgress] = useState("");
  const [SRT, setSRT] = useState(null);
  const [nameSRT, setNameSRT] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [nameSelectedFile, setNameSelectedFile] = useState(null);
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
  console.log("DateDB:", DateDB);
  const [tuyen, setTuyen] = useState();
  const [superviseType, setSuperviseType] = useState();

  const [typeMap, setTypeMap] = useState("roadmap");
  const [buttonText, setButtonText] = useState("Bản đồ");
  const [zoom, setZoom] = useState(15);
  const [streetLine, setStreetLine] = useState([]);
  // console.log('streetline', streetLine);
  const dispatch = useDispatch();
  // const [listCurrentFrame, setListCurrentFrame] = useState([]);
  const currentLocation = useSelector(CurrentLocation);
  const defectInfo = useSelector(DefectInfo);
  const currentFrame = useSelector(CurrentFrame);

  const [tab, setTab] = useState(0);
  // console.log(tab);

  const [center, setCenter] = useState({
    lat: 21.028511,
    lng: 105.804817,
  });

  const urlPostSchedules =
    process.env.REACT_APP_API_URL + "supervisionschedules/";
  const { ws, connect, disconnect } = useContext(WSContext);

  useEffect(() => {
    // disconnect();
    if (open === true) {
      connect();
    } else {
      // disconnect();
    }
  }, [open, connect]);

  useEffect(() => {
    try {
      if (!ws.current) return;
      ws.current.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.data === "supervise_complete") {
          alert("Complete!");
          setStartFly(false);
        }
        console.log("data:", data);
        const gis = data.data.gis;
        const defectWS = data.data.defects;
        const VT = data.data.location;
        const currentFrame = process.env.REACT_APP_IMG + data.data.frame;
        const processPercent = data.data.progress;
        setProgress(processPercent);

        if (gis !== undefined) {
          console.log("WS", gis);
          dispatch({ type: actions.CurrentLocation, data: gis });
          // setCurrentLocation(gis);
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
          setZoom(23);
          if (defectWS.length > 0) {
            dispatch({ type: actions.DefectInfo, data: defectWS });
          }
          console.log("defectInfo", defectInfo);
          dispatch({ type: actions.CurrentVT, data: VT });
          dispatch({ type: actions.CurrentFrame, data: currentFrame });
        }
      };
    } catch (e) {
      console.log(e);
    }
  }, [currentLocation, defectInfo, currentFrame, dispatch, streetLine, ws]);

  // ---------- Add Info for mission dialog ----------

  const handleClickOpen = () => {
    setOpen(true);
    setHadSubmited(false);
    setTuyen(null);
    setSelectedFile(null);
    setNameSelectedFile(null);
    setSRT(null);
    setNameSRT(null);
  };

  const handleClose = () => {
    setOpen(false);
    setTuyen(null);
    setSelectedFile(null);
    setNameSelectedFile(null);
    setSRT(null);
    setNameSRT(null);
    disconnect();
  };

  const AddMissionDialog = () => {
    return (
      <>
        <Dialog
          open={open}
          PaperProps={
            tab === 0
              ? {
                  sx: { maxWidth: "100%", width: "515px", height: "410px" },
                }
              : {
                  sx: { maxWidth: "100%", width: "515px", height: "350px" },
                }
          }
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

                <div className="flightroute-dialog-icon">
                  <FlightTakeoffIcon color="primary" fontSize="large" />
                </div>
              </Tabs>
            </Box>
            {tab === 0 && (
              <CustomTabPanel value={tab} index={0}>
                <DialogContent>
                  <DialogContentText sx={{ display: "flex" }}>
                    <div style={{ width: "50%", textAlign: "center" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        component="label"
                        htmlFor="files"
                        startIcon={<SaveIcon />}
                      >
                        VIDEO
                        <input
                          id="files"
                          name="file"
                          accept="video/*"
                          style={{ display: "none" }}
                          type="file"
                          onChange={(e) => onChangeHandlerVID(e)}
                        />
                      </Button>
                      {nameSelectedFile}
                    </div>
                    <div style={{ width: "50%", textAlign: "center" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        component="label"
                        htmlFor="srt"
                        startIcon={<SaveIcon />}
                        style={{ marginLeft: 10 }}
                      >
                        SRT
                        <input
                          id="srt"
                          name="srt"
                          accept=".srt"
                          style={{ display: "none" }}
                          type="file"
                          onChange={(e) => onChangeHandlerSRT(e)}
                        />
                      </Button>
                      {nameSRT}
                    </div>
                  </DialogContentText>
                  <DialogContentText style={{ marginTop: "5px" }}>
                    Info:
                    <Box className="flightroute-select-date">
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
                    <Box className="flightroute-select-tuyen">
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
                    Cancel
                  </Button>
                  {selectedFile != null &&
                  SRT != null &&
                  tuyen != null &&
                  hadSubmited === false ? (
                    <Button onClick={handleSubmit} color="primary">
                      Submit
                    </Button>
                  ) : (
                    <Button disabled>
                      {hadSubmited === false ? "Submit" : "Processing..."}
                    </Button>
                  )}
                </DialogActions>
              </CustomTabPanel>
            )}
            {tab === 1 && (
              <CustomTabPanel value={tab} index={1}>
                <DialogContent>
                  <DialogContentText sx={{ display: "flex" }}>
                    <div style={{ width: "50%", textAlign: "center" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        component="label"
                        htmlFor="files"
                        startIcon={<SaveIcon />}
                      >
                        VIDEO
                        <input
                          id="files"
                          name="file"
                          accept="video/*"
                          style={{ display: "none" }}
                          type="file"
                          onChange={(e) => onChangeHandlerVID(e)}
                        />
                      </Button>
                      {nameSelectedFile}
                    </div>
                    <div style={{ width: "50%", textAlign: "center" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        component="label"
                        htmlFor="srt"
                        startIcon={<SaveIcon />}
                        style={{ marginLeft: 10 }}
                      >
                        SRT
                        <input
                          id="srt"
                          name="srt"
                          accept=".srt"
                          style={{ display: "none" }}
                          type="file"
                          onChange={(e) => onChangeHandlerSRT(e)}
                        />
                      </Button>
                      {nameSRT}
                    </div>
                  </DialogContentText>
                  <DialogContentText style={{ marginTop: "5px" }}>
                    Info:
                    <Box className="flightroute-select-date">
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
                    <Box className="flightroute-select-tuyen">
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
                    Cancel
                  </Button>
                  {selectedFile != null &&
                  SRT != null &&
                  tuyen != null &&
                  hadSubmited === false ? (
                    <Button onClick={handleSubmit} color="primary">
                      Submit
                    </Button>
                  ) : (
                    <Button disabled>
                      {hadSubmited === false ? "Submit" : "Processing..."}
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

  const onChangeHandlerSRT = async (event) => {
    setSRT(event.target.files[0]);
    setNameSRT(event.target.files[0].name);
  };

  const onChangeHandlerVID = async (event) => {
    setSelectedFile(event.target.files[0]);
    setNameSelectedFile(event.target.files[0].name);
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

  const sendPostRequest = async (formData) => {
    try {
      const response = await axios.post(urlPostSchedules, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      if (response.data) {
        setStartFly(true);
      }
      sendvideo(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const sendvideo = (data) => {
    if (!ws.current) return;
    ws.current.send(JSON.stringify(data));
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setHadSubmited(true);
    setZoom(15);
    setStreetLine([]);
    dispatch({ type: actions.CurrentLocation, data: {} });
    dispatch({ type: actions.DefectInfo, data: [] });

    const formData = new FormData();
    formData.append("video", selectedFile);
    formData.append("srt", SRT);
    formData.append(
      "data",
      JSON.stringify({ powerline_id: tuyen, implementation_date: DateDB })
    );

    sendPostRequest(formData);
  };

  // ------------ Main Dialog ------------

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

  const renderMapWithMarker = () => {
    const customIcon = new Icon({
      iconUrl: DroneIcon,
      iconSize: [30, 30],
    });
    return (
      <>
        <div>
          <MapContainer
            center={[center.lat, center.lng]}
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
            {renderMarkerError(defectInfo)}
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

  const renderMarkerError = (defectInfo) => {
    const customIcon = new Icon({
      iconUrl: ErrorIcon,
      iconSize: [27, 27],
    });

    if (defectInfo.length > 0) {
      return (
        <>
          {defectInfo.map((gis1) => {
            console.log(gis1);
            return (
              <>
                <Marker
                  key={1}
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

  return (
    <>
      <div style={{ height: "92.8vh" }}>
        <div id="flightroute-btn-container">
          <button
            className={`flightroute-btn-change-maptype`}
            value={"Vệ tinh"}
            onClick={handleChangeMapType}
          >
            {buttonText}
          </button>

          <Button
            className="flightroute-btn-addmission"
            variant="contained"
            onClick={handleClickOpen}
            disabled={startFly === false ? false : true}
          >
            Bay
            <FlightTakeoffIcon />
          </Button>

          {/* Modal */}
          {AddMissionDialog()}
        </div>

        <DemoFlightDefectList startfly={startFly} />
        <DemoFlightInMission startfly={startFly} progress={progress} />
        <DemoFlightDialogAfterFly />

        {currentLocation &&
          defectInfo &&
          streetLine &&
          renderMapWithMarker(currentLocation, defectInfo, streetLine)}
      </div>
    </>
  );
}
