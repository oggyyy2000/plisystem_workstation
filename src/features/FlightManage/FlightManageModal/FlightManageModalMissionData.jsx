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
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import CropFreeIcon from "@mui/icons-material/CropFree";

import "../css/FlightManageModalMissionData.css";
import FlightManageZoomingDialog from "./FlightManageZoomingDialog";
import FlightManageEditLabelDialog from "./FlightManageEditLabelDialog";
import FlightManagePrintReportDialog from "./PrintReportDialog/FlightManagePrintReportDialog";
import FlightManageReportInformation from "./FlightManageReportInformation";

const imagePerRow = 3;

const ModalMissionData = ({ schedule_id, implementation_date }) => {
  // MAIN DIALOG VARIABLE
  const [open, setOpen] = useState(false);
  // bien dung de lay data
  const [imgList2, setImgList2] = useState({});
  const [getImgData, setGetImgData] = useState("");
  const [timeFlyStart, setTimeFlyStart] = useState([]);
  const [chooseTime, setChooseTime] = useState("");
  // input and label
  const [selectedLabels, setSelectedLabels] = useState([]);
  console.log("selectedLabels:", selectedLabels);
  // loc anh bat thuong
  const [errorImageBoxChecked, setErrorImageBoxChecked] = useState(false);

  //check variable change
  const [labelChanged, setLabelChanged] = useState(false);
  const [checked, setChecked] = useState([]);
  const [hadSubmittedError, setHadSubmittedError] = useState(false);

  // zoomming
  const [openZoomingImg, setOpenZoomingImg] = useState("");

  // pagination
  const [nextImg, setNextImg] = useState({});

  console.log(nextImg);

  const urlViewData =
    process.env.REACT_APP_API_URL +
    "supervisionschedules/?schedule_id=" +
    schedule_id;
  console.log(urlViewData);
  const urlPostFlightData = process.env.REACT_APP_API_URL + "flightdatas/";
  const urlGetData =
    process.env.REACT_APP_API_URL +
    "supervisiondetails/?spv_results_path=" +
    getImgData +
    `&img_state=${errorImageBoxChecked === true ? "defect" : "all"}`;

  useEffect(() => {
    setChecked([]);
    setSelectedLabels([]);
    if (open)
      axios
        .get(urlViewData)
        .then((res) => {
          setTimeFlyStart(Object.keys(res.data.data));
          if (chooseTime !== "") {
            setGetImgData(res.data.data[chooseTime]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
  }, [open, chooseTime, urlViewData, urlGetData]);

  useEffect(() => {
    setLabelChanged(false);
    setHadSubmittedError(false);

    if (open && getImgData !== "") {
      axios
        .get(urlGetData)
        .then((res) => {
          setImgList2(res.data);
          setNextImg(
            Object.keys(res.data).reduce((acc, galleryKey) => {
              acc[galleryKey] = { loaded: imagePerRow };
              return acc;
            }, {})
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [
    labelChanged,
    hadSubmittedError,
    errorImageBoxChecked,
    selectedLabels,
    open,
    urlGetData,
    getImgData,
  ]);

  // ------------ Render list mission in one day ------------
  const renderListMission = (timeFlyStart) => {
    return (
      <>
        {timeFlyStart.map((timeflystart) => {
          console.log(timeflystart === chooseTime);
          return (
            <>
              <div
                className={`list-mission-items__container ${
                  timeflystart === chooseTime
                    ? "list-mission-items__container--choosed"
                    : "list-mission-items__container--unchoosed"
                }`}
                onClick={(e) => {
                  setChooseTime(e.target.innerText);
                }}
              >
                <div className="list-mission-items__title">{timeflystart}</div>
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
    console.log("checked:", checked);

    axios
      .post(urlPostFlightData, checked)
      .then((response) => {
        if (response.status === 200) {
          alert(response.data);
          setHadSubmittedError(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // --------- Ham de xu ly pagination --------
  const handleLoadMore = (vt) => {
    setNextImg((prevNextImg) => ({
      ...prevNextImg,
      [vt]: { loaded: prevNextImg[vt].loaded + imagePerRow },
    }));
  };

  // ------------- Render list error images ---------------
  const renderImageList = () => {
    return Object.keys(imgList2).map((vt) => {
      return (
        <>
          <div className="line-seperate-items"></div>

          <div className="modal-mission-data__img-list-title">{vt}</div>
          <ImageList
            sx={{
              position: "relative",
              overflowY: "hidden",
            }}
            cols={3}
          >
            {imgList2[vt]?.slice(0, nextImg[vt].loaded)?.map((info, index) => {
              return (
                <>
                  <ImageListItem key={index}>
                    <div className="modal-mission-data__img-list-items-header">
                      <TextField
                        label="Tình trạng"
                        value={info.label.split("_").join("\n")}
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
                              process.env.REACT_APP_IMG + info.img_path
                            )
                          }
                        >
                          <CropFreeIcon />
                        </Button>
                        <FlightManageZoomingDialog
                          info={process.env.REACT_APP_IMG + info.img_path}
                          openZoomingImg={openZoomingImg}
                          setOpenZoomingImg={setOpenZoomingImg}
                        />
                        {/* Edit label Dialog */}
                        <FlightManageEditLabelDialog
                          info={info}
                          setLabelChanged={setLabelChanged}
                        />
                      </div>
                    </div>

                    <label
                      for={`choose-img-${info.img_path}`}
                      className={`modal-mission-data__img-list-items-label ${
                        info.sent_check === 1 ? "hadsubmitted" : ""
                      } ${
                        selectedLabels.includes(info.img_path) ||
                        info.sent_check === 1
                          ? "choosed"
                          : ""
                      }`}
                      onClick={() => handleLabelClick(info.img_path)}
                    >
                      <img
                        src={process.env.REACT_APP_IMG + info.img_path}
                        srcSet={process.env.REACT_APP_IMG + info.img_path}
                        alt={info.img_path}
                        loading="lazy"
                        width={"100%"}
                        height={"100%"}
                      />
                    </label>

                    {selectedLabels.includes(info.img_path) ? (
                      <div className="checkmark-hadchoosed"></div>
                    ) : (
                      <></>
                    )}

                    {info.sent_check === 1 ? (
                      <div className="checkmark-hadsent"></div>
                    ) : (
                      <></>
                    )}
                  </ImageListItem>

                  <input
                    id={`choose-img-${info.img_path}`}
                    type="checkbox"
                    value={info.img_path}
                    style={{
                      display: "none",
                    }}
                    onChange={handleInputClick}
                  />
                </>
              );
            })}
          </ImageList>

          {nextImg[vt].loaded < imgList2[vt]?.length && (
            <Button
              className="modal-mission-data__load-more-btn"
              variant="outlined"
              onClick={() => handleLoadMore(vt)}
            >
              Load more
            </Button>
          )}
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
        onClick={() => setOpen(true)}
      >
        xem dữ liệu
      </Button>

      <Dialog fullScreen open={open}>
        <DialogTitle className="modal-mission-data__header">
          <FormControlLabel
            className="modal-mission-data__form-label"
            control={<Checkbox />}
            label="Ảnh bất thường"
            onChange={(e) => handleErrorImageBoxChecked(e)}
          />
          <div className="modal-mission-data__btn-group">
            <FlightManagePrintReportDialog
              implementation_date={implementation_date}
            />

            <FlightManageReportInformation />

            <Button
              className="modal-mission-data__submit-btn"
              variant="outlined"
              onClick={handleSubmit}
            >
              SUBMIT
            </Button>

            <Button
              className="modal-mission-data__close-btn"
              color="error"
              variant="contained"
              onClick={() => setOpen(false)}
            >
              <CloseIcon fontSize="small" />
            </Button>
          </div>
        </DialogTitle>
        <DialogContent className="modal-mission-data__body">
          <Grid container spacing={0} className="modal-mission-data__body">
            <Grid item className="modal-mission-data__list-mission" xs={2}>
              {renderListMission(timeFlyStart)}
            </Grid>
            <Grid item xs={10} className="modal-mission-data__img-list">
              {renderImageList()}
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModalMissionData;
