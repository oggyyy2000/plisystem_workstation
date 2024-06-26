import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Backdrop from "@mui/material/Backdrop";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import styles from "./css/EditImageInfoDialog.module.css";
// import suggestOptionEditLabel from "../JSONfile/suggestOptionEditLabel.json";

const EditImageInfoDialog = ({
  info,
  setLabelChanged,
  type_ticket,
  suggestOptionEditLabel,
}) => {
  const [openEditLabel, setOpenEditLabel] = useState("");
  const [objectName, setObjectName] = useState(info.image_label);
  const [errorName, setErrorName] = useState(info.image_title);
  console.log("suggestOptionEditLabel: ", suggestOptionEditLabel);

  useEffect(() => {
    if (openEditLabel && suggestOptionEditLabel !== undefined) {
      const hasColon = info.image_label.indexOf(":") !== -1;
      if (hasColon) {
        const parts = info.image_label.split(":");
        setObjectName(parts[0]);
      } else {
        setObjectName(info.image_label);
      }
      setErrorName(info.image_title);
    }
  }, [openEditLabel, info, suggestOptionEditLabel]);

  const urlPatchImageLabel =
    process.env.REACT_APP_API_URL + "supervisiondetails/";

  // translate to Vietnamese function
  const transformDataToDictionary = (data) => {
    const translations = {};

    for (const category in data) {
      const subCategory = data[category];
      for (const key in subCategory) {
        const term = subCategory[key];
        translations[key] = term.name_v;
      }
    }

    return translations;
  };

  const translateToVietnamese = (englishTerm) => {
    const translations = transformDataToDictionary(suggestOptionEditLabel);
    return translations[englishTerm] || englishTerm; // Fallback to original term if not found
  };

  const handleChangeObjectName = (e) => {
    setObjectName(e.target.value);
    setErrorName("");
  };

  const handleChangeErrorName = (e) => {
    setErrorName(e.target.value);
  };

  const handleSubmitEditLabel = () => {
    const data = {
      image_id: info.image_id,
      image_label: objectName,
      image_title: errorName,
    };

    axios
      .patch(urlPatchImageLabel, data)
      .then((response) => {
        if (response.status === 200)
          alert("Cập nhật tình trạng đối tượng thành công !");
        setLabelChanged(true);
        setOpenEditLabel(false);
      })
      .catch((error) => {
        console.error(
          "Cập nhật tình trạng đối tượng không thành công !",
          error
        );
        alert(
          "Cập nhật tình trạng đối tượng không thành công. Vui lòng kiểm tra lại thông tin ảnh !"
        );
      });
  };

  return (
    <>
      <Button
        className={styles.editBtn}
        variant="contained"
        onClick={() => {
          setOpenEditLabel(info.image_path);
        }}
        disabled={info.sent_status === "sent"}
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
        open={openEditLabel === info.image_path ? true : false}
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
          <Box className={styles.chooseOptions}>
            <FormControl fullWidth>
              <InputLabel>Tên đối tượng</InputLabel>
              <Select
                defaultValue={objectName}
                renderValue={(value) => `${translateToVietnamese(value)}`}
                label="Tên đối tượng"
                onChange={(e) => handleChangeObjectName(e)}
              >
                {type_ticket === "D" && suggestOptionEditLabel !== undefined
                  ? Object.keys(suggestOptionEditLabel.D).map((value) => (
                      <MenuItem value={value}>
                        {suggestOptionEditLabel.D[value].name_v}
                      </MenuItem>
                    ))
                  : Object.keys(suggestOptionEditLabel.N).map((value) => (
                      <MenuItem value={value}>
                        {suggestOptionEditLabel.N[value].name_v}
                      </MenuItem>
                    ))}
              </Select>
            </FormControl>
          </Box>
          <Box className={styles.chooseOptions}>
            <FormControl fullWidth>
              <InputLabel>Tên lỗi</InputLabel>
              <Select
                defaultValue={errorName}
                value={errorName}
                renderValue={(value) => `${value}`}
                label="Tên lỗi"
                onChange={(e) => handleChangeErrorName(e)}
              >
                {type_ticket === "D" &&
                objectName &&
                suggestOptionEditLabel !== undefined ? (
                  suggestOptionEditLabel?.D[objectName]?.defect.map(
                    (errorList) => (
                      <MenuItem value={errorList}>{errorList}</MenuItem>
                    )
                  )
                ) : type_ticket === "N" &&
                  objectName &&
                  suggestOptionEditLabel !== undefined ? (
                  suggestOptionEditLabel?.N[objectName]?.defect.map(
                    (errorList) => (
                      <MenuItem value={errorList}>{errorList}</MenuItem>
                    )
                  )
                ) : (
                  <></>
                )}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              setOpenEditLabel(false);
              setObjectName(info.image_label);
              setErrorName(info.image_title);
            }}
          >
            Hủy
          </Button>
          <Button onClick={handleSubmitEditLabel}>Xác nhận</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditImageInfoDialog;
