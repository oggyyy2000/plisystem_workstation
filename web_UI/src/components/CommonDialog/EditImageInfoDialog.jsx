import React, { useEffect } from "react";
import { useState } from "react";

import { toast } from "react-toastify";
import * as SupervisionDetailsService from "../../APIServices/SupervisionDetailsService";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Backdrop from "@mui/material/Backdrop";
import { InputAdornment, IconButton } from "@mui/material";
import { Box, FormControl, InputLabel, Select, MenuItem, TextField } from "@mui/material";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";

import styles from "./css/EditImageInfoDialog.module.css";

const EditImageInfoDialog = ({
  info,
  setLabelChanged,
  type_ticket,
  suggestOptionEditLabel,
}) => {
  const [openEditLabel, setOpenEditLabel] = useState("");
  const [objectName, setObjectName] = useState(info.image_label);
  const [errorName, setErrorName] = useState(info.image_title);

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

  const handleSubmitEditLabel = async () => {
    const data = {
      image_id: info.image_id,
      image_label: objectName,
      image_title: errorName,
    };

    const response = await SupervisionDetailsService.patchData(data);
    if (response) {
      toast.success("Cập nhật tình trạng đối tượng thành công !");
      setLabelChanged(true);
      setOpenEditLabel(false);
    }
  };

  return (
    <>
      <InputAdornment position="end">
        <IconButton
          edge="end"
          onClick={() => {
            setOpenEditLabel(info.image_path);
          }}
          disabled={info.sent_status === "sent"}
        >
          <FontAwesomeIcon
            icon={faPenToSquare}
            color={info.sent_status === "sent" ? "#a0a0a0" : "#3D8AF7"}
          />
        </IconButton>
      </InputAdornment>
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
                {type_ticket &&
                  suggestOptionEditLabel &&
                  Object.keys(suggestOptionEditLabel[type_ticket]).map(
                    (value) => (
                      <MenuItem value={value}>
                        {suggestOptionEditLabel[type_ticket][value].name_v}
                      </MenuItem>
                    )
                  )}
              </Select>
            </FormControl>
          </Box>
          <Box className={styles.chooseOptions}>
            {
              type_ticket &&
              objectName &&
              suggestOptionEditLabel[type_ticket][objectName]?.defect &&
              suggestOptionEditLabel[type_ticket][objectName]?.defect.length > 0 ? (
                <FormControl fullWidth>
                  <InputLabel>Tên lỗi</InputLabel>
                  <Select
                    defaultValue={errorName}
                    value={errorName}
                    renderValue={(value) => `${value}`}
                    label="Tên lỗi"
                    onChange={(e) => handleChangeErrorName(e)}
                  >
                    {suggestOptionEditLabel[type_ticket][objectName]?.defect.map(
                      (errorList) => (
                        <MenuItem value={errorList}>{errorList}</MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  multiline
                  defaultValue={errorName}
                  fullWidth
                  onChange={(e) => handleChangeErrorName(e)}
                />
              )
            }
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
