import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import * as SupervisionDetailsService from "../../../APIServices/SupervisionDetailsService";
import * as SupervisionSchedulesService from "../../../APIServices/SupervisionSchedulesService";
import * as FlightDatasService from "../../../APIServices/FlightDatasService";
import * as ObjectDefectService from "../../../APIServices/ObjectDefectService";
import * as CopyFolderImageService from "../../../APIServices/CopyFolderImageService";
import * as GetTicketDataService from "../../../APIServices/GetTicketDataService";

import {
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  FormControlLabel,
  Checkbox,
  DialogActions,
  Box,
  Tabs,
  Tab,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";

import "./css/FlightManageModalMissionData.css";
import FlightManageReportInformation from "./FlightManageReportInformation";
import FlightManageImportData from "./FlightManageImportData";
import Loading from "../../../components/LoadingPage/LoadingPage";
import ListImageResult from "../../../components/ListImageResult/ListImageResult";
import ImageZoomDiaglog from "../../../components/CommonDialog/ImageZoomDiaglog";

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
  setHadImportNewData,
}) => {
  // MAIN DIALOG VARIABLE
  const [open, setOpen] = useState(false);

  const [openReportInformationDialog, setOpenReportInformationDialog] =
    useState(false);
  // bien dung de lay data
  const [imgList2, setImgList2] = useState({});
  // const [imgList2TotalElement, setImgList2TotalElement] = useState(0);
  // console.log("imgList2: ", imgList2)
  const [allImageIds, setAllImageIds] = useState([]);
  var flattenedImageIdsArray = [].concat.apply([], allImageIds);
  const [choseMissionId, setChoseMissionId] = useState("");
  console.log("choseMissionId: ", choseMissionId);
  const [listMissionInOneDay, setListMissionInOneDay] = useState([]);
  console.log("listMissionInOneDay: ", listMissionInOneDay);
  const [choseMissionIndex, setChoseMissionIndex] = useState(0);
  console.log("choseMissionIndex: ", choseMissionIndex);
  // input and label
  const [selectedLabels, setSelectedLabels] = useState([]);
  console.log("selectedLabels: ", selectedLabels);
  console.table("flattenedImageIds: ", flattenedImageIdsArray);
  // loc anh bat thuong
  const [errorImageBoxChecked, setErrorImageBoxChecked] = useState(false);
  // const [errorImageList, setErrorImageList] = useState({});

  //check variable change
  const [labelChanged, setLabelChanged] = useState(false);
  const [sendClicked, setSendClicked] = useState(false);
  const [chooseAllImg, setChooseAllImg] = useState(false);

  // zoomming
  const [openZoomingImg, setOpenZoomingImg] = useState("");

  // pagination
  const [page, setPage] = useState(1); // Current page
  const imagesPerPage = 12; // Number of images per page

  // Calculate total number of pages
  const [currentTabName, setCurrentTabName] = useState("");
  const totalPages =
    currentTabName !== "" && Object.keys(imgList2).length > 0
      ? Math.ceil(imgList2?.[currentTabName]?.length / imagesPerPage)
      : 0;
  // split tab
  const [tab, setTab] = useState(0);

  // get suggest option for edit label
  const [suggestOptionEditLabel, setSuggestOptionEditLabel] = useState({});

  // data for report information
  const [ticketInfo, setTicketInfo] = useState({});
  console.log("ticketField", ticketInfo);

  useEffect(() => {
    if (!open) {
      setSelectedLabels([]);
    }
  }, [open]);

  useEffect(() => {
    setSendClicked(false);
    if (openReportInformationDialog) {
      const type =
        type_ticket === "KT01" || type_ticket === "KT03"
          ? "results"
          : (type_ticket === "KT02" || type_ticket === "KT04") && "data";
      const getReportField = async () => {
        const response = await GetTicketDataService.getData(schedule_id, type);
        if (response) {
          setTicketInfo(response);
        }
      };
      getReportField();
    } else {
      setTicketInfo({});
    }
  }, [schedule_id, type_ticket, openReportInformationDialog]);

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
    const getListMissionInOneDay = async () => {
      const response = await SupervisionSchedulesService.getData(schedule_id);
      if (response && response.length > 0) {
        const reverseResponse = response.slice().reverse();
        setListMissionInOneDay(
          reverseResponse.map((data, index) => ({
            indexMission: index,
            time: data.mission_name,
          }))
        );
        setChoseMissionId(reverseResponse[choseMissionIndex].mission_id);
      }
    };
    if (open && schedule_id) {
      getListMissionInOneDay();
    }
  }, [open, choseMissionIndex, schedule_id]);

  useEffect(() => {
    setLabelChanged(false);
    const getChoseMissionDetail = async () => {
      const response = await SupervisionDetailsService.getData({
        supervisionDetailsEndpoint: `supervisiondetails/?mission_id=${choseMissionId}&img_state=${
          errorImageBoxChecked === true ? "defect" : "all"
        }`,
      });
      if (response) {
        console.log("SupervisionDetailsServiceResponse: ", response);
        setImgList2(response);
        setCurrentTabName(Object.keys(response)[0]);
      }
    };

    if (open && choseMissionId) {
      getChoseMissionDetail();
    }
  }, [
    labelChanged,
    open,
    choseMissionId,
    sendClicked, // khi gui anh xong thi update lai trang thai anh
    errorImageBoxChecked,
  ]);

  useEffect(() => {
    if (errorImageBoxChecked && choseMissionId) {
      const handleCheckedErrorImageBox = async () => {
        const response = await SupervisionDetailsService.getData({
          supervisionDetailsEndpoint: `supervisiondetails/?mission_id=${choseMissionId}&img_state=${
            errorImageBoxChecked === true ? "defect" : "all"
          }`,
        });
        if (response) {
          setImgList2(response);
          setPage(1);
        }
      };
      handleCheckedErrorImageBox();
    } else if (!errorImageBoxChecked && choseMissionId) {
      const handleUncheckedErrorImageBox = async () => {
        const response = await SupervisionDetailsService.getData({
          supervisionDetailsEndpoint: `supervisiondetails/?mission_id=${choseMissionId}&img_state=${
            errorImageBoxChecked === true ? "defect" : "all"
          }`,
        });
        if (response) {
          setImgList2(response);
          setAllImageIds(
            Object.keys(response).map((vt) =>
              response[vt]
                .filter((image) => image.sent_status !== "sent")
                .map((image) => image.image_id)
            ) // Extract all image IDs
          );
          setPage(1);
        }
      };
      handleUncheckedErrorImageBox();
    }
  }, [errorImageBoxChecked, choseMissionId]);

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
  const handleListMissionClick = (choseMission) => {
    setCurrentTabName(Object.keys(imgList2)[0]);
    setChoseMissionIndex(choseMission.indexMission);
    setSelectedLabels([]);
  };
  const renderListMission = (listMissionInOneDay) => {
    console.log("listMissionInOneDay: ", listMissionInOneDay);
    return (
      <>
        {listMissionInOneDay.map((mission) => {
          return (
            <>
              <div
                className={`list-mission-items__container ${
                  mission.indexMission === choseMissionIndex
                    ? "list-mission-items__container--choosed"
                    : "list-mission-items__container--unchoosed"
                }`}
                onClick={() => handleListMissionClick(mission)}
              >
                <div className="list-mission-items__title">{mission.time}</div>

                <Button
                  disabled={mission.indexMission !== choseMissionIndex}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    color: "#3D8AF7",
                  }}
                  onClick={() => {
                    handleCopyImgFolder(choseMissionId);
                  }}
                >
                  <FileCopyIcon
                    color={
                      mission.indexMission !== choseMissionIndex
                        ? "disabled"
                        : "primary"
                    }
                    fontSize="large"
                  />
                </Button>
              </div>
            </>
          );
        })}
      </>
    );
  };

  // --------- Ham de copy tat ca anh ---------
  const handleCopyImgFolder = async (missionId) => {
    const formData = new FormData();
    formData.append("mission_id", missionId);

    const response = await CopyFolderImageService.postData({
      data: formData,
      options: {
        headers: {
          "content-type": "multipart/form-data",
        },
      },
    });
    if (response) {
      toast.success(response);
    }
  };

  // --------- Ham de loc chi anh bat thuong ---------
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
  const handleSubmit = async () => {
    setSendClicked(true);

    const formData = new FormData();
    formData.append("schedule_id", schedule_id);
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
      setSendClicked(false);
      setSelectedLabels([]);
      toast.success("Tất cả ảnh đã chọn đã được gửi đi !");
    } else {
      setSendClicked(false);
    }
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

  return (
    <>
      <Button
        className="modal-mission-data__show-modal-btn"
        variant="outlined"
        onClick={() => {
          if (type_ticket === "KT01" || type_ticket === "KT03") {
            setOpen(true);
          } else if (type_ticket === "KT02" || type_ticket === "KT04") {
            setOpenReportInformationDialog(true);
          }
        }}
      >
        Xem dữ liệu
      </Button>

      {(type_ticket === "KT01" || type_ticket === "KT03") && (
        <Dialog fullScreen open={open}>
          <DialogTitle className="modal-mission-data__header">
            <span>
              <CalendarMonthIcon /> &nbsp; Ngày: {implementation_date}
            </span>
            <span>
              <EditCalendarIcon /> &nbsp; Phiếu: {docNo} - {`(${type_ticket})`}
            </span>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                style={{ fill: "white" }}
              >
                <path d="m8.28 5.45l-1.78-.9L7.76 2h8.47l1.27 2.55l-1.78.89L15 4H9zM18.62 8h-4.53l-.79-3h-2.6l-.79 3H5.38L4.1 10.55l1.79.89l.73-1.44h10.76l.72 1.45l1.79-.89zm-.85 14H15.7l-.24-.9L12 15.9l-3.47 5.2l-.23.9H6.23l2.89-11h2.07l-.36 1.35L12 14.1l1.16-1.75l-.35-1.35h2.07zm-6.37-7l-.9-1.35l-1.18 4.48zm3.28 3.12l-1.18-4.48l-.9 1.36z" />
              </svg>{" "}
              &nbsp; Tên tuyến: {powerline_id} {powerline_name}
            </span>
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
              <Grid
                item
                className="modal-mission-data__list-mission"
                xl={2}
                lg={2.5}
                md={2.5}
                sm={2.5}
                xs={4}
              >
                {listMissionInOneDay && renderListMission(listMissionInOneDay)}
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
                    width: "100%",
                  }}
                >
                  <Tabs
                    className="modal-mission-data__tab-group"
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

                  <div className="modal-mission-data__btn-group">
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
                </Box>
                <ListImageResult
                  imgList={imgList2}
                  tab={tab}
                  page={page}
                  totalPages={totalPages}
                  setLabelChanged={setLabelChanged}
                  type_ticket={type_ticket}
                  suggestOptionEditLabel={suggestOptionEditLabel}
                  selectedLabels={selectedLabels}
                  openZoomingImg={openZoomingImg}
                  setOpenZoomingImg={setOpenZoomingImg}
                  handleLabelClick={handleLabelClick}
                  handlePageChange={handlePageChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            style={{
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            <Button
              disabled={selectedLabels.length > 0 ? false : true}
              className={
                selectedLabels.length > 0
                  ? "modal-mission-data__submit-btn"
                  : ""
              }
              variant="outlined"
              onClick={handleSubmit}
            >
              Gửi ảnh
            </Button>
          </DialogActions>
          <FlightManageReportInformation
            ticketInfo={ticketInfo}
            setTicketInfo={setTicketInfo}
            scheduleId={schedule_id}
            supervisionStatus={supervision_status}
            typeTicket={type_ticket}
            openReportInformationDialog={openReportInformationDialog}
            setOpenReportInformationDialog={setOpenReportInformationDialog}
          />
          {sendClicked === true ? <Loading /> : <></>}
        </Dialog>
      )}

      {(type_ticket === "KT02" || type_ticket === "KT04") && ticketInfo && (
        <FlightManageReportInformation
          ticketInfo={ticketInfo}
          setTicketInfo={setTicketInfo}
          scheduleId={schedule_id}
          supervisionStatus={supervision_status}
          typeTicket={type_ticket}
          openReportInformationDialog={openReportInformationDialog}
          setOpenReportInformationDialog={setOpenReportInformationDialog}
        />
      )}

      {openZoomingImg && (
        <ImageZoomDiaglog
          info={openZoomingImg}
          openZoomingImg={openZoomingImg}
          setOpenZoomingImg={setOpenZoomingImg}
        />
      )}
    </>
  );
};

export default ModalMissionData;
