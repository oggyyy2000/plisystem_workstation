import React, { useEffect } from "react";
import { useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Box,
  TextField,
  Backdrop,
  Modal,
  Fade,
  FormControlLabel,
  Checkbox,
  Grid,
  ImageList,
  ImageListItem,
  DialogTitle,
} from "@mui/material";

import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import CropFreeIcon from "@mui/icons-material/CropFree";

import "./css/DemoFlightDialogAfterFly.css";

const errorLabel = [
  "binhthuong",
  "cachdientt-vobat",
  "cachdienslc-rachtan",
  "daydien-tuasoi",
  "macdivat",
  "mongcot-satlo",
  "troita",
];

const infoImage = {
  VT4: [
    {
      label: "daydien-tuasoi",
      img_path:
        "/Supervision_Database/T87/2023-10-16/supervision_results/10h37p/powerline_devices/T87_VT4_20.986038-105.863553-34_2023-10-16_defect_daydien-tuasoi.jpg",
      sent_check: 1,
    },
    {
      label: "daydien-tuasoi_macdivat",
      img_path:
        "/Supervision_Database/T87/2023-10-16/supervision_results/10h37p/powerline_devices/T87_VT4_20.986297-105.863523-34_2023-10-16_defect_daydien-tuasoi_macdivat.jpg",
      sent_check: 1,
    },
    {
      label: "troita",
      img_path:
        "/Supervision_Database/T87/2023-10-16/supervision_results/10h37p/powerline_devices/T87_VT4_20.986459-105.863470-34_2023-10-16_defect_troita.jpg",
      sent_check: 1,
    },
    {
      label: "binhthuong",
      img_path:
        "/Supervision_Database/T87/2023-10-16/supervision_results/10h37p/powerline_devices/T87_VT4_20.985955-105.863385-49_2023-10-16_normal.jpg",
      sent_check: 0,
    },
    {
      label: "binhthuong",
      img_path:
        "/Supervision_Database/T87/2023-10-16/supervision_results/10h37p/powerline_devices/T87_VT4_20.986559-105863498-34_2023-10-16_normal.jpg",
      sent_check: 1,
    },
    {
      label: "binhthuong",
      img_path:
        "/Supervision_Database/T87/2023-10-16/supervision_results/10h37p/powerline_devices/T87_VT4_20.985946-105.863335-42_2023-10-16_normal.jpg",
      sent_check: 0,
    },
    {
      label: "binhthuong",
      img_path:
        "/Supervision_Database/T87/2023-10-16/supervision_results/10h37p/powerline_devices/T87_VT4_20.985960-105.863519-34_2023-10-16_normal.jpg",
      sent_check: 0,
    },
    {
      label: "binhthuong",
      img_path:
        "/Supervision_Database/T87/2023-10-16/supervision_results/10h37p/powerline_devices/T87_VT4_20.986202-105.863494-34_2023-10-16_normal.jpg",
      sent_check: 0,
    },
  ],
  VT5: [
    {
      label: "daydien-tuasoi",
      img_path:
        "/Supervision_Database/T87/2023-10-16/supervision_results/10h37p/powerline_devices/T87_VT5_20.987240-105.863388-34_2023-10-16_defect_daydien-tuasoi.jpg",
      sent_check: 1,
    },
    {
      label: "macdivat",
      img_path:
        "/Supervision_Database/T87/2023-10-16/supervision_results/10h37p/powerline_devices/T87_VT5_20.987629-105.863390-34_2023-10-16_defect_macdivat.jpg",
      sent_check: 1,
    },
    {
      label: "binhthuong",
      img_path:
        "/Supervision_Database/T87/2023-10-16/supervision_results/10h37p/powerline_devices/T87_VT5_20.986811-105.863473-34_2023-10-16_normal.jpg",
      sent_check: 1,
    },
    {
      label: "binhthuong",
      img_path:
        "/Supervision_Database/T87/2023-10-16/supervision_results/10h37p/powerline_devices/T87_VT5_20.987087-105.863447-34_2023-10-16_normal.jpg",
      sent_check: 1,
    },
    {
      label: "binhthuong",
      img_path:
        "/Supervision_Database/T87/2023-10-16/supervision_results/10h37p/powerline_devices/T87_VT5_20.987775-105.863340-34_2023-10-16_normal.jpg",
      sent_check: 0,
    },
    {
      label: "binhthuong",
      img_path:
        "/Supervision_Database/T87/2023-10-16/supervision_results/10h37p/powerline_devices/T87_VT5_20.986989-105.863416-34_2023-10-16_normal.jpg",
      sent_check: 0,
    },
    {
      label: "binhthuong",
      img_path:
        "/Supervision_Database/T87/2023-10-16/supervision_results/10h37p/powerline_devices/T87_VT5_20.986726-105863442-34_2023-10-16_normal.jpg",
      sent_check: 0,
    },
    {
      label: "binhthuong",
      img_path:
        "/Supervision_Database/T87/2023-10-16/supervision_results/10h37p/powerline_devices/T87_VT5_20.987515-1058633.5-34_2023-10-16_normal.jpg",
      sent_check: 1,
    },
    {
      label: "binhthuong",
      img_path:
        "/Supervision_Database/T87/2023-10-16/supervision_results/10h37p/powerline_devices/T87_VT5_20.987339-105.863420-34_2023-10-16_normal.jpg",
      sent_check: 0,
    },
  ],
  VT6: [
    {
      label: "macdivat",
      img_path:
        "/Supervision_Database/T87/2023-10-16/supervision_results/10h37p/powerline_devices/T87_VT6_20.988394-105.863316-34_2023-10-16_defect_macdivat.jpg",
      sent_check: 1,
    },
    {
      label: "binhthuong",
      img_path:
        "/Supervision_Database/T87/2023-10-16/supervision_results/10h37p/powerline_devices/T87_VT6_20.988031-105.863313-34_2023-10-16_normal.jpg",
      sent_check: 1,
    },
    {
      label: "binhthuong",
      img_path:
        "/Supervision_Database/T87/2023-10-16/supervision_results/10h37p/powerline_devices/T87_VT6_20.987887-105.863364-34_2023-10-16_normal.jpg",
      sent_check: 0,
    },
    {
      label: "binhthuong",
      img_path:
        "/Supervision_Database/T87/2023-10-16/supervision_results/10h37p/powerline_devices/T87_VT6_20.988282-105.863285-34_2023-10-16_normal.jpg",
      sent_check: 0,
    },
    {
      label: "binhthuong",
      img_path:
        "/Supervision_Database/T87/2023-10-16/supervision_results/10h37p/powerline_devices/T87_VT6_20.988148-105.863335-34_2023-10-16_normal.jpg",
      sent_check: 0,
    },
  ],
};

