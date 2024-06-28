import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import {
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Input,
} from "@mui/material";

import logo from "../../assets/images/logo.png";
import CloseIcon from "@mui/icons-material/Close";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

import styles from "./css/Navbar.module.css";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link for navigation

const pages = [
  {
    index: 0,
    ten_navbar: "Bay",
    url: "/MainFlight",
  },
  {
    index: 1,
    ten_navbar: "Quản lý dữ liệu",
    url: "/FlightManage",
  },
  // {
  //   index: 2,
  //   ten_navbar: "Hành lang tuyến",
  //   url: "/PowerlineCorridor",
  // },
  // {
  //   index: 3,
  //   ten_navbar: "Demo",
  //   url: "/DemoFlight",
  // },
];

const Navbar = () => {
  const [openUserAccountSetting, setOpenUserAccountSetting] = useState(false);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [userPass, setUserPass] = useState({});
  const [thermalWarning, setThermalWarning] = useState(0); // Initial state for thermalWarning
  const [thermalDifference, setThermalDifference] = useState(0); // Initial state for thermalDifference
  console.log("thermalWarning: ", thermalWarning);
  console.log("thermalDifference: ", thermalDifference);

  useEffect(() => {
    const getUserPass = async () => {
      const urlGetUserPass =
        process.env.REACT_APP_API_URL + "settingworkstation/";

      const responseData = await axios.get(urlGetUserPass);

      setUserPass(responseData.data);
      setThermalWarning(responseData.data.thermal_warning);
      setThermalDifference(responseData.data.thermal_difference);
    };
    getUserPass();
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleInputTemperatureAdjust = (event) => {
    const { name, value } = event.target; // Destructure name and value from event object

    // Update the corresponding state variable based on the input name
    if (name === "thermalWarning") {
      setThermalWarning(value);
    } else if (name === "thermalDifference") {
      setThermalDifference(value);
    } else {
      // Handle unexpected input names (optional)
      console.warn("Unexpected input name:", name);
    }
  };

  const handleUpdateTemperature = () => {
    const urlPostAdjustTemperature =
      process.env.REACT_APP_API_URL + "settingworkstation/";
    const formData = new FormData();
    formData.append("thermal_warning", thermalWarning);
    formData.append("thermal_difference", thermalDifference);
    axios
      .post(urlPostAdjustTemperature, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          alert("Cập nhật nhiệt độ thành công !");
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <img className={styles.logoNormal} src={logo} alt="logo" />
            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              EPSMARTTECH
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>

              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page.index} onClick={handleCloseNavMenu}>
                    <Link
                      // className={styles.navigateItem}
                      key={page.index}
                      to={page.url}
                    >
                      {page.ten_navbar}
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <img className={styles.logoResponsive} src={logo} alt="logo" />
            <Typography
              variant="h5"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              EPSMARTTECH
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Link
                  className={styles.navigateItem}
                  key={page.index}
                  to={page.url}
                >
                  {page.ten_navbar}
                </Link>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Xem thông tin tài khoản">
                <IconButton
                  onClick={() => setOpenUserAccountSetting(true)}
                  sx={{ p: 1 }}
                >
                  <ManageAccountsIcon
                    alt="Workstation Account Setting"
                    fontSize="large"
                    style={{ color: "white" }}
                  />
                </IconButton>
              </Tooltip>
              <Dialog open={openUserAccountSetting} fullWidth maxWidth={"sm"}>
                <DialogTitle
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "#1976d2",
                    color: "white",
                    textTransform: "uppercase",
                  }}
                >
                  Cài đặt
                  <Button
                    className={styles.userAccountSettingCancelBtn}
                    color="error"
                    variant="contained"
                    onClick={() => setOpenUserAccountSetting(false)}
                  >
                    <CloseIcon fontSize="small" />
                  </Button>
                </DialogTitle>
                <DialogContent>
                  <div style={{ padding: "20px" }}>
                    <span>
                      <b>Tài khoản máy: </b>
                    </span>

                    <Typography textAlign="center">
                      <b>wscode: </b>
                      {userPass.user_authen}
                    </Typography>

                    <Typography textAlign="center">
                      <b>wsskey: </b>
                      {userPass.pass_authen}
                    </Typography>
                  </div>

                  <div style={{ padding: "20px" }}>
                    <span>
                      <b>Cảnh báo nhiệt: </b>
                    </span>

                    <div style={{ textAlign: "center" }}>
                      <span>Nhiệt độ bắt đầu cảnh báo</span>
                      <Input
                        value={thermalWarning}
                        size="small"
                        onChange={handleInputTemperatureAdjust}
                        inputProps={{
                          step: 1,
                          min: 0,
                          max: 1000,
                          type: "number",
                          "aria-labelledby": "input-slider",
                          name: "thermalWarning", // Add a unique name for identification
                        }}
                        style={{ width: "40px", marginLeft: "10px" }}
                      />
                    </div>

                    <div style={{ textAlign: "center" }}>
                      <span>Nhiệt độ chênh lệch cảnh báo</span>
                      <Input
                        value={thermalDifference}
                        size="small"
                        onChange={handleInputTemperatureAdjust}
                        inputProps={{
                          step: 1,
                          min: 0,
                          max: 1000,
                          type: "number",
                          "aria-labelledby": "input-slider",
                          name: "thermalDifference", // Add a unique name for identification
                        }}
                        style={{ width: "40px", marginLeft: "10px" }}
                      />
                    </div>
                  </div>
                </DialogContent>
                <DialogActions
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button variant="contained" onClick={handleUpdateTemperature}>
                    Cập nhật
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Navbar;
