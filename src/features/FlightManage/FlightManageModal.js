import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Grid } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import CropFreeIcon from "@mui/icons-material/CropFree";

import "./css/FlightManageModal.css";

const errorLabel = [
  "binhthuong",
  "cachdientt-vobat",
  "cachdienslc-rachtan",
  "daydien-tuasoi",
  "macdivat",
  "mongcot-satlo",
  "troita",
];

export default function HomeModal({ schedule_id }) {
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

  //zooming dialog variable
  const [openZoomingImg, setOpenZoomingImg] = useState("");

  //edit label dialog variable
  const [openEditLabel, setOpenEditLabel] = useState("");
  const [imageNewLabels, setImageNewLabels] = useState([]);
  console.log(imageNewLabels);
  const [editLabelSelectedValue, setEditLabelSelectedValue] = useState([]);

  //check variable change
  const [change, setChange] = useState(false);
  const [checked, setChecked] = useState([]);
  const [hadSubmittedError, setHadSubmittedError] = useState(false);

  const urlViewData =
    process.env.REACT_APP_API_URL +
    "supervisionschedules/?schedule_id=" +
    schedule_id;
  console.log(urlViewData);
  const urlPostFlightData = process.env.REACT_APP_API_URL + "flightdatas/";
  const urlPostNewImageLabel =
    process.env.REACT_APP_API_URL + "supervisiondetails/";
  const urlGetData =
    process.env.REACT_APP_API_URL +
    "supervisiondetails/?spv_results_path=" +
    getImgData +
    `&img_state=${errorImageBoxChecked === true ? "defect" : "all"}`;

  useEffect(() => {
    setChecked([]);
    setSelectedLabels([]);
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
    setChange(false);
    setImageNewLabels([]);
    setHadSubmittedError(false);

    axios
      .get(urlGetData)
      .then((res) => {
        setImgList2(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [
    getImgData,
    change,
    hadSubmittedError,
    errorImageBoxChecked,
    selectedLabels,
    open,
    urlGetData
  ]);

  // TEST

  // const handleChooseAllBoxChecked = (e) => {
  //   if(e.target.checked) {
  //     Object.keys(imgList2).map((vt) => {
  //       return imgList2[vt].map((info, index) => {
  //         console.log("not if sent_check:",index, info)
  //         if(info.sent_check === 0) {
  //           // return setChecked([info.img_path])
  //         }
  //       })
  //     })
  //   }
  // }

  // ------------ Main Manage Modal Dialog ------------

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

  const renderImageList = () => {
    return Object.keys(imgList2).map((vt) => {
      return (
        <>
          <div>
            <div className="flightmanage-line-seperate-items"></div>

            <div className="flightmanage-imagelist-title">{vt}</div>
            <ImageList
              sx={{
                position: "relative",
                overflowY: "hidden",
              }}
              cols={3}
            >
              {imgList2[vt].map((info, index) => {
                return (
                  <>
                    <ImageListItem key={index}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <TextField
                          id="outlined-multiline-flexible"
                          label="Tình trạng"
                          value={info.label.split("_").join("\n")}
                          multiline
                          maxRows={3}
                          style={{ height: "90%", marginTop: "7px" }}
                          disabled
                        />

                        <div>
                          {/* Zoom Dialog */}
                          {zoomingDialog(info)}
                          {/* Edit label Dialog */}
                          {editLabelDialog(info)}
                        </div>
                      </div>

                      <label
                        for={`choose-img-${info.img_path}`}
                        className={`flightmanage-imagelist-label ${
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
          </div>
        </>
      );
    });
  };

  const renderListData = (timeFlyStart) => {
    return (
      <>
        {timeFlyStart.map((timeflystart) => {
          console.log(timeflystart === chooseTime);
          return (
            <>
              <div
                className={`flightmanage-listdata-item ${
                  timeflystart === chooseTime ? "onclick" : ""
                }`}
                onClick={(e) => {
                  setChooseTime(e.target.innerText);
                }}
              >
                <div className="flightmanage-listdataitem-title">
                  {timeflystart}
                </div>
              </div>
            </>
          );
        })}
      </>
    );
  };

  // ------------ Zooming Dialog ------------

  const zoomingDialog = (info) => {
    return (
      <>
        <Button
          variant="contained"
          style={{
            marginRight: "10px",
            minHeight: "35px",
            minWidth: "10px",
            top: 0,
            right: 0,
          }}
          onClick={() => setOpenZoomingImg(info.img_path)}
        >
          <CropFreeIcon />
        </Button>

        <Dialog
          open={openZoomingImg === info.img_path ? true : false}
          onClose={() => setOpenZoomingImg(false)}
          sx={{
            "& .MuiDialog-container": {
              justifyContent: "flex-start",
              alignItems: "flex-start",
            },
          }}
          PaperProps={{
            sx: {
              height: "681px",
              width: "1535px",
              maxWidth: "1535px",
            },
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <img
            src={process.env.REACT_APP_IMG + info.img_path}
            srcSet={process.env.REACT_APP_IMG + info.img_path}
            alt={info.img_path}
            loading="lazy"
            width={"100%"}
            height={"100%"}
          />
        </Dialog>
      </>
    );
  };

  // ------------- Edit Label Dialog---------------

  const handleCheckboxChooseNewLabel = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setImageNewLabels([...imageNewLabels, value]);
    } else {
      setImageNewLabels(imageNewLabels.filter((label) => label !== value));
    }

    if (value === "binhthuong" || imageNewLabels === "binhthuong") {
      if (editLabelSelectedValue.includes(value)) {
        setImageNewLabels([]);
        setEditLabelSelectedValue([]);
      } else {
        setImageNewLabels([value]);
        setEditLabelSelectedValue([value]);
      }
    } else {
      setEditLabelSelectedValue([value]);
    }

    console.log(imageNewLabels);
  };

  const handleSubmitEditLabel = (imageLink) => {
    const imageLabel = {
      img_path: imageLink,
      new_label: imageNewLabels.join("_"),
    };

    axios
      .post(urlPostNewImageLabel, imageLabel)
      .then((response) => {
        console.log(response);
        if (response.status === 200) setChange(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const isDisabled = (value) => {
    return (
      (editLabelSelectedValue.includes("binhthuong") ||
        imageNewLabels.includes("binhthuong")) &&
      value !== "binhthuong"
    );
  };

  const editLabelDialog = (info) => {
    return (
      <>
        <Button
          variant="contained"
          style={{
            minHeight: "35px",
            minWidth: "10px",
            top: 0,
            right: 0,
          }}
          onClick={() => {
            setOpenEditLabel(info.img_path);
            setImageNewLabels([...info.label.split("_")]);
          }}
          disabled={info.sent_check === 1}
        >
          <EditIcon />
        </Button>
        <Dialog
          sx={{
            "& .MuiDialog-paper": {
              width: "80%",
              maxHeight: 435,
            },
          }}
          maxWidth="xs"
          open={openEditLabel === info.img_path ? true : false}
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              sx: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          }}
        >
          <DialogTitle>Cập nhật nhãn bất thường</DialogTitle>
          <DialogContent dividers>
            {errorLabel.map((label) => (
              <label key={label} style={{ fontSize: "20px" }}>
                <input
                  type="checkbox"
                  value={label}
                  checked={imageNewLabels.includes(label)}
                  onChange={(e) => handleCheckboxChooseNewLabel(e)}
                  disabled={isDisabled(label)}
                />
                {label} <br />
              </label>
            ))}
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => setOpenEditLabel(false)}>
              Hủy
            </Button>
            <Button onClick={() => handleSubmitEditLabel(info.img_path)}>
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  return (
    <div>
      <Button
        style={{
          backgroundColor: "chartreuse",
          borderRadius: "10%",
          color: "white",
        }}
        onClick={() => setOpen(true)}
      >
        xem dữ liệu
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box
            className="flightmanage"
            sx={{
              bgcolor: "background.paper",
            }}
          >
            <Grid container className="flightmanage-container" spacing={0}>
              <Grid item className="flightmanage-listdata" xs={2}>
                {renderListData(timeFlyStart)}
              </Grid>
              <Grid container xs={10}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Ảnh bất thường"
                    style={{ margin: 0, height: "33px" }}
                    onChange={(e) => handleErrorImageBoxChecked(e)}
                  />
                  {/* <FormControlLabel
                    control={<Checkbox />}
                    label="Chọn tất cả"
                    style={{ margin: 0, height: "33px" }}
                    onChange={(e) => handleChooseAllBoxChecked(e)}
                  /> */}

                  <Button
                    variant="outlined"
                    onClick={handleSubmit}
                    style={{
                      marginLeft: "740px",
                      backgroundColor: "#1976d2",
                      color: "white",
                      height: "33px",
                    }}
                  >
                    SUBMIT
                  </Button>

                  <Button
                    className="flightmanage-btn-close"
                    color="error"
                    variant="contained"
                    onClick={() => setOpen(false)}
                  >
                    <CloseIcon fontSize="small" />
                  </Button>
                </Grid>
                <Grid item className="flightmanage-imgdata" xs={12}>
                  <div className="flightmanage-imgdata-container">
                    <div className="flightmanage-imagelist">
                      {renderImageList()}
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
