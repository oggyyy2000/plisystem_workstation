import React from "react";
import { useState } from "react";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import "../../css/FlightMangeListInspectionStaff.css";

const FlightManageListInspectionStaff = ({staff1, setStaff1, staff2, setStaff2, staff3, setStaff3, staff4, setStaff4}) => {
  const [openListInspectionStaff, setOpenListInspectionStaff] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpenListInspectionStaff(true)}
      >
        NHẬP DANH SÁCH NHÂN VIÊN KIỂM TRA
      </Button>

      <Dialog
        open={openListInspectionStaff}
        onClose={() => setOpenListInspectionStaff(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle className="list-inspection-staff__title">
          <span>Danh sách nhân viên kiểm tra</span>

          <Button
            color="error"
            variant="contained"
            onClick={() => setOpenListInspectionStaff(false)}
          >
            <CloseIcon fontSize="small" />
          </Button>
        </DialogTitle>

        <DialogContent>
          <Box display="flex" p={0}>
            <div>
              <TextField
                className="list-inspection-staff__STT-field"
                label="STT"
                value="1"
                disabled
              />
              <TextField
                className="list-inspection-staff__STT-field"
                label="STT"
                value="2"
                disabled
              />
              <TextField
                className="list-inspection-staff__STT-field"
                label="STT"
                value="3"
                disabled
              />
              <TextField
                className="list-inspection-staff__STT-field"
                label="STT"
                value="4"
                disabled
              />
            </div>
            <div>
              <TextField
                className="list-inspection-staff__name-field"
                label="Họ Và Tên"
                value={staff1.name}
                onChange={(e) => {
                  const value = e.target.value;
                  setStaff1({ ...staff1, name: value });
                }}
              />
              <TextField
                className="list-inspection-staff__name-field"
                label="Họ Và Tên"
                value={staff2.name}
                onChange={(e) => {
                  const value = e.target.value;
                  setStaff2({ ...staff2, name: value });
                }}
              />
              <TextField
                className="list-inspection-staff__name-field"
                label="Họ Và Tên"
                value={staff3.name}
                onChange={(e) => {
                  const value = e.target.value;
                  setStaff3({ ...staff3, name: value });
                }}
              />
              <TextField
                className="list-inspection-staff__name-field"
                label="Họ Và Tên"
                value={staff4.name}
                onChange={(e) => {
                  const value = e.target.value;
                  setStaff4({ ...staff4, name: value });
                }}
              />
            </div>
            <div>
              <TextField
                className="list-inspection-staff__staff-title-field"
                label="Chức Danh"
                value={staff1.chucdanh}
                onChange={(e) => {
                  const value = e.target.value;
                  setStaff1({ ...staff1, chucdanh: value });
                }}
              />
              <TextField
                className="list-inspection-staff__staff-title-field"
                label="Chức Danh"
                value={staff2.chucdanh}
                onChange={(e) => {
                  const value = e.target.value;
                  setStaff2({ ...staff2, chucdanh: value });
                }}
              />
              <TextField
                className="list-inspection-staff__staff-title-field"
                label="Chức Danh"
                value={staff3.chucdanh}
                onChange={(e) => {
                  const value = e.target.value;
                  setStaff3({ ...staff3, chucdanh: value });
                }}
              />
              <TextField
                className="list-inspection-staff__staff-title-field"
                label="Chức Danh"
                value={staff4.chucdanh}
                onChange={(e) => {
                  const value = e.target.value;
                  setStaff4({ ...staff4, chucdanh: value });
                }}
              />
            </div>
            <div>
              <FormControl className="list-inspection-staff__form-control-bactho">
                <InputLabel>{"Bậc Thợ"}</InputLabel>
                <Select
                  label={"Bậc Thợ"}
                  value={staff1.bactho}
                  onChange={(e) => {
                    const value = e.target.value;
                    setStaff1({ ...staff1, bactho: value });
                  }}
                >
                  <MenuItem value={null}>Trống</MenuItem>
                  <MenuItem value="1/7">1/7</MenuItem>
                  <MenuItem value="2/7">2/7</MenuItem>
                  <MenuItem value="3/7">3/7</MenuItem>
                  <MenuItem value="4/7">4/7</MenuItem>
                  <MenuItem value="5/7">5/7</MenuItem>
                  <MenuItem value="6/7">6/7</MenuItem>
                  <MenuItem value="7/7">7/7</MenuItem>
                </Select>
              </FormControl>
              <FormControl className="list-inspection-staff__form-control-bactho">
                <InputLabel>{"Bậc Thợ"}</InputLabel>
                <Select
                  label={"Bậc Thợ"}
                  value={staff2.bactho}
                  onChange={(e) => {
                    const value = e.target.value;
                    setStaff2({ ...staff2, bactho: value });
                  }}
                >
                  <MenuItem value={null}>Trống</MenuItem>
                  <MenuItem value="1/7">1/7</MenuItem>
                  <MenuItem value="2/7">2/7</MenuItem>
                  <MenuItem value="3/7">3/7</MenuItem>
                  <MenuItem value="4/7">4/7</MenuItem>
                  <MenuItem value="5/7">5/7</MenuItem>
                  <MenuItem value="6/7">6/7</MenuItem>
                  <MenuItem value="7/7">7/7</MenuItem>
                </Select>
              </FormControl>
              <FormControl className="list-inspection-staff__form-control-bactho">
                <InputLabel>{"Bậc Thợ"}</InputLabel>
                <Select
                  label={"Bậc Thợ"}
                  value={staff3.bactho}
                  onChange={(e) => {
                    const value = e.target.value;
                    setStaff3({ ...staff3, bactho: value });
                  }}
                >
                  <MenuItem value={null}>Trống</MenuItem>
                  <MenuItem value="1/7">1/7</MenuItem>
                  <MenuItem value="2/7">2/7</MenuItem>
                  <MenuItem value="3/7">3/7</MenuItem>
                  <MenuItem value="4/7">4/7</MenuItem>
                  <MenuItem value="5/7">5/7</MenuItem>
                  <MenuItem value="6/7">6/7</MenuItem>
                  <MenuItem value="7/7">7/7</MenuItem>
                </Select>
              </FormControl>
              <FormControl className="list-inspection-staff__form-control-bactho">
                <InputLabel>{"Bậc Thợ"}</InputLabel>
                <Select
                  label={"Bậc Thợ"}
                  value={staff4.bactho}
                  onChange={(e) => {
                    const value = e.target.value;
                    setStaff4({ ...staff4, bactho: value });
                  }}
                >
                  <MenuItem value={null}>Trống</MenuItem>
                  <MenuItem value="1/7">1/7</MenuItem>
                  <MenuItem value="2/7">2/7</MenuItem>
                  <MenuItem value="3/7">3/7</MenuItem>
                  <MenuItem value="4/7">4/7</MenuItem>
                  <MenuItem value="5/7">5/7</MenuItem>
                  <MenuItem value="6/7">6/7</MenuItem>
                  <MenuItem value="7/7">7/7</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div>
              <FormControl className="list-inspection-staff__form-control-bacAT">
                <InputLabel>{"Bậc AT"}</InputLabel>
                <Select
                  label={"Bậc AT"}
                  value={staff1.bacAT}
                  onChange={(e) => {
                    const value = e.target.value;
                    setStaff1({ ...staff1, bacAT: value });
                  }}
                >
                  <MenuItem value={null}>Trống</MenuItem>
                  <MenuItem value="1/5">1/5</MenuItem>
                  <MenuItem value="2/5">2/5</MenuItem>
                  <MenuItem value="3/5">3/5</MenuItem>
                  <MenuItem value="4/5">4/5</MenuItem>
                  <MenuItem value="5/5">5/5</MenuItem>
                </Select>
              </FormControl>
              <FormControl className="list-inspection-staff__form-control-bacAT">
                <InputLabel>{"Bậc AT"}</InputLabel>
                <Select
                  label={"Bậc AT"}
                  value={staff2.bacAT}
                  onChange={(e) => {
                    const value = e.target.value;
                    setStaff2({ ...staff2, bacAT: value });
                  }}
                >
                  <MenuItem value={null}>Trống</MenuItem>
                  <MenuItem value="1/5">1/5</MenuItem>
                  <MenuItem value="2/5">2/5</MenuItem>
                  <MenuItem value="3/5">3/5</MenuItem>
                  <MenuItem value="4/5">4/5</MenuItem>
                  <MenuItem value="5/5">5/5</MenuItem>
                </Select>
              </FormControl>
              <FormControl className="list-inspection-staff__form-control-bacAT">
                <InputLabel>{"Bậc AT"}</InputLabel>
                <Select
                  label={"Bậc AT"}
                  value={staff3.bacAT}
                  onChange={(e) => {
                    const value = e.target.value;
                    setStaff3({ ...staff3, bacAT: value });
                  }}
                >
                  <MenuItem value={null}>Trống</MenuItem>
                  <MenuItem value="1/5">1/5</MenuItem>
                  <MenuItem value="2/5">2/5</MenuItem>
                  <MenuItem value="3/5">3/5</MenuItem>
                  <MenuItem value="4/5">4/5</MenuItem>
                  <MenuItem value="5/5">5/5</MenuItem>
                </Select>
              </FormControl>
              <FormControl className="list-inspection-staff__form-control-bacAT">
                <InputLabel>{"Bậc AT"}</InputLabel>
                <Select
                  label={"Bậc AT"}
                  value={staff4.bacAT}
                  onChange={(e) => {
                    const value = e.target.value;
                    setStaff4({ ...staff4, bacAT: value });
                  }}
                >
                  <MenuItem value={null}>Trống</MenuItem>
                  <MenuItem value="1/5">1/5</MenuItem>
                  <MenuItem value="2/5">2/5</MenuItem>
                  <MenuItem value="3/5">3/5</MenuItem>
                  <MenuItem value="4/5">4/5</MenuItem>
                  <MenuItem value="5/5">5/5</MenuItem>
                </Select>
              </FormControl>
            </div>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FlightManageListInspectionStaff;
