import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

const FlightManageReportInformation = () => {
  const [openReportInformationDialog, setOpenReportInformationDialog] =
    useState(false);
  return (
    <>
      <Button
        className="modal-mission-data__print-btn"
        variant="outlined"
        onClick={() => setOpenReportInformationDialog(true)}
      >
        Next
      </Button>
      <Dialog
        fullWidth
        maxWidth="md"
        scroll="paper"
        open={openReportInformationDialog}
        onClose={() => setOpenReportInformationDialog(false)}
      >
        <DialogTitle style={{ textAlign: "center" }}>
          NỘI DUNG KIỂM TRA
        </DialogTitle>
        <DialogContent>
          <div>
            <p>
              - Hành lang tuyến: (Ghi các tồn tại trong hành lang tuyến, ngoài
              hành lang tuyến có khả năng gây sự cố.v.v. và các nội dung cần xử
              lý).{" "}
            </p>
            <TextField label={"Type here... "} fullWidth />
          </div>
          <div>
            <p>
              - Cột: (Ghi các vị trí cột nghiêng, biến dạng, nứt mất thanh
              giằng, biển báo... và các nội dung cần xử lý)
            </p>
            <TextField label={"Type here... "} fullWidth />
          </div>
          <div>
            <p>
              - Móng cột: (Ghi các vị trí lún, nứt, xói lở và có tình trạng bất
              thường, các khu vực xung quanh móng cột...... các nội dung cần xử
              lý)
            </p>
            <TextField label={"Type here... "} fullWidth />
          </div>
          <div>
            <p>
              - Các kết cấu xà và giá đỡ: (Ghi các vị trí cần xử lý - nội dung
              cần xử lý)
            </p>
            <TextField label={"Type here... "} fullWidth />
          </div>
          <div>
            <p>
              - Sứ cách điện: (Ghi các tồn tại như vỡ, nứt, phóng điện, bụi bẩn,
              phụ kiện chuỗi sứ, các hiện tượng bất thường khác và các nội dung
              cần xử lý)
            </p>
            <TextField label={"Type here... "} fullWidth />
          </div>
          <div>
            <p>
              - Dây dẫn: (Ghi các vị trí dây bị tổn thương, đứt sợi, vặn xoắn,
              quấn táp, vật lạ bám vào đường dây, độ võng, các hiện tượng bất
              thường của mối nối và các nội dung cần xử lý)
            </p>
            <TextField label={"Type here... "} fullWidth />
          </div>
          <div>
            <p>- Các kết cấu tiếp địa, tình trạng tiếp địa: </p>
            <TextField label={"Type here... "} fullWidth />
          </div>
          <div>
            <p>- Dây néo, móng néo: </p>
            <TextField label={"Type here... "} fullWidth />
          </div>
          <div>
            <p>- Các thiết bị chống sét: </p>
            <TextField label={"Type here... "} fullWidth />
          </div>
          <div>
            <p>- Tạ bù - Tạ chống rung: </p>
            <TextField label={"Type here... "} fullWidth />
          </div>
          <div>
            <h3>Các tồn tại đã xử lý ngay trong kiểm tra: </h3>
            <TextField label={"Type here... "} fullWidth />
          </div>
          <div>
            <h3>
              Các kiến nghị sau kiểm tra: (phần này do Tổ trưởng vận hành ghi)
            </h3>
            <TextField label={"Type here... "} fullWidth />
          </div>
        </DialogContent>
        <DialogActions>
          <Button>SUBMIT</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FlightManageReportInformation;
