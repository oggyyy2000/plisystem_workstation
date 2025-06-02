import React, { useState } from "react";

import { toast } from "react-toastify";
// import * as GetTicketDataService from "../../../APIServices/GetTicketDataService";
import * as SentTicketDataService from "../../../APIServices/SentTicketDataService";

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

import styles from "./css/FlightManageReportInformation.module.css";
import Loading from "../../../components/LoadingPage/LoadingPage";

const FlightManageReportInformation = ({
  ticketInfo,
  setTicketInfo,
  scheduleId,
  supervisionStatus,
  typeTicket,
  openReportInformationDialog,
  setOpenReportInformationDialog,
}) => {
  console.log("ticketInfoFlightManageReportInformation: ", ticketInfo);

  // check variable
  const [sendClicked, setSendClicked] = useState(false);

  // useEffect(() => {
  //   setSendClicked(false);
  //   if (openReportInformationDialog) {
  //     const type =
  //       typeTicket === "KT01" || typeTicket === "KT03"
  //         ? "results"
  //         : (typeTicket === "KT02" || typeTicket === "KT04") && "data";
  //     const getReportField = async () => {
  //       const response = await GetTicketDataService.getData(scheduleId, type);
  //       if (response) {
  //         setTicketInfo(response);
  //       }
  //     };
  //     getReportField();
  //   } else {
  //     setTicketInfo({});
  //   }
  // }, [scheduleId, supervisionStatus, typeTicket, openReportInformationDialog]);

  const handleOpenInformationDialog = () => {
    setOpenReportInformationDialog(true);
  };

  const handleCloseInformationDialog = () => {
    setOpenReportInformationDialog(false);
  };

  const handleTextFieldChange = (key, text) => {
    console.log("key: ", key);
    console.log("text: ", text);
    setTicketInfo((prevData) => ({
      ...prevData,
      results: {
        ...prevData.results,
        [key]: {
          ...prevData.results[key],
          text: text,
        },
      },
    }));
  };

  const handleSubmitAllFieldText = async () => {
    setSendClicked(true);

    const postData = {
      results: ticketInfo.results,
      schedule_id: scheduleId,
      type: typeTicket,
    };

    const confirmed = window.confirm("Bạn chắc chắn muốn gửi ?");
    if (confirmed) {
      const response = await SentTicketDataService.postData(postData);
      if (response) {
        toast.success("Gửi thông tin báo cáo thành công !", {
          onClose: () => {
            setSendClicked(false);
            setOpenReportInformationDialog(false);
            window.location.reload();
          },
        });
      } else {
        setSendClicked(false);
      }
    } else {
      setSendClicked(false);
      toast.error("Đã hủy gửi thông tin báo cáo !");
    }
  };

  const renderData = () => {
    return Object.keys(ticketInfo.results).map((key) => {
      const object = ticketInfo.results[key];
      const editedText = (object.text || "").replace(/^\n+/, "");
      return (
        <div key={key}>
          <p>{object.title}</p>
          <TextField
            multiline
            defaultValue={editedText}
            fullWidth
            onChange={(e) => handleTextFieldChange(key, e.target.value)}
          />
        </div>
      );
    });
  };

  return (
    <>
      {(typeTicket === "KT01" || typeTicket === "KT03") && (
        <Button
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
          onClick={handleOpenInformationDialog}
        >
          <PostAddIcon fontSize="large" />
        </Button>
      )}
      <Dialog
        fullWidth
        maxWidth="md"
        scroll="paper"
        open={openReportInformationDialog}
      >
        <DialogTitle style={{ textAlign: "center" }}>
          {ticketInfo && ticketInfo.results ? (
            <p>
              NỘI DUNG KIỂM TRA <br /> (Lưu ý mỗi ngày bay chỉ được gửi 1 lần
              duy nhất)
            </p>
          ) : (
            <p>Phiếu không tồn tại hoặc không có dữ liệu !</p>
          )}
          <Button
            className={styles.buttonClose}
            color="error"
            variant="contained"
            onClick={handleCloseInformationDialog}
          >
            <CloseIcon fontSize="small" />
          </Button>
        </DialogTitle>
        <DialogContent>
          {ticketInfo &&
            Object.keys(ticketInfo).length > 0 &&
            ticketInfo.results &&
            renderData()}
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          {ticketInfo && ticketInfo.results && (
            <Button
              disabled={supervisionStatus === "not_done" ? false : true}
              variant="contained"
              onClick={() => handleSubmitAllFieldText()}
            >
              Gửi thông tin báo cáo
            </Button>
          )}
        </DialogActions>

        {sendClicked === true ? <Loading /> : <></>}
      </Dialog>
    </>
  );
};

export default FlightManageReportInformation;
