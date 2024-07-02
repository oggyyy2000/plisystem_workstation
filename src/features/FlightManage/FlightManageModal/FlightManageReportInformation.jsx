import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import PostAddIcon from "@mui/icons-material/PostAdd";

import Loading from "../../../components/LoadingPage/LoadingPage";
import styles from "./css/FlightManageReportInformation.module.css";

const FlightManageReportInformation = ({ schedule_id, supervision_status }) => {
  const [openReportInformationDialog, setOpenReportInformationDialog] =
    useState(false);
  const [ticketField, setTicketField] = useState({});
  console.log(ticketField);

  const [formData, setFormData] = useState({});
  console.log(formData);

  // check variable
  const [sendClicked, setSendClicked] = useState(false);

  const handleTextFieldChange = (key, text) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: text,
    }));
  };

  useEffect(() => {
    setSendClicked(false);
    if (openReportInformationDialog === true) {
      const urlGetObjectSentTicket =
        process.env.REACT_APP_API_URL +
        "geticketdata/?schedule_id=" +
        schedule_id;
      axios
        .get(urlGetObjectSentTicket)
        .then((response) => {
          console.log(response.data); // The response data will be available here
          setTicketField(response.data);
          const ticketText = Object.keys(response.data).reduce((acc, key) => {
            acc[key] = response.data[key].text;
            return acc;
          }, {});
          setFormData(ticketText);
        })
        .catch((error) => {
          console.error(error); // Handle errors
        });
    }
  }, [schedule_id, supervision_status, openReportInformationDialog]);

  const handleSubmitAllFieldText = () => {
    setSendClicked(true);

    const postData = {
      schedule_id: schedule_id,
      results: formData,
    };

    console.log(postData);

    const urlPostAllFieldText =
      process.env.REACT_APP_API_URL + "sentticketdata/";
    const confirmed = window.confirm("Bạn chắc chắn muốn gửi ?");
    if (confirmed) {
      axios
        .post(urlPostAllFieldText, postData, {
          "Content-Type": "application/json",
        })
        .then((response) => {
          console.log(response.data);
          setSendClicked(false);
          alert("Gửi thông tin báo cáo thành công !");
          setOpenReportInformationDialog(false);
        })
        .catch((error) => {
          console.error(error);
          alert(
            // "Gửi thông tin báo cáo không thành công. Không có phản hồi từ server !"
            error.response.data.error_description
          );
          setSendClicked(false);
        });
    } else {
      // Handle cancel scenario
      console.log("Cancelled.");
    }
  };

  const renderData = () => {
    return Object.keys(ticketField).map((key) => {
      const object = ticketField[key];
      console.log(object);
      return (
        <div key={key}>
          <p>{object.title}</p>
          <TextField
            label={"Type here... "}
            multiline
            defaultValue={object.text ? object.text.slice(1) : ""}
            fullWidth
            onChange={(e) => handleTextFieldChange(key, e.target.value)}
          />
        </div>
      );
    });
  };

  return (
    <>
      <Button
        className="modal-mission-data__print-btn"
        variant="contained"
        color="success"
        sx={{
          position: "absolute",
          zIndex: 9999,
          bottom: "30px",
          right: "20px",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
        }}
        onClick={() => setOpenReportInformationDialog(true)}
      >
        <PostAddIcon fontSize="large" />
      </Button>
      <Dialog
        fullWidth
        maxWidth="md"
        scroll="paper"
        open={openReportInformationDialog}
        onClose={() => setOpenReportInformationDialog(false)}
      >
        <DialogTitle style={{ textAlign: "center" }}>
          NỘI DUNG KIỂM TRA <br /> (Lưu ý mỗi ngày bay chỉ được gửi 1 lần duy
          nhất)
          <Button
            className={styles.buttonClose}
            color="error"
            variant="contained"
            onClick={() => setOpenReportInformationDialog(false)}
          >
            <CloseIcon fontSize="small" />
          </Button>
        </DialogTitle>
        <DialogContent>
          {Object.keys(ticketField).length > 0 ? renderData() : <></>}
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            disabled={supervision_status === "not_done" ? false : true}
            variant="contained"
            onClick={() => handleSubmitAllFieldText()}
          >
            Gửi thông tin báo cáo
          </Button>
        </DialogActions>

        {sendClicked === true ? <Loading /> : <></>}
      </Dialog>
    </>
  );
};

export default FlightManageReportInformation;
