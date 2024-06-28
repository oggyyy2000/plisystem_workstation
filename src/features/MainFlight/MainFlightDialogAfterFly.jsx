import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  ImageList,
  ImageListItem,
  Box,
  Tabs,
  Tab,
  Typography,
  Pagination,
} from "@mui/material";
import PropTypes from "prop-types";

import CloseIcon from "@mui/icons-material/Close";
import CropFreeIcon from "@mui/icons-material/CropFree";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

import "./css/MainFlightDialogAfterFly.css";
import EditImageInfoDialog from "../../components/CommonDialog/EditImageInfoDialog";
import LoadingPage from "../../components/LoadingPage/LoadingPage.jsx";

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

const MainFlightDialogAfterFly = ({
  flightComplete,
  getMissionAndScheduleId,
  docNo,
  typeTicket,
}) => {
  console.log("getMissionAndScheduleId: ", getMissionAndScheduleId);
  const [openModalAfterFly, setOpenModalAfterFly] = useState(false);
  const [errorImageBoxChecked, setErrorImageBoxChecked] = useState(false);
  const [imgList2, setImgList2] = useState({});
  // const [imgList2TotalElement, setImgList2TotalElement] = useState(0);
  // console.log("imgList2TotalElement: ", imgList2TotalElement)
  const [allImageIds, setAllImageIds] = useState([]);
  var flattenedImageIdsArray = [].concat.apply([], allImageIds);
  // const [imgList2TotalElement, setImgList2TotalElement] = useState(0);
  const [openZoomingImg, setOpenZoomingImg] = useState("");
  const [selectedLabels, setSelectedLabels] = useState([]);

  //check variable change
  const [change, setChange] = useState(false);
  const [checked, setChecked] = useState([]);
  const [hadSubmittedError, setHadSubmittedError] = useState(false);
  const [labelChanged, setLabelChanged] = useState(false);
  const [sendClicked, setSendClicked] = useState(false);
  const [chooseAllImg, setChooseAllImg] = useState(false);
  const [imgList2Set, setImgList2Set] = useState(false); // Flag for imgList2 data received

  // pagination
  const [page, setPage] = useState(1); // Current page
  const imagesPerPage = 12; // Number of images per page

  // Calculate total number of pages
  const [currentTabName, setCurrentTabName] = useState("");
  // console.log("currentTabName: ", Object.keys(imgList2)[0]);
  const totalPages =
    currentTabName !== "" && Object.keys(imgList2).length > 0
      ? Math.ceil(
          // Use optional chaining to safely access imgList2[currentTabName].length
          imgList2?.[currentTabName]?.length / imagesPerPage
        )
      : 0;

  // split tab
  const [tab, setTab] = useState(0);

  // get suggest option for edit label
  const [suggestOptionEditLabel, setSuggestOptionEditLabel] = useState({});

  const urlPostFlightData = process.env.REACT_APP_API_URL + "flightdatas/";
  const urlGetData =
    process.env.REACT_APP_API_URL +
    "supervisiondetails/?mission_id=" +
    getMissionAndScheduleId.mission_id +
    `&img_state=${errorImageBoxChecked === true ? "defect" : "all"}`;

  console.log("imgList2: ", imgList2);

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
    setOpenModalAfterFly(flightComplete);
  }, [flightComplete]);

  useEffect(() => {
    setLabelChanged(false);
    setChange(false);
    setHadSubmittedError(false);
    setSendClicked(false);
    setImgList2Set(false);

    if (
      openModalAfterFly &&
      getMissionAndScheduleId.mission_id &&
      !imgList2Set
    ) {
      axios
        .get(urlGetData)
        .then((res) => {
          // console.log("data:", res.data);
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
    change,
    hadSubmittedError,
    urlGetData,
    openModalAfterFly,
    labelChanged,
    imgList2Set,
    getMissionAndScheduleId.mission_id,
  ]);

  useEffect(() => {
    if (errorImageBoxChecked && getMissionAndScheduleId.mission_id) {
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
    } else if (!errorImageBoxChecked && getMissionAndScheduleId.mission_id) {
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
  }, [errorImageBoxChecked, urlGetData, getMissionAndScheduleId.mission_id]);

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
  const handleSubmitErrorImage = () => {
    setHadSubmittedError(false);
    setSendClicked(true);

    const formData = new FormData();
    formData.append("schedule_id", getMissionAndScheduleId.schedule_id);
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
        alert(error.response.data.error_description);
        setSendClicked(false);
      });
  };

  // ------------ Zooming Dialog ------------
  const zoomingDialog = (info) => {
    return (
      <>
        <Button
          className="modal-afterfly__zoom-btn"
          variant="contained"
          onClick={() => setOpenZoomingImg(info.image_path)}
        >
          <CropFreeIcon />
        </Button>

        <Dialog
          open={openZoomingImg === info.image_path ? true : false}
          onClose={() => setOpenZoomingImg(false)}
          sx={{
            "& .MuiDialog-container": {
              justifyContent: "center",
              alignItems: "center",
            },
          }}
          fullWidth
          maxWidth="lg"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <img
            src={process.env.REACT_APP_IMG + info.image_path}
            srcSet={process.env.REACT_APP_IMG + info.image_path}
            alt={info.img_path}
            loading="lazy"
            width={"100%"}
            height={"100%"}
          />
        </Dialog>
      </>
    );
  };

  // --------- Ham xu ly chia tabs ---------
  const handleChangeTabs = (event, newValue) => {
    console.log(newValue);
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

  // ------------- Render list error images Dialog ---------------
  const renderImageList = () => {
    return Object.keys(imgList2).map((vt, index) => {
      return (
        <>
          {tab === index && (
            <CustomTabPanel value={tab} index={index}>
              <ImageList
                sx={{
                  position: "relative",
                  overflowY: "hidden",
                }}
                cols={3}
              >
                {imgList2[vt]
                  .slice((page - 1) * imagesPerPage, page * imagesPerPage) // --------- xu ly pagination --------
                  ?.map((info, index) => {
                    return (
                      <>
                        <ImageListItem key={index}>
                          <div className="modal-afterfly__img-list-items-header">
                            <TextField
                              id="outlined-multiline-flexible"
                              label="Tình trạng"
                              value={info.image_title}
                              multiline // multiline của TextField MUI đang lỗi
                              maxRows={1}
                              style={{ height: "70%", marginTop: "7px" }}
                              disabled
                            />

                            <div>
                              {/* Zoom Dialog */}
                              {zoomingDialog(info)}

                              {/* Edit label Dialog */}
                              <EditImageInfoDialog
                                info={info}
                                setLabelChanged={setLabelChanged}
                                type_ticket={typeTicket}
                                suggestOptionEditLabel={suggestOptionEditLabel}
                              />
                            </div>
                          </div>

                          <label
                            for={`choose-img-${info.image_id}`}
                            className={`modal-afterfly__img-list-items-label ${
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
                              srcSet={
                                process.env.REACT_APP_IMG + info.image_path
                              }
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

              {/* --------- Ham de xu ly pagination -------- */}
              <Pagination
                variant="outlined"
                shape="rounded"
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                sx={{ display: "flex", justifyContent: "center", mt: 2 }}
              />
            </CustomTabPanel>
          )}
        </>
      );
    });
  };

  return (
    <Dialog fullWidth maxWidth={"xl"} open={openModalAfterFly}>
      <DialogTitle className="modal-afterfly__header">
        <h2 style={{ textAlign: "center" }}>KẾT QUẢ KIỂM TRA</h2>
        <Button
          className="modal-afterfly__close-btn"
          color="error"
          variant="contained"
          onClick={() => setOpenModalAfterFly(false)}
        >
          <CloseIcon fontSize="small" />
        </Button>
      </DialogTitle>
      <DialogContent className="modal-afterfly__body">
        <Grid item className="modal-afterfly__img-list" xs={12}>
          {getMissionAndScheduleId !== undefined ? (
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tab}
                onChange={handleChangeTabs}
                aria-label="basic tabs example"
              >
                {Object.keys(imgList2).map((vt, index) => (
                  <Tab
                    key={index}
                    label={vt}
                    onClick={() => handleTabClick(vt)}
                    {...a11yProps(index)}
                  />
                ))}

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
                    className="modal-afterfly__form-label"
                    control={<Checkbox checked={errorImageBoxChecked} />}
                    label="Ảnh bất thường"
                    onChange={(e) => handleErrorImageBoxChecked(e)}
                  />
                </div>
              </Tabs>
            </Box>
          ) : (
            <></>
          )}
          {getMissionAndScheduleId !== "" && renderImageList()}
        </Grid>
      </DialogContent>
      <DialogActions
        style={{
          display: "flex",
          justifyContent: "center",
          border: "1px solid black",
        }}
      >
        <Button
          className="modal-afterfly__submit-btn"
          disabled={selectedLabels.length > 0 ? false : true}
          variant="outlined"
          onClick={handleSubmitErrorImage}
        >
          GỬI
        </Button>
      </DialogActions>

      {sendClicked === true ? <LoadingPage /> : <></>}
    </Dialog>
  );
};

export default MainFlightDialogAfterFly;
