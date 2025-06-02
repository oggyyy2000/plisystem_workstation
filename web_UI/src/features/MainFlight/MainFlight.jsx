import React from "react";
import { toast } from "react-toastify";
import { resetHasShownLostConnectionToServerToast } from "../../utils/customAxios";
import { useState, useEffect, useContext, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { WSContext } from "../../components/context/WSContext";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

import * as JobticketService from "../../APIServices/JobticketService";
import * as PowerlineService from "../../APIServices/PowerlineService";
import * as FlightTypeService from "../../APIServices/FlightTypeService";
import * as CheckDeviceService from "../../APIServices/CheckDeviceService";
import * as SupervisionStreamingService from "../../APIServices/SupervisionStreamingService";
import * as TicketTypeService from "../../APIServices/TicketTypeService";

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
  Fab,
} from "@mui/material";

import CameraAltIcon from "@mui/icons-material/CameraAlt";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import CloseIcon from "@mui/icons-material/Close";
import NoteAddIcon from "@mui/icons-material/NoteAdd";

import "./css/MainFlight.css";
import Loading from "../../components/LoadingPage/LoadingPage";
import MainFlightDefectList from "./MainFlightDefectList";
import MainFlightInMission from "./MainFlightInMission";
import MainFlightMap from "./MainFlightMap";
import MainFlightDialogAfterFly from "./MainFlightDialogAfterFly";
import FlightManageReportInformation from "../FlightManage/FlightManageModal/FlightManageReportInformation";
import ImageZoomDiaglog from "../../components/CommonDialog/ImageZoomDiaglog";

