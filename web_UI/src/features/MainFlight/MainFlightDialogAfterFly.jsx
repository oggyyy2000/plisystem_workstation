import React from "react";
import { useState, useEffect } from "react";

import { toast } from "react-toastify";
import * as ObjectDefectService from "../../APIServices/ObjectDefectService.js";
import * as SupervisionDetailsService from "../../APIServices/SupervisionDetailsService.js";
import * as FlightDatasService from "../../APIServices/FlightDatasService.js";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
  Tabs,
  Tab,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import "./css/MainFlightDialogAfterFly.css";
import LoadingPage from "../../components/LoadingPage/LoadingPage.jsx";
import ListImageResult from "../../components/ListImageResult/ListImageResult.jsx";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const MainFlightDialogAfterFly = ({
  flightComplete,
  getMissionAndScheduleId,
  // docNo,
  typeTicket,
  openZoomingImg,
  setOpenZoomingImg,
}) => {
  const [openModalAfterFly, setOpenModalAfterFly] = useState(false);
  const [errorImageBoxChecked, setErrorImageBoxChecked] = useState(false);
  const [imgList2, setImgList2] = useState({});
  console.log("imgList2: ", imgList2);
  // const [imgList2TotalElement, setImgList2TotalElement] = useState(0);
  // console.log("imgList2TotalElement: ", imgList2TotalElement)
  const [allImageIds, setAllImageIds] = useState([]);
  console.log("allImageIds: ", allImageIds);
  var flattenedImageIdsArray = [].concat.apply([], allImageIds);
  console.log("flattenedImageIdsArray: ", flattenedImageIdsArray);
  // const [openZoomingImg, setOpenZoomingImg] = useState("");
  const [selectedLabels, setSelectedLabels] = useState([]);

  //check variable change
  const [labelChanged, setLabelChanged] = useState(false);
  const [sendClicked, setSendClicked] = useState(false);
  const [chooseAllImg, setChooseAllImg] = useState(false);

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

  useEffect(() => {
    const getSuggestOptionEditLabel = async () => {
      const response = await ObjectDefectService.getData();
      if (response) {
        setSuggestOptionEditLabel(response);
      }
    };
    getSuggestOptionEditLabel();
  }, []);

  useEffect(() => {
    setOpenModalAfterFly(flightComplete);
  }, [flightComplete]);

  useEffect(() => {
    setLabelChanged(false);
    if (openModalAfterFly && getMissionAndScheduleId.mission_id) {
      const getSupervisionDetails = async () => {
        const response = await SupervisionDetailsService.getData({
          supervisionDetailsEndpoint: `supervisiondetails/?mission_id=${
            getMissionAndScheduleId.mission_id
          }&img_state=${errorImageBoxChecked === true ? "defect" : "all"}`,
        });
        if (response) {
          setImgList2(response);
          setCurrentTabName(Object.keys(response)[0]);
          // let totalElements = 0;

          // // Loop through each top-level key
          // for (const location in res.data) {
          //   // Get the array of images for the current location
          //   const images = res.data[location];

          //   // Add the length of the array to the total count
          //   totalElements += images.length;
          // }
          // setImgList2TotalElement(totalElements);
        }
      };
      getSupervisionDetails();
    }
  }, [
    sendClicked,
    openModalAfterFly,
    errorImageBoxChecked,
    labelChanged,
    getMissionAndScheduleId.mission_id,
  ]);

  useEffect(() => {
    if (errorImageBoxChecked && getMissionAndScheduleId.mission_id) {
      const handleCheckedErrorImageBox = async () => {
        const response = await SupervisionDetailsService.getData({
          supervisionDetailsEndpoint: `supervisiondetails/?mission_id=${
            getMissionAndScheduleId.mission_id
          }&img_state=${errorImageBoxChecked === true ? "defect" : "all"}`,
        });
        if (response) {
          setImgList2(response);
          // setErrorImageList(res.data)
          setPage(1);
        }
      };
      handleCheckedErrorImageBox();
    } else if (!errorImageBoxChecked && getMissionAndScheduleId.mission_id) {
      // them tat ca id anh chua duoc gui vao 1 mang neu o anh bat thuong k dc tich
      const handleUncheckedErrorImageBox = async () => {
        const response = await SupervisionDetailsService.getData({
          supervisionDetailsEndpoint: `supervisiondetails/?mission_id=${
            getMissionAndScheduleId.mission_id
          }&img_state=${errorImageBoxChecked === true ? "defect" : "all"}`,
        });
        if (response) {
          setImgList2(response);
          setAllImageIds(
            Object.keys(response).map((vt) =>
              response[vt]
                .filter((image) => image.sent_status === "not_sent")
                .map((image) => image.image_id)
            ) // Extract all image IDs
          );
          setPage(1);
        }
      };
      handleUncheckedErrorImageBox();
    }
  }, [errorImageBoxChecked, getMissionAndScheduleId.mission_id]);

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

  // --------- Ham de loc chi anh bat thuong  ---------
  const handleErrorImageBoxChecked = (e) => {
    // if (Object.keys(imgList2).length > 0) {
    setErrorImageBoxChecked(e.target.checked);
    // }
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
  const handleSubmitErrorImage = async () => {
    setSendClicked(true);

    const formData = new FormData();
    formData.append("schedule_id", getMissionAndScheduleId.schedule_id);
    formData.append("list_imageid", selectedLabels);

    const response = await FlightDatasService.postData({
      data: formData,
      options: {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    });
    if (response) {
      toast.success("Tất cả ảnh đã chọn đã được gửi đi !");
      setSendClicked(false);
      setSelectedLabels([]);
    } else {
      setSendClicked(false);
    }
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

  return (
    <>
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
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  display: "flex",
                  height: "50px",
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#fff",
                  zIndex: 10,
                }}
              >
                <Tabs
                  className="modal-afterfly__tab-group"
                  value={tab}
                  onChange={handleChangeTabs}
                  indicatorColor="primary"
                  variant={currentTabName ? "scrollable" : "standard"}
                  scrollButtons="auto"
                  allowScrollButtonsMobile
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
                </Tabs>

                <div className="modal-afterfly__btn-group">
                  <FormControlLabel
                    className="modal-mission-data__form-label"
                    control={
                      <Checkbox
                        checked={chooseAllImg}
                        onChange={handleSelectAll}
                      />
                    }
                    label={
                      selectedLabels.length > 0
                        ? "Bỏ chọn tất cả ảnh"
                        : "Chọn tất cả ảnh"
                    }
                  />

                  <FormControlLabel
                    className="modal-afterfly__form-label"
                    control={<Checkbox checked={errorImageBoxChecked} />}
                    label="Ảnh bất thường"
                    onChange={(e) => handleErrorImageBoxChecked(e)}
                  />
                </div>
              </Box>
            ) : (
              <></>
            )}
            {getMissionAndScheduleId !== "" && (
              <ListImageResult
                imgList={imgList2}
                tab={tab}
                page={page}
                totalPages={totalPages}
                setLabelChanged={setLabelChanged}
                type_ticket={typeTicket}
                suggestOptionEditLabel={suggestOptionEditLabel}
                selectedLabels={selectedLabels}
                openZoomingImg={openZoomingImg}
                setOpenZoomingImg={setOpenZoomingImg}
                handleLabelClick={handleLabelClick}
                handlePageChange={handlePageChange}
              />
            )}
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
    </>
  );
};

export default MainFlightDialogAfterFly;
