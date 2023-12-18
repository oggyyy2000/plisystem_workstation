import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import "../../css/FlightManagePrintReportDialog.css";
import FlightManageFormReport from "./FlightManageFormReport";
import FlightManageListInspectionStaff from "./FlightManageListInspectionStaff";
import FlightManageExportReport from "./FlightManageExportReport";
import FlightManageZoomingDialog from "../FlightManageZoomingDialog";

const FlightManagePrintReportDialog = ({ implementation_date }) => {
  const [openPrintReport, setOpenPrintReport] = useState(false);
  const [reportData, setReportData] = useState({});

  const [openZoomingImg, setOpenZoomingImg] = useState("");

  console.log(typeof reportData);

  // default list inspection staff
  const [staff1, setStaff1] = useState({
    name: "KS. Nguyễn Duy Anh",
    chucdanh: "",
    bactho: "5/7",
    bacAT: "3/5",
  });
  const [staff2, setStaff2] = useState({
    name: "KS. Nguyễn Đức Hùng",
    chucdanh: "",
    bactho: "7/7",
    bacAT: "4/5",
  });
  const [staff3, setStaff3] = useState({
    name: "KS. Nguyễn Hữu Minh",
    chucdanh: "",
    bactho: "5/7",
    bacAT: "3/5",
  });
  const [staff4, setStaff4] = useState({
    name: "KS. Hoàng Văn Sơn",
    chucdanh: "",
    bactho: "6/7",
    bacAT: "5/5",
  });

  console.log("report data: ", reportData);

  const urlGetReportDataAPI =
    process.env.REACT_APP_PRINT_REPORT_API_URL + "dotkiemtraimports";

  useEffect(() => {
    axios
      .get(urlGetReportDataAPI)
      .then((res) => {
        res.data.filter((report) => {
          if (report.ngay_kiem_tra === implementation_date) {
            return setReportData(report);
          } else {
            return [];
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [openPrintReport, urlGetReportDataAPI, implementation_date]);

  return (
    <>
      <Button
        className="modal-mission-data__print-btn"
        variant="outlined"
        onClick={() => setOpenPrintReport(true)}
      >
        IN BÁO CÁO
      </Button>

      <Dialog open={openPrintReport} fullScreen>
        <DialogTitle className="print-report-dialog__title">
          <span>Báo cáo nhiệm vụ bay</span>

          <div className="print-report-dialog__btn-group">
            <FlightManageExportReport
              staff1={staff1}
              staff2={staff2}
              staff3={staff3}
              staff4={staff4}
              reportData={reportData}
            />

            <FlightManageListInspectionStaff
              staff1={staff1}
              setStaff1={setStaff1}
              staff2={staff2}
              setStaff2={setStaff2}
              staff3={staff3}
              setStaff3={setStaff3}
              staff4={staff4}
              setStaff4={setStaff4}
            />

            <Button
              color="error"
              variant="contained"
              onClick={() => setOpenPrintReport(false)}
            >
              <CloseIcon fontSize="small" />
            </Button>
          </div>
        </DialogTitle>

        <DialogContent className="print-report-dialog__content">
          <Grid
            container
            xs={12}
            className="print-report-dialog__content-container"
          >
            <Grid
              item
              xs={7}
              className="print-report-dialog__form-report-container"
            >
              <FlightManageFormReport
                staff1={staff1}
                staff2={staff2}
                staff3={staff3}
                staff4={staff4}
                reportData={reportData}
              />
            </Grid>
            <Grid
              item
              xs={5}
              className="print-report-dialog__list-error-img-container"
            >
              <div className="print-report-dialog__list-error-img">
                {openPrintReport ? (
                  reportData?.chi_tiet_kiem_tra.map((details) => {
                    return (
                      <>
                        <div
                          onClick={() =>
                            setOpenZoomingImg(
                              process.env.REACT_APP_PRINT_REPORT_API_URL +
                                details.defect_img_detail
                            )
                          }
                        >
                          <img
                            src={
                              process.env.REACT_APP_PRINT_REPORT_API_URL +
                              details.defect_img_detail
                            }
                            srcSet={
                              process.env.REACT_APP_PRINT_REPORT_API_URL +
                              details.defect_img_detail
                            }
                            alt={details.defect_img_detail}
                            loading="lazy"
                            width={"200px"}
                            height={"200px"}
                          />
                        </div>

                        <FlightManageZoomingDialog
                          info={
                            process.env.REACT_APP_PRINT_REPORT_API_URL +
                            details.defect_img_detail
                          }
                          openZoomingImg={openZoomingImg}
                          setOpenZoomingImg={setOpenZoomingImg}
                        />
                      </>
                    );
                  })
                ) : (
                  <></>
                )}
              </div>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FlightManagePrintReportDialog;