const MainFlight = () => {
  const [open, setOpen] = useState(true);
  const [openCreateNewTicket, setOpenCreateNewTicket] = useState(false);
  const [openReportInformationDialog, setOpenReportInformationDialog] =
    useState(false);
  const [openZoomingImg, setOpenZoomingImg] = useState("");

  // modal after fly variable
  const [flightComplete, setFlightComplete] = useState(false);
  const [getMissionAndScheduleId, setGetMissionAndScheduleId] = useState("");

  // common variable
  const [startFly, setStartFly] = useState(false);
  const [startFillingDefectMission, setStartFillingDefectMission] =
    useState(false);
  const [currentVT, setCurrentVT] = useState("");
  const [DefectInfo, setDefectInfo] = useState([]);
  const [currentLocation, setCurrentLocation] = useState({});
  const [choosedIdTuyen, setChoosedIdTuyen] = useState("");
  const [defectBoxCoordinate, setDefectBoxCoordinate] = useState([]);
  console.log("defectBoxCoordinate: ", defectBoxCoordinate);
  const [minMaxThermal, setMinMaxThermal] = useState({});

  //check change variable
  const [hadSubmited, setHadSubmited] = useState(false);
  const [hadSubmitedNewTicket, setHadSubmitedNewTicket] = useState(false);
  const [errorCharactersNewTicketDocNo, setErrorCharactersNewTicketDocNo] =
    useState(false);
  const [errorCharactersNewTicketUAVName, setErrorCharactersNewTicketUAVName] =
    useState(false);

  // jobticket
  const [jobTicketData, setJobTicketData] = useState(null);
  console.log(jobTicketData);

  const [ticketInfo, setTicketInfo] = useState({});
  console.log("ticketInfo:", ticketInfo);

  const [DateDB, setDateDB] = useState(null);
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
  const [ticketTypeOptions, setTicketTypeOptions] = useState([]);

  //map variable
  const [zoom, setZoom] = useState(16);
  const [streetLine, setStreetLine] = useState([]);
  const [center, setCenter] = useState({
    lat: 21.002890438729345,
    lng: 105.86171273377768,
  });

  // WS variable
  const { ws, connect, disconnect } = useContext(WSContext);
  const [message, setMessage] = useState([]);
  console.table("message: ", message.length);
  const [stompClient, setStompClient] = useState(null);
  const [logDataSendToServer, setLogDataSendToServer] = useState([]);
  console.log("logDataSendToServer: ", logDataSendToServer);
  const [currentDefectReceivedLength, setCurrentDefectReceivedLength] =
    useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const dispatch = useDispatch();

  const location = useLocation();

  useEffect(() => {
    resetHasShownLostConnectionToServerToast();
  }, [location]);

  useEffect(() => {
    connect();
  }, [connect]);

  const connectSockJS = () => {
    const socket = new SockJS(process.env.REACT_APP_STOMP_WS_URL);
    const client = Stomp.over(socket);
    client.connect({}, () => {
      console.log("Connected to WebSocket server.");
      setIsConnected(true);
      client.subscribe("/topic/public", (message) => {
        const receivedMessage = JSON.parse(message.body);
        setMessage((prevMessage) => [...prevMessage, receivedMessage]);
      });
    });
    setStompClient(client);
  };

  const disconnectSockJS = useCallback(() => {
    if (stompClient) {
      stompClient.disconnect(() => {
        console.log("Disconnected from WebSocket server.");
        setIsConnected(false);
      });
    }
  }, [stompClient]);

  const sendMessageToSockJS = useCallback(
    (message) => {
      if (stompClient && isConnected) {
        if (stompClient.connected) {
          stompClient.send(
            "/app/chat.sendMessage",
            {},
            JSON.stringify(message)
          );
        } else {
          console.error("WebSocket connection is not established.");
        }
      }
    },
    [stompClient, isConnected]
  );

  useEffect(() => {
    connectSockJS();
  }, []);

  useEffect(() => {
    const getJobTicket = async () => {
      const response = await JobticketService.getData({
        jobTicketEndpoint: `${
          DateDB ? `jobticket/?date=${DateDB}` : `jobticket/`
        }`,
      });
      if (response) {
        setJobTicketData(response);
      }
    };
    if (open === true) {
      getJobTicket();
    }
  }, [DateDB, open]);

  useEffect(() => {
    const getRouteNameOptions = async () => {
      const response = await PowerlineService.getAllData();
      if (response) {
        setNewTicketNameTuyen(response);
      }
    };
    getRouteNameOptions();
  }, []);

  useEffect(() => {
    const getFlightTypeOptions = async () => {
      const response = await FlightTypeService.getData();
      if (response) {
        setSuperviseTypeOptions(response);
      }
    };
    getFlightTypeOptions();
  }, [idFormReport]);

  useEffect(() => {
    const getTicketTypeOptions = async () => {
      const response = await TicketTypeService.getData();
      if (response) {
        setTicketTypeOptions(response);
      }
    };
    if (openCreateNewTicket) getTicketTypeOptions();
  }, [openCreateNewTicket]);

  useEffect(() => {
    try {
      if (!ws.current) return;
      ws.current.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.data_state === "supervise_complete" && !data.notification) {
          setGetMissionAndScheduleId(data.data);
          setFlightComplete(true);
          setStartFly(false);
          dispatch({ type: actions.FlyMissionStart, data: false });
          setHadSubmited(false);
          setHadSubmitedNewTicket(false);
          setCurrentDefectReceivedLength(0);
          setLogDataSendToServer([]);
          disconnect();
          disconnectSockJS();
        } else if (
          data.data_state === "supervise_complete" &&
          data.notification
        ) {
          toast.warning(data.notification);
          setGetMissionAndScheduleId(data.data);
          setFlightComplete(true);
          setStartFly(false);
          dispatch({ type: actions.FlyMissionStart, data: false });
          setHadSubmited(false);
          setHadSubmitedNewTicket(false);
          setCurrentDefectReceivedLength(0);
          setLogDataSendToServer([]);
          disconnect();
          disconnectSockJS();
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
          setZoom(16);
          let defectName;
          if (defectWS.length > 0) {
            setDefectInfo(defectWS);
          }
          if (defectWS.length - currentDefectReceivedLength === 1) {
            defectName = defectWS[defectWS.length - 1].defect_name;
            setCurrentDefectReceivedLength(currentDefectReceivedLength + 1);
          } else if (defectWS.length - currentDefectReceivedLength === 0) {
            defectName = null;
          }

          // gui ve may chu
          const chatMessage = {
            docId: docNoID,
            locationName: VT,
            uav: selectedTicket ? selectedTicket.flycam : newTicketUAVName,
            messageType: "SEND",
            longitude: parseFloat(gis.longtitude),
            latitude: parseFloat(gis.latitude),
            altitude: parseFloat(gis.altitude),
            warning: defectName,
          };

          // tong hop thanh log chatmessage gui ve cho may chu
          setLogDataSendToServer((prev) => [...prev, chatMessage]);
          if (stompClient) {
            sendMessageToSockJS(chatMessage);
          }
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
    disconnectSockJS,
    sendMessageToSockJS,
    selectedTicket,
    newTicketUAVName,
    currentDefectReceivedLength,
    message,
    message.length,
    dispatch,
  ]);

  // ---------- Add Info for mission dialog ----------

  const handleClickOpen = () => {
    // disconnect();
    connect();
    connectSockJS();
    // reconnectSockJS();
    setOpen(true);
    setStartFly(false);
    dispatch({ type: actions.FlyMissionStart, data: false });
    setFlightComplete(false);
    setHadSubmited(false);
    setDateDB(null);
    setIdFormReport("");
    setSuperviseType("");
    setCurrentLocation({});
    setZoom(16);
    setDefectInfo([]);
    setStreetLine([]);
  };

  const handleRefresh = () => {
    setStartFly(false);
    dispatch({ type: actions.FlyMissionStart, data: false });
    setFlightComplete(false);
    setHadSubmited(false);
    setDateDB(null);
    setIdFormReport("");
    setSuperviseType("");
    setCurrentLocation({});
    setZoom(16);
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
    disconnectSockJS();
  };

  const handleUpdateLatestMission = async () => {
    const response = await JobticketService.postData();

    if (response && response === "update success") {
      toast.success("Nhiệm vụ mới nhất đã được cập nhật !");
    }
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
                    <MenuItem>Chưa có dữ liệu</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Box>
            <Box className="add-mission-dialog__form-id-textfield">
              <FormControl
                disabled={
                  jobTicketData && jobTicketData.data_ticket && DateDB
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
                  {jobTicketData && jobTicketData.data_ticket && DateDB ? (
                    jobTicketData.data_ticket.map((data) => (
                      <MenuItem value={data.ticket_id}>
                        {data.docNo} ({data.type})
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem>Chưa chọn ngày</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Box>

            <Box className="add-mission-dialog__select-tuyen-form">
              {selectedTicket ? (
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
                <TextField
                  fullWidth
                  disabled
                  label="Tên thiết bị bay"
                  value={selectedTicket.flycam}
                />
              ) : (
                <TextField
                  fullWidth
                  disabled
                  label="Tên thiết bị bay"
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
                  {selectedTicket &&
                    (selectedTicket.type === "KT02" ||
                      selectedTicket.type === "KT04") && (
                      <MenuItem value={"completeFormOnly"}>
                        điền thông tin phiếu
                      </MenuItem>
                    )}
                  {superviseTypeOptions.length > 0 ? (
                    superviseTypeOptions.map((options) => (
                      <MenuItem value={options}>{options}</MenuItem>
                    ))
                  ) : (
                    <MenuItem>Chưa có dữ liệu</MenuItem>
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
              {!DateDB && superviseType === "" ? (
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
                  {/* <MenuItem value={"D"}>Ngày</MenuItem>
                  <MenuItem value={"N"}>Đêm</MenuItem>
                  <MenuItem value={"F"}>Sửa chữa</MenuItem> */}
                  {ticketTypeOptions.length > 0 ? (
                    ticketTypeOptions.map((options) => (
                      <MenuItem value={options}>{options}</MenuItem>
                    ))
                  ) : (
                    <MenuItem>Chưa có dữ liệu</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Box>
            <Box className="add-mission-dialog__select-tuyen-form">
              {/* <FormControl fullWidth>
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
              </FormControl> */}
              <TextField
                fullWidth
                label="Phương thức kiểm tra"
                defaultValue={""}
                value={newTicketMethodInspect}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => setNewTicketMethodInspect(e.target.value)}
              />
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
                  {newTicketType &&
                    (newTicketType === "KT02" || newTicketType === "KT04") && (
                      <MenuItem value={"completeFormOnly"}>
                        điền thông tin phiếu
                      </MenuItem>
                    )}
                  {superviseTypeOptions.length > 0 ? (
                    superviseTypeOptions.map((options) => (
                      <MenuItem value={options}>{options}</MenuItem>
                    ))
                  ) : (
                    <MenuItem>Chưa có dữ liệu</MenuItem>
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

  const buttonUsageInstructions = () => {
    return (
      <>
        <div className="add-mission-dialog_btn-usage-instruction-container">
          <div className="add-mission-dialog_btn-usage-instruction-item">
            <span className="add-mission-dialog_btn-usage-instruction-label">
              Nhấn phím <span style={{ color: "red" }}>Q</span> để kết thúc
            </span>
            <span className="add-mission-dialog_btn-usage-instruction-icon">
              <EventBusyIcon />
            </span>
          </div>

          <div className="add-mission-dialog_btn-usage-instruction-item">
            <span className="add-mission-dialog_btn-usage-instruction-label">
              Nhấn phím <span style={{ color: "red" }}>S</span> để chụp ảnh
            </span>
            <span className="add-mission-dialog_btn-usage-instruction-icon">
              <CameraAltIcon />
            </span>
          </div>
        </div>
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
    setSuperviseType("");
  };

  const onChangeDateDB = (e) => {
    e.preventDefault();
    setDateDB(e.target.value);
  };

  const onChangeSelectSuperviseType = (e) => {
    e.preventDefault();
    setSuperviseType(e.target.value);
  };

  const handleSubmitInfoBeforeFly = async (e) => {
    e.preventDefault();
    setHadSubmited(true);

    if (selectedTicket.type === "KT01" || selectedTicket.type === "KT03") {
      const response = await CheckDeviceService.getData({
        errorFromWhere: "handleSubmitInfoBeforeFlyError: ",
      });
      if (response) {
        toast.success(response);
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
              manual_create: "Flase",
            })
          );
        }
        console.log("Info Before Fly: ", formData);

        getConfirmedDataFromWS(formData);
      } else {
        handleRefresh();
      }
    } else if (
      selectedTicket.type === "KT02" ||
      selectedTicket.type === "KT04"
    ) {
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
            manual_create: "Flase",
          })
        );
      }
      console.log("Info Before Fly: ", formData);
      getConfirmedDataFromWS(formData);
    }
  };

  const handleSubmitInfoOfCreateNewTicket = async (e) => {
    e.preventDefault();

    if (newTicketType === "KT01" || newTicketType === "KT03") {
      const response = await CheckDeviceService.getData({
        errorFromWhere: "handleSubmitInfoOfCreateNewTicketError: ",
      });
      console.log("Info Of Create New Ticket:", response);
      if (response) {
        toast.success(response);
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
            manual_create: "True",
          })
        );
        console.log("newticket: ", formData);

        getConfirmedDataFromWS(formData);
      } else {
        handleRefreshNewTicket();
      }
    } else if (newTicketType === "KT02" || newTicketType === "KT04") {
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
          manual_create: "True",
        })
      );
      console.log("newticket: ", formData);
      getConfirmedDataFromWS(formData);
    }
  };

  const sendConfirmedDataToWS = (data) => {
    if (!ws.current) return;
    ws.current.send(JSON.stringify(data));
    setOpenCreateNewTicket(false);
    setOpen(false);
  };

  const getConfirmedDataFromWS = async (formData) => {
    const type =
      ((selectedTicket &&
        (selectedTicket.type === "KT01" || selectedTicket.type === "KT03")) ||
        newTicketType === "KT01" ||
        newTicketType === "KT03") &&
      "data";
    const response = await SupervisionStreamingService.postData({
      data: formData,
      options: {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    });
    if (response) {
      console.log("ConfirmedDataFromWS: ", response);
      if (
        (selectedTicket &&
          (selectedTicket.type === "KT01" || selectedTicket.type === "KT03")) ||
        (newTicketType &&
          (newTicketType === "KT01" || newTicketType === "KT03"))
      ) {
        setChoosedIdTuyen(response[type].powerline_id);
        sendConfirmedDataToWS(response[type]);
      } else if (
        (selectedTicket &&
          (selectedTicket.type === "KT02" || selectedTicket.type === "KT04")) ||
        (newTicketType &&
          (newTicketType === "KT02" || newTicketType === "KT04"))
      ) {
        setTicketInfo(response);
        setOpenCreateNewTicket(false);
        setOpen(false);
        setStartFillingDefectMission(true);
        setHadSubmited(false);
        setOpenReportInformationDialog(true);
      }
    }
  };

  // const sendStompMessage = () => {
  //   const chatMessage = {
  //     docId: 21,
  //     locationName: "VT92",
  //     uav: "UAV.x01",
  //     messageType: "SEND",
  //     longitude: 105.856838,
  //     latitude: 20.974747,
  //     altitude: 38,
  //     warning: null,
  //   };

  //   stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
  // };

  return (
    <>
      <div className="mainflight-container">
        {/* btn update latest mission */}
        <Fab
          variant="contained"
          color="primary"
          style={{
            visibility: startFly ? "hidden" : "visible",
            position: "absolute",
            right: 5,
            top: 75,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
          title="Cập nhật phiếu kiểm tra mới nhất"
          disabled={!jobTicketData ? true : false}
          onClick={handleUpdateLatestMission}
        >
          <NoteAddIcon />
        </Fab>

        {/* Modal Addmission*/}
        {AddMissionDialog()}

        {startFly && buttonUsageInstructions()}
        {/* <Button variant="outlined" onClick={() => sendStompMessage()}>
          Send Stomp Message
        </Button> */}

        {startFillingDefectMission && ticketInfo && (
          <FlightManageReportInformation
            ticketInfo={ticketInfo}
            setTicketInfo={setTicketInfo}
            scheduleId={ticketInfo.schedule_id}
            supervisionStatus={"not_done"}
            typeTicket={ticketInfo.type}
            openReportInformationDialog={openReportInformationDialog}
            setOpenReportInformationDialog={setOpenReportInformationDialog}
          />
        )}

        <MainFlightDefectList
          startfly={startFly}
          defectInfo={DefectInfo}
          superviseType={superviseType ? superviseType : newTicketFlyType}
          setOpenZoomingImg={setOpenZoomingImg}
        />

        {openZoomingImg && (
          <ImageZoomDiaglog
            info={openZoomingImg}
            openZoomingImg={openZoomingImg}
            setOpenZoomingImg={setOpenZoomingImg}
          />
        )}

        <MainFlightInMission
          startfly={startFly}
          currentvt={currentVT}
          currentlocation={currentLocation}
          superviseType={superviseType ? superviseType : newTicketFlyType}
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
          openZoomingImg={openZoomingImg}
          setOpenZoomingImg={setOpenZoomingImg}
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
