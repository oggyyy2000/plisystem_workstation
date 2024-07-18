import React from "react";
import { useState, useEffect, useContext, useRef } from "react";
import { WSContext } from "../../components/context/WSContext";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

import axios from "axios";

import { useDispatch } from "react-redux";
import * as actions from "../../redux/types";

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
import CloseIcon from "@mui/icons-material/Close";

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
  const [openCreateNewTicket, setOpenCreateNewTicket] = useState(false);

  // modal after fly variable
  const [flightComplete, setFlightComplete] = useState(false);
  const [getMissionAndScheduleId, setGetMissionAndScheduleId] = useState("");

  // common variable
  const [startFly, setStartFly] = useState(false);
  const [currentVT, setCurrentVT] = useState("");
  const [DefectInfo, setDefectInfo] = useState([]);
  // const [defectName, setDefectName]= useState(null)
  const [currentLocation, setCurrentLocation] = useState({});
  const [choosedIdTuyen, setChoosedIdTuyen] = useState("");
  const [defectBoxCoordinate, setDefectBoxCoordinate] = useState([]);
  const [minMaxThermal, setMinMaxThermal] = useState({});

  //check change variable
  const [hadSubmited, setHadSubmited] = useState(false);
  const [hadSubmitedNewTicket, setHadSubmitedNewTicket] = useState(false);
  const [hasInternet, setHasInternet] = useState(false);
  const isOnlineRef = useRef(true);
  const [errorCharactersNewTicketDocNo, setErrorCharactersNewTicketDocNo] =
    useState(false);
  const [errorCharactersNewTicketUAVName, setErrorCharactersNewTicketUAVName] =
    useState(false);
  const checkDataStatus = useRef(false);

  // jobticket
  const [jobTicketData, setJobTicketData] = useState(null);
  console.log(jobTicketData);

  const [DateDB, setDateDB] = useState([]);
  console.log("DateDB: ", DateDB);
  const [idFormReport, setIdFormReport] = useState("");
  const [superviseTypeOptions, setSuperviseTypeOptions] = useState([]);
  const [superviseType, setSuperviseType] = useState("");
  console.log(superviseType);

  const selectedTicket = jobTicketData
    ? jobTicketData.data_ticket.find(
        (ticket) => ticket.ticket_id === idFormReport
      )
    : null;
  console.log(selectedTicket);

  // create new ticket variable
  var dt = new Date();
  var date = `${dt.getFullYear().toString().padStart(4, "0")}-${(
    dt.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${dt.getDate().toString().padStart(2, "0")}`;
  const values = {
    someDate: date,
  };

  const [newTicketDate, setNewTicketDate] = useState(date);
  const [newTicketDocNo, setNewTicketDocNo] = useState("");
  const [newTicketType, setNewTicketType] = useState("");
  const [newTicketNameTuyen, setNewTicketNameTuyen] = useState([]);
  const [newTicketIdTuyen, setNewTicketIdTuyen] = useState("");
  const [newTicketMethodInspect, setNewTicketMethodInspect] = useState("");
  const [newTicketFlyType, setNewTicketFlyType] = useState("");
  const [newTicketUAVName, setNewTicketUAVName] = useState("");

  //map variable
  const [notifyMessage, setNotifyMessage] = useState({});
  const [zoom, setZoom] = useState(17);
  const [streetLine, setStreetLine] = useState([]);
  const [center, setCenter] = useState({
    lat: 21.002890438729345,
    lng: 105.86171273377768,
  });
  // const [poleCoordinates, setPoleCoordinates] = useState({});
  // console.log(poleCoordinates);
  // const [polyline, setPolyline] = useState([]);
  // console.log(polyline);

  const { ws, connect, disconnect } = useContext(WSContext);
  const [message, setMessage] = useState([]);
  console.log(message);
  const [stompClient, setStompClient] = useState(null);
  const dispatch = useDispatch();

  const urlPostFlightInfo =
    process.env.REACT_APP_API_URL + "supervisionstreaming/";

  useEffect(() => {
    connect();
  }, [connect]);

  useEffect(() => {
    const handleOnline = () => {
      setHasInternet(true);
      if (!isOnlineRef.current) {
        // Check if alert hasn't been shown yet
        alert("Có kết nối internet");
        isOnlineRef.current = true;
      }
    };

    const handleOffline = () => {
      setHasInternet(false);
      if (isOnlineRef.current) {
        // Check if alert was shown previously
        alert("Không có kết nối internet");
        isOnlineRef.current = false;
      }
    };

    // Add event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check initial connection state and trigger appropriate function
    if (navigator.onLine) {
      handleOnline();
    } else {
      handleOffline();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []); // Empty dependency array ensures useEffect runs only once

  useEffect(() => {
    if (hasInternet === true && checkDataStatus.current === false) {
      const postJobTicket = async () => {
        // Adjust the URL based on your actual API endpoint
        const postJobTicket = process.env.REACT_APP_API_URL + "jobticket/";

        // Perform the POST request without sending any content
        const postResponse = await axios.post(postJobTicket);

        // Handle the response if needed
        console.log("POST Response:", postResponse.data);

        // If response.data contains updated data, continue with GET request
        if (postResponse.data === "update success") {
          checkDataStatus.current = true;
          // const getJobTicket =
          //   process.env.REACT_APP_API_URL +
          //   `${DateDB.length > 0 ? `jobticket/?date=${DateDB}` : `jobticket/`}`;
          // console.log(getJobTicket);
          // const getResponse = await axios.get(getJobTicket);

          // // Handle the GET response and update state if needed
          // console.log("GET Response:", getResponse.data);
          // setJobTicketData(getResponse.data);
        }
      };

      // Call the function on component mount
      postJobTicket();
    }

    if (hasInternet === true && checkDataStatus.current === true) {
      try {
        const getJobTicketWithInternetAlreadyPost = async () => {
          const getJobTicket =
            process.env.REACT_APP_API_URL +
            `${DateDB.length > 0 ? `jobticket/?date=${DateDB}` : `jobticket/`}`;
          console.log(getJobTicket);
          const getResponse = await axios.get(getJobTicket);

          // Handle the GET response and update state if needed
          console.log("GET Response:", getResponse.data);
          setJobTicketData(getResponse.data);
        };

        getJobTicketWithInternetAlreadyPost();
      } catch (error) {
        console.log(error);
      }
    }

    if (hasInternet === false) {
      try {
        const getJobTicketWithOutInternet = async () => {
          const getJobTicket =
            process.env.REACT_APP_API_URL +
            `${DateDB.length > 0 ? `jobticket/?date=${DateDB}` : `jobticket/`}`;
          console.log(getJobTicket);
          const getResponse = await axios.get(getJobTicket);

          // Handle the GET response and update state if needed
          console.log("GET Response:", getResponse.data);
          setJobTicketData(getResponse.data);
        };

        getJobTicketWithOutInternet();
      } catch (error) {
        console.log(error);
      }
    }
  }, [DateDB, hasInternet]);

  // useEffect(() => {
  //   if (hadSubmited === true ) {
  //     const checkDeviceConnect = async () => {
  //       try {
  //         const getCheckDeviceConnect =
  //           process.env.REACT_APP_API_URL + "checkdevice/";
  //         const getResponse = await axios.get(getCheckDeviceConnect);

  //         // Handle the GET response and update state if needed
  //         console.log("GET Response:", getResponse.data);
  //         if (getResponse.status === 200) {
  //           const formData = new FormData();

  //           if (selectedTicket) {
  //             formData.append(
  //               "data",
  //               JSON.stringify({
  //                 docNo: selectedTicket.docNo,
  //                 type: selectedTicket.type,
  //                 implementation_date: DateDB,
  //                 powerline_id: selectedTicket.powerline_id_id,
  //                 flycam: selectedTicket.flycam,
  //                 methodInspect: selectedTicket.methodInspect,
  //                 supervise_type: superviseType,
  //               })
  //             );
  //           }
  //           console.log("existticket: ", formData);

  //           sendPostRequest(formData);
  //         }
  //       } catch (error) {
  //         alert(error.response.data);
  //         handleRefresh();
  //       }
  //     };

  //     checkDeviceConnect();
  //   }
  // }, [
  //   hadSubmited,
  //   selectedTicket,
  //   DateDB,
  //   superviseType,
  // ]);

  // useEffect(() => {
  //   if (hadSubmited === true || hadSubmitedNewTicket === true) {
  //     const checkSupportModel = async () => {
  //       try {
  //         const UrlCheckSupportModel =
  //           process.env.REACT_APP_API_URL +
  //           `checkmodelsupport/?powerline_id=${selectedTicket.powerline_id_id}&supervise_type=${superviseType}`;

  //         const getResponse = await axios.get(UrlCheckSupportModel);

  //         if (getResponse.status === 200) {
  //           console.log("ok");
  //         }
  //       } catch (error) {
  //         alert("model not found");
  //         handleRefresh();
  //       }
  //     };

  //     checkSupportModel();
  //   }
  // }, [selectedTicket, hadSubmited, superviseType, hadSubmitedNewTicket]);

  useEffect(() => {
    const powerlines = process.env.REACT_APP_API_URL + "powerline/";

    axios
      .get(powerlines)
      .then((res) => {
        console.log("data:", res.data);
        setNewTicketNameTuyen(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const getFlightType = process.env.REACT_APP_API_URL + "flighttype/";
    axios
      .get(getFlightType)
      .then((response) => {
        console.log(response.data);
        setSuperviseTypeOptions(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [idFormReport]);

  // useEffect(() => {
  //   const getCoordinatesPole = async () => {
  //     try {
  //       const urlGetPoleCoordinate =
  //         process.env.REACT_APP_API_URL +
  //         "powerlinelocation/?powerline_id=" +
  //         choosedIdTuyen;
  //       const responseData = await axios.get(urlGetPoleCoordinate);
  //       setPoleCoordinates(responseData.data);
  //       console.log(responseData.data);
  //       const coordinatesPolyline =
  //         responseData.data &&
  //         responseData.data.map((data) => {
  //           console.log("data: ", data);
  //           const [latitude, longtitude] = data.coordinates.split(",");
  //           return {
  //             lat: parseFloat(latitude),
  //             lng: parseFloat(longtitude),
  //           };
  //         });
  //       setPolyline(coordinatesPolyline);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   if (powerlineId !== "") getCoordinatesPole();
  // }, [powerlineId]);

  useEffect(() => {
    try {
      if (!ws.current) return;
      ws.current.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.data_state === "supervise_complete") {
          console.log(data.data);
          setGetMissionAndScheduleId(data.data);
          setFlightComplete(true);
          setStartFly(false);
          dispatch({ type: actions.FlyMissionStart, data: false });
          setHadSubmited(false);
          setHadSubmitedNewTicket(false);
          disconnect();
          stompClient.disconnect();
        }
        console.log("data:", data);
        const gis = data.data.gis;
        const defectWS = data.data.defects;
        const defectBox = data.data.defect_boxes;
        const minMaxThermal = data.data.frame_thermal;
        setDefectBoxCoordinate(defectBox);
        setMinMaxThermal(minMaxThermal);

        const VT = data.data.location;
        setCurrentVT(VT);
        const docNoID = data.data.docNo_id;

        if (gis !== undefined) {
          setStartFly(true);
          dispatch({ type: actions.FlyMissionStart, data: true });
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
          let defectName;
          if (defectWS.length > 0) {
            setDefectInfo(defectWS);
            defectName = defectWS[defectWS.length - 1].defect_name;
          }

          // gui ve may chu
          const chatMessage = {
            docId: docNoID, //TODO
            locationName: VT,
            uav: selectedTicket.flycam,
            // type: selectedTicket.type,
            messageType: "SEND",
            // doc: selectedTicket.docNo,
            longitude: parseFloat(gis.longtitude),
            latitude: parseFloat(gis.latitude),
            altitude: parseFloat(gis.altitude),
            warning:
              !notifyMessage[VT] ||
              !notifyMessage[VT].find((nm) => nm === defectName)
                ? defectName
                : null,
          };

          if (defectName) {
            if (!notifyMessage[VT]) {
              setNotifyMessage({
                ...notifyMessage,
                [VT]: [defectName],
              });
            } else if (!notifyMessage[VT].find((nm) => nm === defectName)) {
              setNotifyMessage({
                ...notifyMessage,
                [VT]: [...notifyMessage[VT], defectName],
              });
            }
          }

          stompClient.send(
            "/app/chat.sendMessage",
            {},
            JSON.stringify(chatMessage)
          );
        }
      };
    } catch (e) {
      console.log(e);
    }
  }, [
    startFly,
    streetLine,
    ws,
    disconnect,
    stompClient,
    selectedTicket,
    notifyMessage,
    dispatch,
  ]);

  useEffect(() => {
    const socket = new SockJS("http://eps.elz.vn:8005/api/a/powerline/ws");
    const client = Stomp.over(socket);
    client.connect({}, () => {
      client.subscribe("/topic/public", (message) => {
        const receivedMessage = JSON.parse(message.body);
        setMessage((prevMessage) => [...prevMessage, receivedMessage]);
      });
    });
    setStompClient(client);
  }, []);

  // ---------- Add Info for mission dialog ----------

  const handleClickOpen = () => {
    disconnect();
    connect();
    setOpen(true);
    setStartFly(false);
    dispatch({ type: actions.FlyMissionStart, data: false });
    setFlightComplete(false);
    setHadSubmited(false);
    setDateDB([]);
    setIdFormReport("");
    setSuperviseType("");
    setCurrentLocation({});
    setZoom(17);
    setDefectInfo([]);
    setStreetLine([]);
  };

  const handleRefresh = () => {
    setStartFly(false);
    dispatch({ type: actions.FlyMissionStart, data: false });
    setFlightComplete(false);
    setHadSubmited(false);
    setDateDB([]);
    setIdFormReport("");
    setSuperviseType("");
    setCurrentLocation({});
    setZoom(17);
    setDefectInfo([]);
    setStreetLine([]);
  };

  const handleRefreshNewTicket = () => {
    setNewTicketDocNo("");
    setNewTicketType("");
    setNewTicketIdTuyen("");
    setNewTicketMethodInspect("");
    setNewTicketFlyType("");
    setNewTicketUAVName("");
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
            sx={{ padding: "20px 24px !important", overflowY: "auto" }}
          >
            <Box className="add-mission-dialog__select-date-textfield">
              <FormControl fullWidth>
                <InputLabel>Ngày kiểm tra</InputLabel>
                <Select
                  value={DateDB}
                  label="Ngày kiểm tra"
                  onChange={onChangeDateDB}
                  defaultValue={""}
                >
                  {jobTicketData && jobTicketData.ticket_date_all ? (
                    jobTicketData.ticket_date_all.map((date) => (
                      <MenuItem value={date}>{date}</MenuItem>
                    ))
                  ) : (
                    <>Chưa có dữ liệu</>
                  )}
                </Select>
              </FormControl>
            </Box>
            <Box className="add-mission-dialog__form-id-textfield">
              <FormControl
                disabled={
                  jobTicketData &&
                  jobTicketData.data_ticket &&
                  DateDB.length > 0
                    ? false
                    : true
                }
                fullWidth
              >
                <InputLabel>Phiếu kiểm tra</InputLabel>
                <Select
                  value={idFormReport}
                  label="Phiếu kiểm tra"
                  onChange={onChangeFormId}
                  defaultValue={""}
                >
                  {jobTicketData &&
                  jobTicketData.data_ticket &&
                  DateDB.length > 0 ? (
                    jobTicketData.data_ticket.map((data) => (
                      <MenuItem value={data.ticket_id}>
                        {data.docNo} ({data.type === "D" ? "Ngày" : "Đêm"})
                      </MenuItem>
                    ))
                  ) : (
                    <>Chưa chọn ngày</>
                  )}
                </Select>
              </FormControl>
            </Box>

            <Box className="add-mission-dialog__select-tuyen-form">
              {selectedTicket ? (
                <>
                  <TextField
                    fullWidth
                    disabled
                    label="Tên tuyến kiểm tra"
                    value={
                      selectedTicket.powerline_id_id +
                      " " +
                      selectedTicket.powerline_name
                    }
                  />
                </>
              ) : (
                <TextField
                  fullWidth
                  disabled
                  label="Tên tuyến kiểm tra"
                  value={""}
                />
              )}
            </Box>
            <Box className="add-mission-dialog__select-UAV-form">
              {selectedTicket ? (
                <>
                  <TextField
                    fullWidth
                    disabled
                    label="Tên thiết bị bay"
                    value={selectedTicket.flycam}
                  />
                </>
              ) : (
                <TextField
                  fullWidth
                  disabled
                  label="Tên tuyến kiểm tra"
                  value={""}
                />
              )}
            </Box>
            <Box className="add-mission-dialog__select-superviseType-form">
              <FormControl fullWidth>
                <InputLabel>Kiểu giám sát</InputLabel>
                <Select
                  disabled={
                    selectedTicket && selectedTicket.flycam ? false : true
                  }
                  value={superviseType}
                  label="Kiểu giám sát"
                  onChange={onChangeSelectSuperviseType}
                  defaultValue={""}
                >
                  {/* <MenuItem value={"day"}>Dây</MenuItem>
                  <MenuItem value={"thietbi"}>Thiết bị</MenuItem>
                  <MenuItem value={"hanhlang"}>Hành lang</MenuItem>*/}
                  {superviseTypeOptions.length > 0 ? (
                    superviseTypeOptions.map((options) => (
                      <MenuItem value={options}>{options}</MenuItem>
                    ))
                  ) : (
                    <></>
                  )}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "16px 24px",
            }}
          >
            {createNewTicket()}

            <div>
              {DateDB.length === 0 && superviseType === "" ? (
                <Button
                  disabled={hadSubmited === true ? true : false}
                  onClick={() => handleClose()}
                  color="primary"
                >
                  Hủy
                </Button>
              ) : (
                <Button
                  disabled={hadSubmited === true ? true : false}
                  onClick={() => handleRefresh()}
                  color="primary"
                >
                  Chọn lại
                </Button>
              )}

              <Button
                color="primary"
                disabled={
                  superviseType === "" || hadSubmited === true ? true : false
                }
                onClick={handleSubmitInfoBeforeFly}
              >
                {hadSubmited === false ? "Xác nhận" : "Đang xử lý..."}
              </Button>
            </div>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  const createNewTicket = () => {
    return (
      <>
        <Button
          disabled={hadSubmited === true ? true : false}
          color="primary"
          onClick={() => setOpenCreateNewTicket(true)}
        >
          Tạo phiếu mới
        </Button>

        <Dialog
          open={openCreateNewTicket}
          fullWidth
          maxWidth={"sm"}
          hideBackdrop
          onClose={() => setOpenCreateNewTicket(false)}
        >
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
            <Button
              className="add-mission-dialog__btn-close"
              color="error"
              variant="contained"
              onClick={() => setOpenCreateNewTicket(false)}
            >
              <CloseIcon fontSize="small" />
            </Button>
            <span>Tạo phiếu kiểm tra mới</span>
          </DialogTitle>
          <DialogContent>
            <Box className="add-mission-dialog__select-date-textfield">
              <TextField
                fullWidth
                label="Ngày kiểm tra"
                type="date"
                value={newTicketDate}
                defaultValue={values.someDate}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => setNewTicketDate(e.target.value)}
              />
            </Box>
            <Box className="add-mission-dialog__select-date-textfield">
              <TextField
                fullWidth
                label="Tên phiếu kiểm tra"
                value={newTicketDocNo}
                error={errorCharactersNewTicketDocNo.characters}
                helperText={errorCharactersNewTicketDocNo.characters}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => handleInputNewTicketDocNo(e)}
              />
            </Box>

            <Box className="add-mission-dialog__select-tuyen-form">
              <Autocomplete
                options={newTicketNameTuyen}
                getOptionLabel={(option) => option.powerline_name}
                onChange={(event, newValue) => {
                  newValue != null
                    ? setNewTicketIdTuyen(newValue.powerline_id)
                    : setNewTicketIdTuyen("");
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Tên Tuyến" />
                )}
              />
            </Box>
            <Box className="add-mission-dialog__select-tuyen-form">
              <FormControl fullWidth>
                <InputLabel>Loại phiếu kiểm tra</InputLabel>
                <Select
                  value={newTicketType}
                  label="Loại phiếu kiểm tra"
                  onChange={(e) => setNewTicketType(e.target.value)}
                  defaultValue={""}
                >
                  <MenuItem value={"D"}>Ngày</MenuItem>
                  <MenuItem value={"N"}>Đêm</MenuItem>
                  <MenuItem value={"F"}>Sửa chữa</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box className="add-mission-dialog__select-tuyen-form">
              <FormControl fullWidth>
                <InputLabel>Phương thức kiểm tra</InputLabel>
                <Select
                  value={newTicketMethodInspect}
                  label="Phương thức kiểm tra"
                  onChange={(e) => setNewTicketMethodInspect(e.target.value)}
                  defaultValue={""}
                >
                  <MenuItem value={"định kỳ"}>định kỳ</MenuItem>
                  <MenuItem value={"test"}>test</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box className="add-mission-dialog__select-date-textfield">
              <TextField
                fullWidth
                label="Tên máy bay"
                value={newTicketUAVName}
                InputLabelProps={{
                  shrink: true,
                }}
                error={errorCharactersNewTicketUAVName.characters}
                helperText={errorCharactersNewTicketUAVName.characters}
                onChange={(e) => handleInputNewTicketUAVName(e)}
              />
            </Box>
            <Box className="add-mission-dialog__select-superviseType-form">
              <FormControl fullWidth>
                <InputLabel>Kiểu bay</InputLabel>
                <Select
                  value={newTicketFlyType}
                  label="Kiểu bay"
                  onChange={(e) => setNewTicketFlyType(e.target.value)}
                  defaultValue={""}
                >
                  {superviseTypeOptions.length > 0 ? (
                    superviseTypeOptions.map((options) => (
                      <MenuItem value={options}>{options}</MenuItem>
                    ))
                  ) : (
                    <></>
                  )}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions style={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              disabled={
                newTicketDocNo !== "" &&
                newTicketType !== "" &&
                newTicketNameTuyen.length > 0 &&
                newTicketIdTuyen !== "" &&
                newTicketMethodInspect !== "" &&
                newTicketFlyType !== "" &&
                newTicketUAVName !== ""
                  ? false
                  : true
              }
              onClick={(e) => handleSubmitInfoOfCreateNewTicket(e)}
            >
              Gửi
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  const handleInputNewTicketDocNo = (e) => {
    const inputValue = e.target.value;
    setNewTicketDocNo(inputValue);
    const errors = {};

    // Kiểm tra độ dài
    if (inputValue.length < 1) {
      errors.characters = "Nhập ít nhất 2 ký tự";
    }

    // Kiểm tra ký tự đặc biệt
    const regexSpecialChar = /[^a-zA-Z0-9-_ ]/g;
    if (regexSpecialChar.test(inputValue)) {
      errors.characters =
        "Giá trị nhập vào không hợp lệ. Vui lòng nhập chuỗi chỉ chứa chữ cái, chữ số, dấu _ và -.";
    }

    // Kiểm tra khoảng trắng
    if (!/\S/.test(inputValue)) {
      errors.characters = "Không được nhập chỉ khoảng trắng";
    }

    // Set lỗi
    if (Object.keys(errors).length > 0) {
      setErrorCharactersNewTicketDocNo(errors);
      return;
    }

    // Nhập hợp lệ
    setErrorCharactersNewTicketDocNo(false);
  };

  const handleInputNewTicketUAVName = (e) => {
    const inputValue = e.target.value;
    setNewTicketUAVName(inputValue);
    const errors = {};

    // Kiểm tra độ dài
    if (inputValue.length < 1) {
      errors.characters = "Nhập ít nhất 2 ký tự";
    }

    // Kiểm tra ký tự đặc biệt
    const regexSpecialChar = /[^a-zA-Z0-9-_ ]/g;
    if (regexSpecialChar.test(inputValue)) {
      errors.characters =
        "Giá trị nhập vào không hợp lệ. Vui lòng nhập chuỗi chỉ chứa chữ cái, chữ số, dấu _ và -.";
    }

    // Kiểm tra khoảng trắng
    if (!/\S/.test(inputValue)) {
      errors.characters = "Không được nhập chỉ khoảng trắng";
    }

    // Set lỗi
    if (Object.keys(errors).length > 0) {
      setErrorCharactersNewTicketUAVName(errors);
      return;
    }

    // Nhập hợp lệ
    setErrorCharactersNewTicketUAVName(false);
  };

  const onChangeFormId = (e) => {
    e.preventDefault();
    setIdFormReport(e.target.value);
  };

  const onChangeDateDB = (e) => {
    e.preventDefault();
    setDateDB(e.target.value);
  };

  const onChangeSelectSuperviseType = (e) => {
    setSuperviseType(e.target.value);
  };

  const handleSubmitInfoBeforeFly = async (e) => {
    e.preventDefault();
    setHadSubmited(true);

    try {
      const getCheckDeviceConnect =
        process.env.REACT_APP_API_URL + "checkdevice/";
      const getResponse = await axios.get(getCheckDeviceConnect);

      // Handle the GET response and update state if needed
      console.log("GET Response:", getResponse.data);
      if (getResponse.status === 200) {
        const formData = new FormData();

        if (selectedTicket) {
          formData.append(
            "data",
            JSON.stringify({
              docNo: selectedTicket.docNo,
              type: selectedTicket.type,
              implementation_date: DateDB,
              powerline_id: selectedTicket.powerline_id_id,
              flycam: selectedTicket.flycam,
              methodInspect: selectedTicket.methodInspect,
              supervise_type: superviseType,
            })
          );
        }
        console.log("existticket: ", formData);

        sendPostRequest(formData);
      }
    } catch (error) {
      alert(error.response.data);
      handleRefresh();
    }
  };

  const handleSubmitInfoOfCreateNewTicket = async (e) => {
    e.preventDefault();

    try {
      const getCheckDeviceConnect =
        process.env.REACT_APP_API_URL + "checkdevice/";
      const getResponse = await axios.get(getCheckDeviceConnect);

      // Handle the GET response and update state if needed
      console.log("GET Response:", getResponse.data);
      if (getResponse.status === 200) {
        const formData = new FormData();

        formData.append(
          "data",
          JSON.stringify({
            docNo: newTicketDocNo,
            type: newTicketType,
            implementation_date: newTicketDate,
            powerline_id: newTicketIdTuyen,
            flycam: newTicketUAVName,
            methodInspect: newTicketMethodInspect,
            supervise_type: newTicketFlyType,
          })
        );
        console.log("newticket: ", formData);

        sendPostRequest(formData);
      }
    } catch (error) {
      alert(error.response.data);
      handleRefreshNewTicket();
    }
  };

  const sendInfo = (data) => {
    if (!ws.current) return;
    ws.current.send(JSON.stringify(data));
    setOpenCreateNewTicket(false);
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
      console.log("data WS: ", response.data);
      setChoosedIdTuyen(response.data.powerline_id);

      sendInfo(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // const sendStompMessage = () => {
  //   const chatMessage = {
  //     uav: "UAV.x01",
  //     type: "SEND",
  //     doc: "T87_2024-02-19_VT1_T87_VT20_T87",
  //     longitude: "21.046569",
  //     latitude: "105.803673",
  //     altitude: "21",
  //     warning: null,
  //   };

  //   stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
  // };

  return (
    <>
      <div>
        {/* Modal Addmission*/}
        {AddMissionDialog()}

        {/* <Button variant="outlined" onClick={() => sendStompMessage()}>
          Send Stomp Message
        </Button> */}

        <MainFlightDefectList
          startfly={startFly}
          currentvt={currentVT}
          defectInfo={DefectInfo}
        />
        <MainFlightInMission
          startfly={startFly}
          currentvt={currentVT}
          currentlocation={currentLocation}
          superviseType={superviseType}
          defectBoxCoordinate={defectBoxCoordinate}
          minMaxThermal={minMaxThermal}
        />

        <MainFlightMap
          centerGPS={center}
          zoom={zoom}
          currentLocation={currentLocation}
          defectInfo={DefectInfo}
          streetLine={streetLine}
          powerlineId={choosedIdTuyen}
          startFly={startFly}
        />

        <MainFlightDialogAfterFly
          flightComplete={flightComplete}
          getMissionAndScheduleId={getMissionAndScheduleId}
          docNo={selectedTicket ? selectedTicket.docNo : ""}
          typeTicket={selectedTicket ? selectedTicket.type : ""}
        />

        {!startFly && !open && (hadSubmited || hadSubmitedNewTicket) ? (
          <Loading startFly={startFly} />
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default MainFlight;
