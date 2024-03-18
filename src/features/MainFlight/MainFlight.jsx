import React from "react";
import { useState, useEffect, useContext, useRef } from "react";
import { WSContext } from "../../components/context/WSContext";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

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
  const [currentLocation, setCurrentLocation] = useState({});
  const [choosedIdTuyen, setChoosedIdTuyen] = useState("");

  //check change variable
  const [hadSubmited, setHadSubmited] = useState(false);
  const [hadSubmitedNewTicket, setHadSubmitedNewTicket] = useState(false);
  const [hasInternet, setHasInternet] = useState(false);
  const isOnlineRef = useRef(null);

  // jobticket
  const [jobTicketData, setJobTicketData] = useState(null);
  console.log(jobTicketData);

  const [DateDB, setDateDB] = useState([]);
  const [idFormReport, setIdFormReport] = useState("");
  const [superviseTypeOptions, setSuperviseTypeOptions] = useState([]);
  const [superviseType, setSuperviseType] = useState("");

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
  const [zoom, setZoom] = useState(17);
  const [streetLine, setStreetLine] = useState([]);
  const [center, setCenter] = useState({
    lat: 21.002890438729345,
    lng: 105.86171273377768,
  });

  const { ws, connect, disconnect } = useContext(WSContext);
  const [message, setMessage] = useState([]);
  console.log(message);
  const [stompClient, setStompClient] = useState(null);

  const urlPostFlightInfo =
    process.env.REACT_APP_API_URL + "supervisionstreaming/";

  // const urlCheckInternetConnection =
  //   process.env.REACT_APP_API_URL + "checkinternet/";

  useEffect(() => {
    connect();
  }, [connect]);

  // useEffect(() => {
  //   // can de y them !!
  //   const checkInternet = async () => {
  //     try {
  //       const urlCheckInternetConnection =
  //         process.env.REACT_APP_API_URL + "checkinternet/";
  //       const postResponse = await axios.get(urlCheckInternetConnection);
  //       if (postResponse.status === 200) {
  //         setHasInternet(true);
  //       }
  //     } catch (error) {
  //       // Handle errors
  //       setHasInternet(false);
  //       alert("Thiết bị không có kết nối internet !");
  //     }
  //   };
  //   checkInternet();
  // }, []);

  useEffect(() => {
    const isOnline = navigator.onLine;
    console.log("isOnline: ", isOnline);

    if (navigator.onLine) {
      setHasInternet(true);
      isOnlineRef.current = true;
      // alert("Có kết nối internet");
    } else {
      setHasInternet(false);
      isOnlineRef.current = false;
      // alert("Không có kết nối internet");
    }
  }, []);

  // useEffect(() => {
  //   const handleOnline = () => {
  //     setHasInternet(true);
  //     if (!isOnlineRef.current) { // Check if alert hasn't been shown yet
  //       alert("Có kết nối internet");
  //       isOnlineRef.current = true;
  //     }
  //   };

  //   const handleOffline = () => {
  //     setHasInternet(false);
  //     if (isOnlineRef.current) { // Check if alert was shown previously
  //       alert("Không có kết nối internet");
  //       isOnlineRef.current = false;
  //     }
  //   };

  //   // Add event listeners
  //   window.addEventListener('online', handleOnline);
  //   window.addEventListener('offline', handleOffline);

  //   // Check initial connection state and trigger appropriate function
  //   if (navigator.onLine) {
  //     handleOnline();
  //   } else {
  //     handleOffline();
  //   }

  //   return () => {
  //     window.removeEventListener('online', handleOnline);
  //     window.removeEventListener('offline', handleOffline);
  //   };
  // }, []); // Empty dependency array ensures useEffect runs only once

  

  useEffect(() => {
    if (hasInternet === true) {
      const postJobTicket = async () => {
        // Adjust the URL based on your actual API endpoint
        const postJobTicket = process.env.REACT_APP_API_URL + "jobticket/";

        // Perform the POST request without sending any content
        const postResponse = await axios.post(postJobTicket);

        // Handle the response if needed
        console.log("POST Response:", postResponse.data);

        // If response.data contains updated data, continue with GET request
        if (postResponse.data === "Updated data") {
          const getJobTicket =
            process.env.REACT_APP_API_URL +
            `${DateDB.length > 0 ? `jobticket/?date=${DateDB}` : `jobticket/`}`;
          console.log(getJobTicket);
          const getResponse = await axios.get(getJobTicket);

          // Handle the GET response and update state if needed
          console.log("GET Response:", getResponse.data);
          setJobTicketData(getResponse.data);
        }
      };

      // Call the function on component mount
      postJobTicket();
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
  //         // console.log("GET Response:", getResponse.data);
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
  //   hadSubmitedNewTicket,
  // ]);

  useEffect(() => {
    if (hadSubmited === true || hadSubmitedNewTicket === true) {
      const checkSupportModel = async () => {
        try {
          const UrlCheckSupportModel =
            process.env.REACT_APP_API_URL +
            `checkmodelsupport/?powerline_id=${selectedTicket.powerline_id_id}&supervise_type=${superviseType}`;

          const getResponse = await axios.get(UrlCheckSupportModel);

          if (getResponse.status === 200) {
            console.log("ok");
          }
        } catch (error) {
          alert("model not found");
          handleRefresh();
        }
      };

      checkSupportModel();
    }
  }, [selectedTicket, hadSubmited, superviseType, hadSubmitedNewTicket]);

  // useEffect(() => {
  //   const postJobTicket = async () => {
  //     try {
  //       // Adjust the URL based on your actual API endpoint
  //       const postJobTicket = process.env.REACT_APP_API_URL + "jobticket/";

  //       // Perform the POST request without sending any content
  //       const postResponse = await axios.post(postJobTicket);

  //       // Handle the response if needed
  //       console.log("POST Response:", postResponse.data);

  //       // If response.data contains updated data, continue with GET request
  //       if (postResponse.data === "Updated data") {
  //         const getJobTicket =
  //           process.env.REACT_APP_API_URL +
  //           `${DateDB.length > 0 ? `jobticket/?date=${DateDB}` : `jobticket/`}`;
  //         console.log(getJobTicket);
  //         const getResponse = await axios.get(getJobTicket);

  //         // Handle the GET response and update state if needed
  //         console.log("GET Response:", getResponse.data);
  //         setJobTicketData(getResponse.data);
  //       }
  //     } catch (error) {
  //       // Handle errors
  //       console.error("Error posting or getting job ticket:", error);
  //     }
  //   };

  //   // Call the function on component mount
  //   postJobTicket();
  // }, [DateDB]); // Empty dependency array to run the effect only on mount

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
  }, []);

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
          setHadSubmited(false);
          disconnect();
          stompClient.disconnect();
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
          let defectName;
          if (defectWS.length > 0) {
            setDefectInfo(defectWS);
            // Use forEach loop to overwrite defectName with each defect name
            defectWS.forEach((info) => {
              defectName = info.defect_name;
            });
          }
          console.log(defectName);

          // gui ve may chu
          // const chatMessage = {
          //   uav: selectedTicket.flycam,
          //   type: selectedTicket.type,
          //   messageType: "SEND",
          //   doc: selectedTicket.docNo,
          //   longitude: parseFloat(gis.longtitude),
          //   latitude: parseFloat(gis.latitude),
          //   altitude: parseFloat(gis.altitude),
          //   warning: defectName,
          // };

          // stompClient.send(
          //   "/app/chat.sendMessage",
          //   {},
          //   JSON.stringify(chatMessage)
          // );
        }
      };
    } catch (e) {
      console.log(e);
    }
  }, [startFly, streetLine, ws, disconnect, stompClient, selectedTicket]);

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
                disabled={DateDB.length > 0 ? false : true}
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
                <Button onClick={() => handleClose()} color="primary">
                  Hủy
                </Button>
              ) : (
                <Button onClick={() => handleRefresh()} color="primary">
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
        <Button color="primary" onClick={() => setOpenCreateNewTicket(true)}>
          Tạo phiếu mới
        </Button>

        <Dialog
          open={openCreateNewTicket}
          fullWidth
          maxWidth={"md"}
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
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => setNewTicketDocNo(e.target.value)}
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
                onChange={(e) => setNewTicketUAVName(e.target.value)}
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
            {/* <Button
              variant="contained"
              onClick={() => setOpenCreateNewTicket(false)}
            >
              Hủy
            </Button> */}
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

  const onChangeSelectSuperviseType = (e) => {
    setSuperviseType(e.target.value);
  };

  const handleSubmitInfoBeforeFly = (e) => {
    e.preventDefault();

    // try {
    //   const checkDeviceConnect = async () => {
    //     const getCheckDeviceConnect =
    //       process.env.REACT_APP_API_URL + "checkdevice/";
    //     const getResponse = await axios.get(getCheckDeviceConnect);

    //     // Handle the GET response and update state if needed
    //     // console.log("GET Response:", getResponse.data);
    //     if(getResponse.status === 503) {
    //       alert(getResponse.data)
    //     }
    //   };

    //   checkDeviceConnect();
    // } catch (error) {
    //   console.log(error);
    // }

    setHadSubmited(true);

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
  };

  const handleSubmitInfoOfCreateNewTicket = (e) => {
    e.preventDefault();
    setHadSubmitedNewTicket(true);

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
        />

        <MainFlightMap
          centerGPS={center}
          zoom={zoom}
          currentLocation={currentLocation}
          defectInfo={DefectInfo}
          streetLine={streetLine}
          powerlineId={choosedIdTuyen}
        />

        <MainFlightDialogAfterFly
          flightComplete={flightComplete}
          getMissionAndScheduleId={getMissionAndScheduleId}
          docNo={selectedTicket ? selectedTicket.docNo : ""}
          typeTicket={selectedTicket ? selectedTicket.type : ""}
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