const DemoFlightDialogAfterFly = () => {
  // modal after fly variable
  const [openModalAfterFly, setOpenModalAfterFly] = useState(false);
  // const [errorImageBoxChecked, setErrorImageBoxChecked] = useState(false);
  const [openZoomingImg, setOpenZoomingImg] = useState("");
  const [openEditLabel, setOpenEditLabel] = useState("");
  // const [imgList2, setImgList2] = useState({});
  const [imageNewLabels, setImageNewLabels] = useState([]);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [editLabelSelectedValue, setEditLabelSelectedValue] = useState([]);
  // const [getImgData, setGetImgData] = useState("");

  //check variable change
  // const [change, setChange] = useState(false);
  const [checked, setChecked] = useState([]);
  const [hadSubmittedError, setHadSubmittedError] = useState(false);

    
    useEffect(() => {
      setHadSubmittedError(false);
    }, [hadSubmittedError])

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
    // setErrorImageBoxChecked(e.target.checked);
  };

  // --------- Ham de submit tat ca cac anh nguoi dung chon --------
  const handleSubmitErrorImage = () => {
    setHadSubmittedError(false);
    Object.keys(infoImage).forEach((vt) => {
      infoImage[vt].map((info) => {
        if (checked.includes(info.img_path)) {
          info.sent_check = 1;
          console.log(info.sent_check);
        }
        return info.sent_check;
      });
    });

    alert("Submit Success");
    setHadSubmittedError(true);
  };

  // ------------ Zooming Dialog ------------

  const zoomingDialog = (info) => {
    return (
      <>
        <Button
          className="modal-afterfly__zoom-btn"
          variant="contained"
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
  };
  // console.log(imageNewLabels);

  const isDisabled = (value) => {
    return (
      (editLabelSelectedValue.includes("binhthuong") ||
        imageNewLabels.includes("binhthuong")) &&
      value !== "binhthuong"
    );
  };

  const handleSubmitEditLabel = (imageLink) => {
    Object.keys(infoImage).forEach((vt) => {
      infoImage[vt].map((info) => {
        if (info.img_path === imageLink) {
          return (info.label = imageNewLabels.join(", "));
        }
        return info.label;
      });
    });

    alert("Thay đổi nhãn thành công!");
    setOpenEditLabel(false);
  };

  const editLabelDialog = (info) => {
    return (
      <>
        <Button
          className="modal-afterfly__edit-btn"
          variant="contained"
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

  const renderImageList = () => {
    return Object.keys(infoImage).map((vt) => {
      return (
        <>
          <div>
            <div className="line-seperate-items"></div>

            <div className="modal-afterfly__img-list-title">{vt}</div>

            <ImageList
              sx={{
                position: "relative",
                overflowY: "hidden",
              }}
              cols={3}
            >
              {infoImage[vt].map((info, index) => {
                return (
                  <>
                    <ImageListItem key={index}>
                      <div className="modal-afterfly__img-list-items-header">
                        <TextField
                          id="outlined-multiline-flexible"
                          label="Tình trạng"
                          value={info.label.split(", ").join("\n")}
                          multiline // multiline của TextField MUI đang lỗi
                          maxRows={3}
                          style={{ height: "70%", marginTop: "7px" }}
                          disabled
                        />
                        <div>
                          {/* Zoom Dialog */}
                          {zoomingDialog(info)}

                          {/* Edit label Dialog */}
                          {editLabelDialog(info)}
                        </div>
                      </div>

                      {/* <div className="modal-afterfly__img-list-items-body"> */}
                      <label
                        for={`choose-img-${info.img_path}`}
                        className={`modal-afterfly__img-list-items-label ${
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
                      {/* </div> */}
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
  return (
    <>
      {/* Modal after fly */}
      <Button
        className="btn-showmodal"
        variant="contained"
        onClick={() => setOpenModalAfterFly(true)}
      >
        OpenModalAfterFly
        <FlightTakeoffIcon />
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModalAfterFly}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openModalAfterFly}>
          <Box
            className="modal-afterfly"
            sx={{
              bgcolor: "background.paper",
            }}
          >
            <Grid container spacing={0}>
              <Grid item className="modal-afterfly__header" xs={12}>
                <FormControlLabel
                  className="modal-afterfly__form-label"
                  control={<Checkbox />}
                  label="Ảnh bất thường"
                  onChange={handleErrorImageBoxChecked}
                />

                <div className="modal-afterfly__btn-group">
                  <Button
                    className="modal-afterfly__submit-btn"
                    variant="outlined"
                    onClick={handleSubmitErrorImage}
                  >
                    SUBMIT
                  </Button>

                  <Button
                    className="modal-afterfly__close-btn"
                    color="error"
                    variant="contained"
                    onClick={() => setOpenModalAfterFly(false)}
                  >
                    <CloseIcon fontSize="small" />
                  </Button>
                </div>
              </Grid>
              <Grid item className="modal-afterfly__body" xs={12}>
                <div className="modal-afterfly__img-list">
                  {renderImageList()}
                </div>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default DemoFlightDialogAfterFly;
