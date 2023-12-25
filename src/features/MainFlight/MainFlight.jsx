import React from "react";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { WSContext } from "../../components/context/WSContext";
import axios from "axios";

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
} from "@mui/material";

import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";

import "./css/MainFlight.css";
import Loading from "../../components/LoadingPage/LoadingPage";
import MainFlightDefectList from "./MainFlightDefectList";
import MainFlightInMission from "./MainFlightInMission";
import MainFlightMap from "./MainFlightMap";
import MainFlightDialogAfterFly from "./MainFlightDialogAfterFly";

const CustomTabPanel = (props) => {
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
};

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const MainFlight = () => {
  const [open, setOpen] = useState(true);

  // modal after fly variable
  const [flightComplete, setFlightComplete] = useState(false);
  const [getImgData, setGetImgData] = useState("");

  // common variable
  const [startFly, setStartFly] = useState(false);
  const [currentVT, setCurrentVT] = useState("");
  const [DefectInfo, setDefectInfo] = useState([]);
  const [currentLocation, setCurrentLocation] = useState({});

  console.log(currentLocation);

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
  console.log(DateDB);
  const [tuyen, setTuyen] = useState();
  console.log(tuyen);
  const [superviseType, setSuperviseType] = useState();
  console.log(superviseType);

  //map variable
  const [zoom, setZoom] = useState(17);
  const [streetLine, setStreetLine] = useState([]);
  const [center, setCenter] = useState({
    lat: 21.002890438729345,
    lng: 105.86171273377768,
  });

  const { ws, connect, disconnect } = useContext(WSContext);

  const urlPostFlightInfo =
    process.env.REACT_APP_API_URL + "supervisionstreaming/";

  useEffect(() => {
    connect();
  }, [connect]);

  useEffect(() => {
    try {
      if (!ws.current) return;
      ws.current.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.data_state === "supervise_complete") {
          setGetImgData(data.data);
          setFlightComplete(true);
          setStartFly(false);
          setHadSubmited(false);
          disconnect();
        }
        console.log("data:", data);
        const gis = data.data.gis;
        const defectWS = data.data.defects;
        const VT = data.data.location;
        setCurrentVT(VT);

        if (gis !== undefined) {
          setStartFly(true);
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
          setZoom(20);
          if (defectWS.length > 0) {
            setDefectInfo(defectWS);
          }
        }
      };
    } catch (e) {
      console.log(e);
    }
  }, [startFly, streetLine, ws, disconnect]);

  // ---------- Add Info for mission dialog ----------

  const handleClickOpen = () => {
    connect();
    setOpen(true);
    setStartFly(false);
    setFlightComplete(false);
    setHadSubmited(false);
    setTuyen("");
    setSuperviseType("");
    setCurrentLocation({});
    setZoom(17);
    setDefectInfo([]);
    setStreetLine([]);
  };

  const handleClose = () => {
    setOpen(false);
    disconnect();
  };

  const AddMissionDialog = () => {
    return (
      <>
        <Button
          className="add-mission-dialog__btn-addmission"
          variant="contained"
          onClick={() => handleClickOpen()}
          disabled={startFly === false ? false : true}
        >
          Bay
          <FlightTakeoffIcon />
        </Button>

        <Dialog open={open} fullWidth maxWidth={"sm"}>
          <Tabs
            value={tab}
            onChange={handleChangeTabs}
            aria-label="basic tabs example"
          >
            <Tab label="giám sát thiết bị" {...a11yProps(0)} />
            <Tab label="giám sát hành lang" {...a11yProps(1)} />

            <div className="add-mission-dialog__icon">
              <FlightTakeoffIcon color="primary" fontSize="large" />
            </div>
          </Tabs>

          {tab === 0 && (
            <CustomTabPanel value={tab} index={0}>
              <DialogContent>
                <DialogContentText>
                  Thông tin:
                  <Box className="add-mission-dialog__select-date-textfield">
                    <TextField
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
                  <Box className="add-mission-dialog__select-tuyen-form">
                    <FormControl fullWidth>
                      <InputLabel>Tên Tuyến</InputLabel>
                      <Select
                        value={tuyen}
                        label="Tên Tuyến"
                        onChange={onChangeSelectTuyen}
                        defaultValue={""}
                      >
                        <MenuItem value={"T87"}>Mai Động-Thanh Nhàn</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box className="add-mission-dialog__select-superviseType-form">
                    <FormControl fullWidth>
                      <InputLabel>Kiểu giám sát</InputLabel>
                      <Select
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
                <Button onClick={() => handleClose()} color="primary">
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
                  <Box className="add-mission-dialog__select-date-textfield">
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
                  <Box className="add-mission-dialog__select-tuyen-form">
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
                <Button onClick={() => setOpen(false)} color="primary">
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
      sendInfo(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div>
        {/* Modal Addmission*/}
        {AddMissionDialog()}

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

        <MainFlightMap
          centerGPS={center}
          zoom={zoom}
          currentLocation={currentLocation}
          defectInfo={DefectInfo}
          streetLine={streetLine}
        />

        <MainFlightDialogAfterFly
          flightComplete={flightComplete}
          getImgData={getImgData}
        />

        {!startFly && !open && hadSubmited ? (
          <Loading startFly={startFly} />
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default MainFlight;
