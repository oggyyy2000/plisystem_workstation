import React from "react";
import { useState, useEffect, useContext } from "react";
import { WSContext } from "../../components/context/WSContext";
import axios from "axios";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  TextField,
  Autocomplete,
} from "@mui/material";

import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";

import "./css/MainFlight.css";
import Loading from "../../components/LoadingPage/LoadingPage";
import MainFlightDefectList from "./MainFlightDefectList";
import MainFlightInMission from "./MainFlightInMission";
import MainFlightMap from "./MainFlightMap";
import MainFlightDialogAfterFly from "./MainFlightDialogAfterFly";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

const csrfToken = getCookie("csrftoken");

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
  const [idFormReport, setIdFormReport] = useState("");
  console.log("idFormReport", idFormReport);
  const [idTuyen, setIdTuyen] = useState("");
  console.log("idTuyen", idTuyen);
  const [superviseType, setSuperviseType] = useState("");
  console.log("superviseType", superviseType);
  const [UAVname, setUAVname] = useState("");
  console.log("UAVname", UAVname);
  const [tenTuyen, setTenTuyen] = useState([]);
  console.log("tenTuyen", tenTuyen);

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

  useEffect(() => {
    const powerlines = process.env.REACT_APP_API_URL + "powerline/";

    axios
      .get(powerlines)
      .then((res) => {
        console.log("data:", res.data);
        setTenTuyen(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // ---------- Add Info for mission dialog ----------

  const handleClickOpen = () => {
    connect();
    setOpen(true);
    setStartFly(false);
    setFlightComplete(false);
    setHadSubmited(false);
    setIdFormReport("");
    setIdTuyen("");
    setUAVname("");
    setSuperviseType("");
    setCurrentLocation({});
    setZoom(17);
    setDefectInfo([]);
    setStreetLine([]);
  };

  const handleRefresh = () => {
    setStartFly(false);
    setFlightComplete(false);
    setHadSubmited(false);
    setIdFormReport("");
    setIdTuyen("");
    setUAVname("");
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
          <DialogTitle
            sx={{
              display: "flex",
              textAlign: "center",
              textTransform: "uppercase",
              borderBottom: "1px solid black",
              backgroundColor: "#1976d2",
              color: "white",
            }}
          >
            <span>Thông tin giám sát</span>
            <div className="add-mission-dialog__icon">
              <FlightTakeoffIcon color="white" fontSize="large" />
            </div>
          </DialogTitle>

          <DialogContent
            sx={{ padding: "20px 24px !important", overflowY: "hidden" }}
          >
            <Box className="add-mission-dialog__form-id-textfield">
              <TextField
                label="Phiếu kiểm tra"
                value={idFormReport}
                defaultValue={""}
                onChange={onChangeFormId}
              />
            </Box>
            <Box className="add-mission-dialog__select-date-textfield">
              <TextField
                label="Ngày kiểm tra"
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
              <Autocomplete
                options={tenTuyen}
                getOptionLabel={(option) => option.powerline_name}
                onChange={(event, newValue) => {
                  onChangeSelectTuyen(newValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Tên Tuyến" />
                )}
              />
            </Box>
            <Box className="add-mission-dialog__select-UAV-form">
              <FormControl fullWidth>
                <InputLabel>Thiết bị bay</InputLabel>
                <Select
                  value={UAVname}
                  label="Thiết bị bay"
                  onChange={onChangeSelectUAV}
                  defaultValue={""}
                >
                  <MenuItem value={"Mavic-UAV1"}>Mavic-UAV1</MenuItem>
                  <MenuItem value={"Mavic-UAV2"}>Mavic-UAV2</MenuItem>
                  <MenuItem value={"Mavic-UAV3"}>Mavic-UAV3</MenuItem>
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
                  <MenuItem value={"hanhlang"}>Hành lang</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ padding: "16px 24px" }}>
            {idFormReport === "" &&
            idTuyen === "" &&
            superviseType === "" &&
            UAVname === "" ? (
              <Button onClick={() => handleClose()} color="primary">
                Hủy
              </Button>
            ) : (
              <Button onClick={() => handleRefresh()} color="primary">
                Chọn lại
              </Button>
            )}

            {idTuyen != null && hadSubmited === false ? (
              <Button onClick={handleSubmitInfoBeforeFly} color="primary">
                Xác nhận
              </Button>
            ) : (
              <Button disabled>
                {hadSubmited === false ? "Xác nhận" : "Đang xử lý..."}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </>
    );
  };

  const onChangeFormId = (e) => {
    e.preventDefault();
    setIdFormReport(e.target.value);
  };

  const onChangeDateDB = (e) => {
    e.preventDefault();
    setDateDB(e.target.value);
  };

  const onChangeSelectTuyen = (value) => {
    value != null ? setIdTuyen(value.powerline_id) : setIdTuyen("");
  };

  const onChangeSelectUAV = (e) => {
    setUAVname(e.target.value);
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
        powerline_id: idTuyen,
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
          "X-CSRFToken": csrfToken,
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
