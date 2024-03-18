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
import suggestOptionEditLabel from "../JSONfile/suggestOptionEditLabel.json";

const EditImageInfoDialog = ({ info, setLabelChanged, type_ticket }) => {
  //edit label dialog variable
  const [openEditLabel, setOpenEditLabel] = useState("");
  const [objectName, setObjectName] = useState(info.image_label);
  console.log(objectName);
  const [errorName, setErrorName] = useState(info.image_title);
  // const [objectStatus, setObjectStatus] = useState(info.image_status);

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
      // setObjectStatus(info.image_status);
    }
  }, [openEditLabel, info]);

  const urlPatchImageLabel =
    process.env.REACT_APP_API_URL + "supervisiondetails/";

  // const handleChangeObjectStatus = (e) => {
  //   setObjectStatus(e.target.value);
  // };

  const handleChangeObjectName = (e) => {
    setObjectName(e.target.value);
  };

  const handleChangeErrorName = (e) => {
    setErrorName(e.target.value);
  };

  const handleSubmitEditLabel = () => {
    const data = {
      image_id: info.image_id,
      image_label: objectName,
      image_title: errorName,
      // image_status: objectStatus,
    };

    axios
      .patch(urlPatchImageLabel, data)
      .then((response) => {
        if (response.status === 200) alert("Data patched successfully");
        setLabelChanged(true);
        setOpenEditLabel(false);
      })
      .catch((error) => {
        console.error("Error patching data:", error);
      });
  };
  // console.log(suggestOptionEditLabel.phieungay.hanhlang.name_v);

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
                renderValue={(value) => `${value}`}
                label="Tên đối tượng"
                onChange={(e) => handleChangeObjectName(e)}
              >
                {type_ticket === "D" && suggestOptionEditLabel !== undefined
                  ? Object.keys(suggestOptionEditLabel.phieungay).map(
                      (value) => (
                        <MenuItem value={value}>
                          {suggestOptionEditLabel.phieungay[value].name_v}
                        </MenuItem>
                      )
                    )
                  : Object.keys(suggestOptionEditLabel.phieudem).map(
                      (value) => (
                        <MenuItem value={value}>
                          {suggestOptionEditLabel.phieudem[value].name_v}
                        </MenuItem>
                      )
                    )}
              </Select>
            </FormControl>
          </Box>
          <Box className={styles.chooseOptions}>
            <FormControl fullWidth>
              <InputLabel>Tên lỗi</InputLabel>
              <Select
                defaultValue={errorName}
                renderValue={(value) => `${value}`}
                label="Tên lỗi"
                onChange={(e) => handleChangeErrorName(e)}
              >
                {type_ticket === "D" &&
                objectName &&
                suggestOptionEditLabel !== undefined ? (
                  suggestOptionEditLabel?.phieungay[objectName]?.defect.map(
                    (errorList) => (
                      <MenuItem value={errorList}>{errorList}</MenuItem>
                    )
                  )
                ) : type_ticket === "N" &&
                  objectName &&
                  suggestOptionEditLabel !== undefined ? (
                  suggestOptionEditLabel?.phieudem[objectName]?.defect.map(
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
          {/* <Box className={styles.chooseOptions}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                defaultValue={objectStatus}
                label="Trạng thái"
                onChange={(e) => handleChangeObjectStatus(e)}
              >
                <MenuItem value={"defect"}>Có lỗi</MenuItem>
                <MenuItem value={"normal"}>Không có lỗi</MenuItem>
              </Select>
            </FormControl>
          </Box> */}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setOpenEditLabel(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmitEditLabel}>Xác nhận</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditImageInfoDialog;
