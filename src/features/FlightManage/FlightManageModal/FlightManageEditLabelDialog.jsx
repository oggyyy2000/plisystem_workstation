import React from "react";
import { useState } from "react";
import axios from "axios";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Backdrop from "@mui/material/Backdrop";

import EditIcon from "@mui/icons-material/Edit";
import "../css/FlightManageEditLabelDialog.css"

const errorLabel = [
  "binhthuong",
  "cachdientt-vobat",
  "cachdienslc-rachtan",
  "daydien-tuasoi",
  "macdivat",
  "mongcot-satlo",
  "troita",
];

const FlightManageEditLabelDialog = ({ info, setLabelChanged }) => {
  //edit label dialog variable
  const [openEditLabel, setOpenEditLabel] = useState("");
  const [imageNewLabels, setImageNewLabels] = useState([]);
  console.log(imageNewLabels);
  const [editLabelSelectedValue, setEditLabelSelectedValue] = useState([]);

  const urlPostNewImageLabel =
    process.env.REACT_APP_API_URL + "supervisiondetails/";


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
        if (response.status === 200) {
          setLabelChanged(true);
          alert("Đổi nhãn thành công!");
        }
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

  return (
    <>
      <Button
        className="modal-mission-data__edit-btn"
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

export default FlightManageEditLabelDialog;
