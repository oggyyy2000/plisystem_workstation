import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import {
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  ImageList,
  ImageListItem,
  FormControlLabel,
  Checkbox,
  TextField,
  DialogActions,
  Box,
  Typography,
  Tabs,
  Tab,
  // FormControl,
  // InputLabel,
  // Select,
  // MenuItem,
} from "@mui/material";
import PropTypes from "prop-types";

import CloseIcon from "@mui/icons-material/Close";
import CropFreeIcon from "@mui/icons-material/CropFree";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

import "../css/FlightManageModalMissionData.css";
import FlightManageZoomingDialog from "./FlightManageZoomingDialog";
// import FlightManageEditLabelDialog from "./FlightManageEditLabelDialog";
import FlightManageReportInformation from "./FlightManageReportInformation";
import FlightManageImportData from "./FlightManageImportData";
import EditImageInfoDialog from "../../../components/CommonDialog/EditImageInfoDialog";

// const imagePerRow = 6;

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
        <Box>
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

const ModalMissionData = ({
  powerline_id,
  schedule_id,
  implementation_date,
  docNo,
  type_ticket,
  supervision_status
}) => {
  // MAIN DIALOG VARIABLE
  const [open, setOpen] = useState(false);
  // bien dung de lay data
  const [imgList2, setImgList2] = useState({});
  console.log(imgList2);
  const [getMissionId, setGetMissionId] = useState("");
  console.log(getMissionId);
  const [timeFlyStart, setTimeFlyStart] = useState([]);
  const [chooseMissionIndex, setChooseMissionIndex] = useState(null);
  console.log(chooseMissionIndex);
  // input and label
  const [selectedLabels, setSelectedLabels] = useState([]);
  console.log("selectedLabels:", selectedLabels);
  // loc anh bat thuong
  const [errorImageBoxChecked, setErrorImageBoxChecked] = useState(false);

  //check variable change
  const [labelChanged, setLabelChanged] = useState(false);
  const [checked, setChecked] = useState([]);
  const [hadSubmittedError, setHadSubmittedError] = useState(false);
  const [hadImportNewData, setHadImportNewData] = useState(false);

  // zoomming
  const [openZoomingImg, setOpenZoomingImg] = useState("");

  // pagination
  // const [nextImg, setNextImg] = useState({});

  // console.log(nextImg);

  // split tab
  const [tab, setTab] = useState(0);

  const urlViewData =
    process.env.REACT_APP_API_URL +
    "supervisionschedules/?schedule_id=" +
    schedule_id;
  console.log(urlViewData);
  const urlPostFlightData = process.env.REACT_APP_API_URL + "flightdatas/";
  const urlGetData =
    process.env.REACT_APP_API_URL +
    "supervisiondetails/?mission_id=" +
    getMissionId +
    `&img_state=${errorImageBoxChecked === true ? "defect" : "all"}`;
  console.log(urlGetData);

  useEffect(() => {
    setChecked([]);
    setSelectedLabels([]);
    if (open)
      axios
        .get(urlViewData)
        .then((res) => {
          console.log(res.data.data);
          setTimeFlyStart(
            res.data.data.map((data, index) => ({
              indexMission: index,
              time: data.mission_name,
            }))
          );
          if (chooseMissionIndex !== "") {
            setGetMissionId(res.data.data[chooseMissionIndex].mission_id);
          }
        })
        .catch((err) => {
          console.log(err);
        });
  }, [open, chooseMissionIndex, urlViewData]);

  useEffect(() => {
    setLabelChanged(false);
    setHadSubmittedError(false);
    setTab(0);
    setHadImportNewData(false);

    if (open && getMissionId !== "") {
      axios
        .get(urlGetData)
        .then((res) => {
          console.log(res);
          setImgList2(res.data);
          // setNextImg(
          //   res.data.data.map((data) =>
          //     Object.keys(data).map((vt) => {
          //       return data[vt].reduce((acc, galleryKey) => {
          //         acc[galleryKey] = { loaded: imagePerRow };
          //         return acc;
          //       }, {});
          //     })
          //   )
          // );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [
    labelChanged,
    hadSubmittedError,
    errorImageBoxChecked,
    open,
    urlGetData,
    getMissionId,
    hadImportNewData,
  ]);

  // ------------ Render list mission in one day ------------
  const renderListMission = (timeFlyStart) => {
    console.log(timeFlyStart);
    return (
      <>
        {timeFlyStart.map((timeflystart) => {
          console.log(timeflystart.time === chooseMissionIndex);
          return (
            <>
              <div
                className={`list-mission-items__container ${
                  timeflystart.indexMission === chooseMissionIndex
                    ? "list-mission-items__container--choosed"
                    : "list-mission-items__container--unchoosed"
                }`}
                onClick={() => setChooseMissionIndex(timeflystart.indexMission)}
              >
                <div className="list-mission-items__title">
                  {timeflystart.time}
                </div>
              </div>
            </>
          );
        })}
      </>
    );
  };

  // --------- Ham de loc chi anh bat thuong  ---------
  const handleErrorImageBoxChecked = (e) => {
    setErrorImageBoxChecked(e.target.checked);
  };

  // --------- Ham de submit tat ca cac anh nguoi dung chon --------
  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("schedule_id", schedule_id);
    formData.append("list_imageid", selectedLabels);

    console.log(schedule_id);

    axios
      .post(urlPostFlightData, formData)
      .then((response) => {
        if (response.status === 200) {
          alert("Tất cả ảnh đã chọn đã được gửi đi !");
          setHadSubmittedError(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // --------- Ham de xu ly pagination --------
  // const handleLoadMore = (vt) => {
  //   console.log("Before update:", nextImg[vt]);
  //   setNextImg((prevNextImg) => ({
  //     ...prevNextImg,
  //     [vt]: { loaded: prevNextImg[vt].loaded + imagePerRow },
  //   }));
  //   console.log("After update:", nextImg[vt]);
  // };

  // --------- Ham xu ly chia tab ---------
  const handleChangeTabs = (event, newValue) => {
    console.log(newValue);
    setTab(newValue);
  };

  // ------------- Render list error images ---------------
  const renderImageList = () => {
    return Object.keys(imgList2).map((vt, index) => {
      return (
        <>
          <CustomTabPanel key={index} value={tab} index={index}>
            <ImageList
              sx={{
                position: "relative",
                overflowY: "hidden",
              }}
              cols={3}
            >
              {imgList2[vt]
                // ?.slice(0, nextImg[vt].loaded)
                ?.map((info, index) => {
                  console.log(info);
                  return (
                    <>
                      <ImageListItem key={index}>
                        <div className="modal-mission-data__img-list-items-header">
                          <TextField
                            label="Tình trạng"
                            value={info.image_title}
                            multiline
                            maxRows={1}
                            style={{ height: "90%", marginTop: "7px" }}
                            disabled
                          />

                          <div>
                            {/* Zoom Dialog */}
                            <Button
                              className="modal-mission-data__zoom-btn"
                              variant="contained"
                              onClick={() =>
                                setOpenZoomingImg(
                                  process.env.REACT_APP_IMG + info.image_path
                                )
                              }
                            >
                              <CropFreeIcon />
                            </Button>
                            <FlightManageZoomingDialog
                              info={process.env.REACT_APP_IMG + info.image_path}
                              openZoomingImg={openZoomingImg}
                              setOpenZoomingImg={setOpenZoomingImg}
                            />
                            {/* Edit label Dialog */}
                            {/* <FlightManageEditLabelDialog
                              info={info}
                              setLabelChanged={setLabelChanged}
                            /> */}
                            <EditImageInfoDialog
                              info={info}
                              setLabelChanged={setLabelChanged}
                              type_ticket={type_ticket}
                            />
                          </div>
                        </div>

                        <label
                          for={`choose-img-${info.image_id}`}
                          className={`modal-mission-data__img-list-items-label ${
                            info.sent_status === "sent" ? "hadsubmitted" : ""
                          } ${
                            selectedLabels.includes(info.image_id) ||
                            info.sent_status === "sent"
                              ? "choosed"
                              : ""
                          }`}
                          onClick={() => handleLabelClick(info.image_id)}
                        >
                          <img
                            src={process.env.REACT_APP_IMG + info.image_path}
                            srcSet={process.env.REACT_APP_IMG + info.image_path}
                            alt={info.image_label}
                            loading="lazy"
                            width={"100%"}
                            height={"100%"}
                          />
                        </label>

                        {selectedLabels.includes(info.image_id) &&
                        info.sent_status === "not_sent" ? (
                          <div className="checkmark-hadchoosed"></div>
                        ) : (
                          <></>
                        )}

                        {info.sent_status === "sent" ? (
                          <MarkEmailReadIcon
                            className="icon-hadsent"
                            color="info"
                            fontSize="large"
                          />
                        ) : (
                          <></>
                        )}
                      </ImageListItem>

                      <input
                        id={`choose-img-${info.image_path}`}
                        type="checkbox"
                        value={info.image_path}
                        style={{
                          display: "none",
                        }}
                        onChange={handleInputClick}
                      />
                    </>
                  );
                })}
            </ImageList>
          </CustomTabPanel>
        </>
      );
    });
  };

  // --------- Ham de xu ly click input va label ---------
  const handleLabelClick = (label) => {
    if (selectedLabels.includes(label)) {
      setSelectedLabels(selectedLabels.filter((l) => l !== label));
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  const handleInputClick = (event) => {
    var updatedList = [];
    if (event.target.checked) {
      updatedList = [...checked, event.target.value];
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
    }
    console.log(updatedList);
    setChecked(updatedList);
  };

  return (
    <>
      <Button
        className="modal-mission-data__show-modal-btn"
        variant="outlined"
        onClick={() => setOpen(true)}
      >
        Xem dữ liệu
      </Button>

      <Dialog fullScreen open={open}>
        <DialogTitle className="modal-mission-data__header">
          {/* <Box>
            <FormControl fullWidth>
              <InputLabel>Chọn tuyến</InputLabel>
              <Select
                // value={superviseType}
                label="Chọn tuyến"
                // onChange={onChangeSelectSuperviseType}
                defaultValue={""}
              >
                <MenuItem value={""}>T87 Mai Dong Thanh Nhan</MenuItem>
              </Select>
            </FormControl>
          </Box> */}
          <h3>Ngày: {implementation_date} </h3>
          <h3>
            Phiếu: {docNo} - {type_ticket === "D" ? "Ngày" : "Đêm"}
          </h3>
          <Button
            className="modal-mission-data__close-btn"
            color="error"
            variant="contained"
            onClick={() => setOpen(false)}
          >
            <CloseIcon fontSize="small" />
          </Button>
        </DialogTitle>
        <DialogContent className="modal-mission-data__body">
          <Grid container spacing={0} className="modal-mission-data__body">
            <Grid item xs={12}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={tab}
                  onChange={handleChangeTabs}
                  aria-label="basic tabs example"
                >
                  {chooseMissionIndex != null ? (
                    Object.keys(imgList2).map((vt, index) => (
                      <Tab key={index} label={vt} {...a11yProps(index)} />
                    ))
                  ) : (
                    <></>
                  )}

                  <div className="modal-afterfly__btn-group">
                    <FormControlLabel
                      className="modal-mission-data__form-label"
                      control={<Checkbox checked={errorImageBoxChecked} />}
                      label="Ảnh bất thường"
                      onChange={(e) => handleErrorImageBoxChecked(e)}
                    />

                    <FlightManageImportData
                      powerline_id={powerline_id}
                      implementation_date={implementation_date}
                      docNo={docNo}
                      type_ticket={type_ticket}
                      setTab={setTab}
                      schedule_id={schedule_id}
                      setHadImportNewData={setHadImportNewData}
                    />
                  </div>
                </Tabs>
              </Box>
            </Grid>

            <Grid item className="modal-mission-data__list-mission" xs={2}>
              {renderListMission(timeFlyStart)}
            </Grid>
            <Grid item xs={10} className="modal-mission-data__img-list">
              {renderImageList()}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            border: "1px solid black",
          }}
        >
          <FlightManageReportInformation
            schedule_id={schedule_id}
            // selectedLabels={selectedLabels}
            // setHadSubmittedError={setHadSubmittedError}
            type_ticket={type_ticket}
            supervision_status={supervision_status}
          />

          <Button
            disabled={selectedLabels.length > 0 ? false : true}
            className={selectedLabels.length > 0 ? "modal-mission-data__submit-btn" : ""}
            variant="outlined"
            onClick={handleSubmit}
          >
            Gửi ảnh
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalMissionData;
