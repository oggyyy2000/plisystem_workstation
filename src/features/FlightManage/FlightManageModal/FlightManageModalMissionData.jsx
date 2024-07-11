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
  Pagination,
} from "@mui/material";
import PropTypes from "prop-types";

import CloseIcon from "@mui/icons-material/Close";
import CropFreeIcon from "@mui/icons-material/CropFree";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import "./css/FlightManageModalMissionData.css";
import FlightManageZoomingDialog from "./FlightManageZoomingDialog";
import FlightManageReportInformation from "./FlightManageReportInformation";
import FlightManageImportData from "./FlightManageImportData";
import EditImageInfoDialog from "../../../components/CommonDialog/EditImageInfoDialog";
import Loading from "../../../components/LoadingPage/LoadingPage";

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
  powerline_name,
  schedule_id,
  implementation_date,
  docNo,
  type_ticket,
  supervision_status,
  hadImportNewData,
  setHadImportNewData,
}) => {
  // MAIN DIALOG VARIABLE
  const [open, setOpen] = useState(false);
  // bien dung de lay data
  const [imgList2, setImgList2] = useState({});
  // const [imgList2TotalElement, setImgList2TotalElement] = useState(0);
  // console.log("imgList2: ", imgList2)
  const [allImageIds, setAllImageIds] = useState([]);
  var flattenedImageIdsArray = [].concat.apply([], allImageIds);
  const [getMissionId, setGetMissionId] = useState("");
  const [timeFlyStart, setTimeFlyStart] = useState([]);
  const [chooseMissionIndex, setChooseMissionIndex] = useState(null);
  // input and label
  const [selectedLabels, setSelectedLabels] = useState([]);
  console.log("selectedLabels: ", selectedLabels);
  console.table("flattenedImageIds: ", flattenedImageIdsArray);
  // loc anh bat thuong
  const [errorImageBoxChecked, setErrorImageBoxChecked] = useState(false);
  // const [errorImageList, setErrorImageList] = useState({});

  //check variable change
  const [labelChanged, setLabelChanged] = useState(false);
  const [checked, setChecked] = useState([]);
  const [hadSubmittedError, setHadSubmittedError] = useState(false);
  // const [hadImportNewData, setHadImportNewData] = useState(false);
  const [sendClicked, setSendClicked] = useState(false);
  const [chooseAllImg, setChooseAllImg] = useState(false);
  const [imgList2Set, setImgList2Set] = useState(false); // Flag for imgList2 data received

  // zoomming
  const [openZoomingImg, setOpenZoomingImg] = useState("");

  // pagination
  const [page, setPage] = useState(1); // Current page
  const imagesPerPage = 12; // Number of images per page

  // Calculate total number of pages
  const [currentTabName, setCurrentTabName] = useState("");
  // console.log("currentTabName: ", currentTabName);
  // console.log("imgList2: ", imgList2);
  // console.log("imgList2[currentTabName]", imgList2[currentTabName]);
  const totalPages =
    currentTabName !== "" && Object.keys(imgList2).length > 0
      ? Math.ceil(
          // Use optional chaining to safely access imgList2[currentTabName].length
          imgList2?.[currentTabName]?.length / imagesPerPage
        )
      : 0;
  // console.log("totalPages: ", totalPages);

  // split tab
  const [tab, setTab] = useState(0);

  // get suggest option for edit label
  const [suggestOptionEditLabel, setSuggestOptionEditLabel] = useState({});

  const urlViewData =
    process.env.REACT_APP_API_URL +
    "supervisionschedules/?schedule_id=" +
    schedule_id;
  const urlPostFlightData = process.env.REACT_APP_API_URL + "flightdatas/";
  const urlGetData =
    process.env.REACT_APP_API_URL +
    "supervisiondetails/?mission_id=" +
    getMissionId +
    `&img_state=${errorImageBoxChecked === true ? "defect" : "all"}`;
  console.log(urlGetData);

  useEffect(() => {
    const getSuggestOptionEditLabel = async () => {
      try {
        const urlGetPoleCoordinate =
          process.env.REACT_APP_API_URL + "objectdefect/";
        const responseData = await axios.get(urlGetPoleCoordinate);
        console.log(responseData.data);
        setSuggestOptionEditLabel(responseData.data);
      } catch (error) {
        console.log(error);
      }
    };
    getSuggestOptionEditLabel();
  }, []);

  useEffect(() => {
    setChecked([]);
    setSelectedLabels([]);
    if (open)
      axios
        .get(urlViewData)
        .then((res) => {
          console.log(res.data);
          setTimeFlyStart(
            res.data.map((data, index) => ({
              indexMission: index,
              time: data.mission_name,
            }))
          );
          if (chooseMissionIndex !== "") {
            setGetMissionId(res.data[chooseMissionIndex].mission_id);
          }
        })
        .catch((err) => {
          console.log(err);
        });
  }, [open, chooseMissionIndex, urlViewData, hadImportNewData]);

  useEffect(() => {
    setLabelChanged(false);
    setHadSubmittedError(false);
    setHadImportNewData(false);
    setSendClicked(false);

    if (open && getMissionId && !imgList2Set) {
      axios
        .get(urlGetData)
        .then((res) => {
          console.log(res);
          setImgList2(res.data);
          setCurrentTabName(Object.keys(res.data)[0]);
          setImgList2Set(true); // Mark imgList2 data received
          setImgList2Set(false);
          // let totalElements = 0;

          // // Loop through each top-level key
          // for (const location in res.data) {
          //   // Get the array of images for the current location
          //   const images = res.data[location];

          //   // Add the length of the array to the total count
          //   totalElements += images.length;
          // }
          // setImgList2TotalElement(totalElements);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [
    labelChanged,
    hadSubmittedError,
    chooseAllImg,
    open,
    urlGetData,
    getMissionId,
    hadImportNewData,
    setHadImportNewData,
    imgList2Set,
  ]);

  useEffect(() => {
    if (errorImageBoxChecked && getMissionId) {
      axios
        .get(urlGetData)
        .then((res) => {
          console.log(res);
          setImgList2(res.data);
          // setErrorImageList(res.data)
          setPage(1);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (!errorImageBoxChecked && getMissionId) {
      axios
        .get(urlGetData)
        .then((res) => {
          console.log(res);
          setImgList2(res.data);
          setAllImageIds(
            Object.keys(res.data).map((vt) =>
              res.data[vt]
                .filter((image) => image.sent_status !== "sent")
                .map((image) => image.image_id)
            ) // Extract all image IDs
          );
          setPage(1);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [errorImageBoxChecked, urlGetData, getMissionId]);

  useEffect(() => {
    if (chooseAllImg === true && selectedLabels.length === 0) {
      setChooseAllImg(false);
    } else if (
      chooseAllImg === false &&
      flattenedImageIdsArray.length > 0 &&
      selectedLabels.length === flattenedImageIdsArray.length
    ) {
      setChooseAllImg(true);
    } else if (
      selectedLabels.length > 0 &&
      flattenedImageIdsArray.length > 0 &&
      selectedLabels.length < flattenedImageIdsArray.length
    ) {
      setChooseAllImg(false);
    }
  }, [chooseAllImg, selectedLabels.length, flattenedImageIdsArray.length]);

  // ------------ Render list mission in one day ------------
  const handleListMissionClick = (timeflystart) => {
    setCurrentTabName(Object.keys(imgList2)[0]);
    setChooseMissionIndex(timeflystart.indexMission);
  };
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
                onClick={() => handleListMissionClick(timeflystart)}
              >
                <div className="list-mission-items__title">
                  {timeflystart.time}
                </div>

                <Button
                  disabled={chooseMissionIndex === null}
                  style={{ position: "absolute", bottom: 0, right: 0 }}
                  onClick={() => {
                    handleCopyImgFolder();
                  }}
                >
                  <ContentCopyIcon fontSize="large" />
                </Button>
              </div>
            </>
          );
        })}
      </>
    );
  };

  // --------- Ham de copy tat ca anh ---------
  const handleCopyImgFolder = () => {
    const urlPostCopyImgFolder =
      process.env.REACT_APP_API_URL + "copyfolderimage/";
    const formData = new FormData();
    formData.append("mission_id", getMissionId);
    axios
      .post(urlPostCopyImgFolder, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          alert(response.data);
        }
      })
      .catch((error) => {
        if (error) {
          alert(error.response.data.error);
        }
      });
  };

  // --------- Ham de loc chi anh bat thuong ---------
  const handleErrorImageBoxChecked = (e) => {
    if (Object.keys(imgList2).length > 0) {
      setErrorImageBoxChecked(e.target.checked);
    }
  };

  // --------- Ham de chon tat ca anh ---------
  const handleSelectAll = (e) => {
    setChooseAllImg(e.target.checked);

    if (selectedLabels.length > 0) {
      setSelectedLabels([]);
    } else {
      setSelectedLabels(flattenedImageIdsArray); // Update state with all IDs
    }
  };

  // --------- Ham de submit tat ca cac anh nguoi dung chon --------
  const handleSubmit = () => {
    setHadSubmittedError(false);
    setSendClicked(true);

    const formData = new FormData();
    formData.append("schedule_id", schedule_id);
    formData.append("list_imageid", selectedLabels);

    axios
      .post(urlPostFlightData, formData)
      .then((response) => {
        if (response.status === 200) {
          alert("Tất cả ảnh đã chọn đã được gửi đi !");
          setSendClicked(false);
          setHadSubmittedError(true);
          setSelectedLabels([]);
        }
      })
      .catch((error) => {
        console.error(error);
        setSendClicked(false);
        alert(error.response.data.error_description);
      });
  };

  // --------- Ham xu ly chia tabs ---------
  const handleChangeTabs = (event, newValue) => {
    // console.log(newValue);
    if (newValue !== undefined) {
      setTab(newValue);
    }
  };

  // --------- Ham xu ly click tab khac nhau ---------
  const handleTabClick = (vt) => {
    setCurrentTabName(vt);
    setPage(1);
  };

  // --------- Ham de xu ly chuyen trang pagination --------
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
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

  // ------------- Render list error images ---------------
  const renderImageList = () => {
    return Object.keys(imgList2).map((vt, index) => {
      return (
        <CustomTabPanel key={index} value={tab} index={index}>
          <ImageList
            className="modal-mission-data__img-list-items-container"
            // sx={{
            //   position: "relative",
            //   overflowY: "hidden",
            // }}
            // cols={3}
          >
            {imgList2[vt]
              .slice((page - 1) * imagesPerPage, page * imagesPerPage) // --------- xu ly pagination --------
              ?.map((info, index) => {
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
                          <EditImageInfoDialog
                            info={info}
                            setLabelChanged={setLabelChanged}
                            type_ticket={type_ticket}
                            suggestOptionEditLabel={suggestOptionEditLabel}
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

                        {info.sent_status === "sent" ? (
                          <MarkEmailReadIcon
                            className="icon-hadsent"
                            color="info"
                            fontSize="large"
                          />
                        ) : (
                          <></>
                        )}
                      </label>

                      {selectedLabels.includes(info.image_id) &&
                      info.sent_status === "not_sent" ? (
                        <div className="checkmark-hadchoosed"></div>
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

          <Pagination
            variant="outlined"
            shape="rounded"
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            sx={{ display: "flex", justifyContent: "center", mt: 2 }}
          />
        </CustomTabPanel>
      );
    });
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
          <h4>Ngày: {implementation_date}</h4>
          <h4>
            Phiếu: {docNo} - {type_ticket === "D" ? "Ngày" : "Đêm"}
          </h4>
          <h4>
            Tên tuyến: {powerline_id} {powerline_name}
          </h4>
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
                      <Tab
                        key={index}
                        label={vt}
                        onClick={() => handleTabClick(vt)}
                        {...a11yProps(index)}
                      />
                    ))
                  ) : (
                    <></>
                  )}

                  <div className="modal-afterfly__btn-group">
                    <FormControlLabel
                      className="modal-mission-data__form-label"
                      control={
                        <Checkbox
                          checked={chooseAllImg}
                          onChange={handleSelectAll}
                        />
                      }
                      label={"Chọn tất cả ảnh"}
                    />

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
                      suggestOptions={suggestOptionEditLabel}
                    />
                  </div>
                </Tabs>
              </Box>
            </Grid>

            <Grid
              item
              className="modal-mission-data__list-mission"
              xl={2}
              lg={2.5}
              md={2.5}
              sm={2.5}
              xs={4}
            >
              {renderListMission(timeFlyStart)}
            </Grid>
            <Grid
              item
              xl={10}
              lg={9.5}
              md={9.5}
              sm={9.5}
              xs={8}
              className="modal-mission-data__img-list"
            >
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
            className={
              selectedLabels.length > 0 ? "modal-mission-data__submit-btn" : ""
            }
            variant="outlined"
            onClick={handleSubmit}
          >
            Gửi ảnh
          </Button>
        </DialogActions>

        {sendClicked === true ? <Loading /> : <></>}
      </Dialog>
    </>
  );
};

export default ModalMissionData;
