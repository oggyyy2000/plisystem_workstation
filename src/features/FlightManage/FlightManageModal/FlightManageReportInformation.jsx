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

const FlightManageReportInformation = ({
  schedule_id,
  // selectedLabels,
  // setHadSubmittedError,
  type_ticket,
  supervision_status,
}) => {
  const [openReportInformationDialog, setOpenReportInformationDialog] =
    useState(false);
  const [ticketField, setTicketField] = useState({});
  console.log(ticketField);

  // const urlPostFlightData = process.env.REACT_APP_API_URL + "flightdatas/";

  const [formData, setFormData] = useState({});
  console.log(formData);

  const handleTextFieldChange = (key, text) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: text,
    }));
  };

  useEffect(() => {
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
  }, [schedule_id, openReportInformationDialog]);

  // --------- Ham de submit tat ca cac anh nguoi dung chon --------
  // const handleSubmitAllImage = () => {
  //   const formData = new FormData();
  //   formData.append("schedule_id", schedule_id);
  //   formData.append("list_imageid", selectedLabels);

  //   console.log(schedule_id);

  //   axios
  //     .post(urlPostFlightData, formData)
  //     .then((response) => {
  //       if (response.status === 200) {
  //         alert("Tất cả ảnh đã chọn đã được gửi đi !");
  //         setHadSubmittedError(true);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });

  //   setOpenReportInformationDialog(true);
  // };

  const handleSubmitAllFieldText = () => {
    const postData = {
      schedule_id: schedule_id,
      results: formData,
    };

    console.log(postData);

    const urlPostAllFieldText =
      process.env.REACT_APP_API_URL + "sentticketdata/";
    axios
      .post(urlPostAllFieldText, postData, {
        "Content-Type": "application/json",
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const renderData = () => {
    return Object.keys(ticketField).map((key) => {
      const object = ticketField[key];
      return (
        <div key={key}>
          <p>{object.title}</p>
          <TextField
            label={"Type here... "}
            defaultValue={object.text ? object.text : ""}
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
            sx={{
              height: "38px",
              position: "absolute !important",
              top: 0,
              right: 0,
            }}
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
            SUBMIT
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FlightManageReportInformation;
