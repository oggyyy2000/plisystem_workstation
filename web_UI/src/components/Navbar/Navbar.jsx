import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FlyMissionStart } from "../../redux/selectors";

import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Input,
  MenuItem,
  Grid,
  Badge,
  Popover,
  Divider,
  List,
} from "@mui/material";

import logo from "../../assets/images/powerpole_logo.png";
import CloseIcon from "@mui/icons-material/Close";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import MenuIcon from "@mui/icons-material/Menu";
import HelpIcon from "@mui/icons-material/Help";
import InfoIcon from "@mui/icons-material/Info";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import CopyrightIcon from "@mui/icons-material/Copyright";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import BrowserUpdatedIcon from "@mui/icons-material/BrowserUpdated";

import styles from "./css/Navbar.module.css";

import * as settingWorkstationService from "../../APIServices/SettingWorkstationService";
import * as UpdateModelService from "../../APIServices/UpdateModelService";

import UpdateJobticket from "./UserManual/UpdateJobticket";
import FillInfoBeforeFlight from "./UserManual/FillInfoBeforeFlight";
import FlightInProgress from "./UserManual/FlightInProgress";
import HotKey from "./UserManual/HotKey";
import FlightResult from "./UserManual/FlightResult";
import DataManagementItems from "./UserManual/DataManagementItems";
import DataManagementMissionDetails from "./UserManual/DataManagementMissionDetails";
import FinalReport from "./UserManual/FinalReport";
import PowerlineRouteManagementItems from "./UserManual/PowerlineRouteManagementItems";
import SettingItems from "./UserManual/SettingItems";
import CreateManualJobTicket from "./UserManual/CreateManualJobTicket";
import EditImageResultLabel from "./UserManual/EditImageResultLabel";
import ImportData from "./UserManual/ImportData";

import MoreInfoPopover from "../CommonDialog/MoreInfoPopover";
import NotificationItem from "../CommonDialog/NotificationItem";
import Loading from "../LoadingPage/LoadingPage";

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
  {
    index: 2,
    ten_navbar: "Quản lý tuyến",
    url: "/PowerlineRouteManage",
  },
];

const Navbar = ({ hasNewUpdate, setHasNewUpdate }) => {
  const [anchorElNav, setAnchorElNav] = useState(null);

  const [anchorHelpMenu, setAnchorHelpMenu] = useState(null);
  const openHelpMenu = Boolean(anchorHelpMenu);

  const [anchorSettingMenu, setAnchorSettingMenu] = useState(null);
  const openSettingMenu = Boolean(anchorSettingMenu);

  const [anchorElNotification, setAnchorElNotification] = useState(null);
  const openNotificationMenu = Boolean(anchorElNotification);

  const [openIntroDialog, setOpenIntroDialog] = useState(false);
  const [openHelpDialog, setOpenHelpDialog] = useState(false);
  const [openSettingDialog, setOpenSettingDialog] = useState(false);
  const [openUpdateModelDialog, setOpenUpdateModelDialog] = useState(false);
  const [userPass, setUserPass] = useState({});
  const [maxDeltaDifferenceTemp, setMaxDeltaDifferenceTemp] = useState(0);
  const [avgDeltaDifferenceTemp, setThermalDifference] = useState(0);
  const [totalDayKeep, setTotalDayKeep] = useState(0);
  const flyMissionStart = useSelector(FlyMissionStart);
  const [selectedUserManualItem, setSelectedUserManualItem] = useState(1);

  const [isUpdatingModel, setIsUpdatingModel] = useState(false);
  console.log("hasNewUpdate: ", isUpdatingModel);

  useEffect(() => {
    const getUserPass = async () => {
      const response = await settingWorkstationService.getAllData();
      console.log("getUserPassResponse: ", response);
      if (response) {
        setUserPass(response);
        setMaxDeltaDifferenceTemp(response.max_difference);
        setThermalDifference(response.avg_difference);
        setTotalDayKeep(response.date_delete);
      }
    };
    getUserPass();
  }, [openSettingDialog]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleInputSettingAdjust = (event) => {
    const { name, value } = event.target;
    if (name === "maxDeltaDifferenceTemp") {
      setMaxDeltaDifferenceTemp(value);
    } else if (name === "avgDeltaDifferenceTemp") {
      setThermalDifference(value);
    } else if (name === "totalDayKeep") {
      setTotalDayKeep(value);
    } else {
      console.error("Unexpected input name handleInputSettingAdjust: ", name);
    }
  };

  const handleUpdateTemperature = async () => {
    const formData = new FormData();
    formData.append("max_difference", maxDeltaDifferenceTemp);
    formData.append("avg_difference", avgDeltaDifferenceTemp);
    formData.append("date_delete", totalDayKeep);
    const response = await settingWorkstationService.postData({
      formData: formData,
    });
    if (response) {
      toast.success(response);
    }
  };

  const handleClickIntro = () => {
    setAnchorHelpMenu(null);
    setOpenIntroDialog(true);
  };

  const handleClickHelp = () => {
    setAnchorHelpMenu(null);
    setOpenHelpDialog(true);
  };

  const handleClickSetting = () => {
    setAnchorSettingMenu(null);
    setOpenSettingDialog(true);
  };

  const handleClickUpdateModel = () => {
    setAnchorSettingMenu(null);
    setOpenUpdateModelDialog(true);
  };

  const handleClickUpdateModelBtn = async () => {
    setIsUpdatingModel(true);
    const response = await UpdateModelService.postData();
    console.log("handleClickUpdateModelBtn response: ", response);
    if (response && response.success === true) {
      toast.success("Cập nhật Model AI thành công!");
      setOpenUpdateModelDialog(false);
      setIsUpdatingModel(false);
      setHasNewUpdate(false);
    } else {
      toast.error("Cập nhật Model AI thất bại, vui lòng thử lại sau!");
      setIsUpdatingModel(false);
    }
  };

  const handleClickNotification = (event) => {
    setAnchorElNotification(event.currentTarget);
  };

  const handleCloseNotification = () => {
    setAnchorElNotification(null);
  };

  const handleUserManualItemClick = (itemIndex) => {
    setSelectedUserManualItem(itemIndex);
  };

  const renderUserManualContent = () => {
    switch (selectedUserManualItem) {
      case 1:
        return <UpdateJobticket />;
      case 2:
        return <FillInfoBeforeFlight />;
      case 3:
        return <FlightInProgress />;
      case 4:
        return <HotKey />;
      case 5:
        return <FlightResult />;
      case 6:
        return <DataManagementItems />;
      case 7:
        return <DataManagementMissionDetails />;
      case 8:
        return <FinalReport />;
      case 9:
        return <PowerlineRouteManagementItems />;
      case 10:
        return <SettingItems />;
      case 11:
        return <CreateManualJobTicket />;
      case 12:
        return <EditImageResultLabel />;
      case 13:
        return <ImportData />;
      default:
        return <UpdateJobticket />;
    }
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
                  // <MenuItem key={page.index} onClick={handleCloseNavMenu}>
                  <Link
                    className={`${styles.hamNavItem} ${
                      flyMissionStart
                        ? page.ten_navbar !== "Bay"
                          ? styles.disableLink
                          : styles.disableLinkWithoutOpacity
                        : ""
                    }`}
                    onClick={handleCloseNavMenu}
                    key={page.index}
                    to={page.url}
                  >
                    {page.ten_navbar}
                  </Link>
                  // </MenuItem>
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
                  className={`${styles.navigateItem} ${
                    flyMissionStart
                      ? page.ten_navbar !== "Bay"
                        ? styles.disableLink
                        : styles.disableLinkWithoutOpacity
                      : ""
                  }`}
                  key={page.index}
                  to={page.url}
                >
                  {page.ten_navbar}
                </Link>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <IconButton
                onClick={(event) => setAnchorSettingMenu(event.currentTarget)}
                sx={{ p: 1 }}
                title="Cài đặt"
              >
                <ManageAccountsIcon
                  alt="Workstation Account Setting"
                  fontSize="large"
                  style={{ color: "white" }}
                />
              </IconButton>
              <Menu
                anchorEl={anchorSettingMenu}
                open={openSettingMenu}
                onClose={() => setAnchorSettingMenu(null)}
              >
                <MenuItem onClick={handleClickSetting}>
                  <SettingsIcon color="warning" />
                  <Typography sx={{ ml: 1 }}>Cài đặt nhanh</Typography>
                </MenuItem>
                <MenuItem onClick={handleClickUpdateModel}>
                  <BrowserUpdatedIcon color="warning" />
                  <Typography sx={{ ml: 1 }}>Cập nhật Model AI</Typography>
                </MenuItem>
              </Menu>
              <Dialog open={openSettingDialog} fullWidth maxWidth={"sm"}>
                <DialogTitle
                  sx={{
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
                    onClick={() => setOpenSettingDialog(false)}
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
                      <span>Nhiệt độ cao nhất mối nối</span>
                      <Input
                        value={maxDeltaDifferenceTemp}
                        size="small"
                        onChange={handleInputSettingAdjust}
                        inputProps={{
                          step: 1,
                          min: 0,
                          max: 1000,
                          type: "number",
                          "aria-labelledby": "input-slider",
                          name: "maxDeltaDifferenceTemp", // Add a unique name for identification
                        }}
                        style={{ width: "40px", marginLeft: "10px" }}
                      />
                      <MoreInfoPopover content="Giá trị chênh lệch nhiệt độ tối đa giữa mối nối và môi trường. Nếu vượt ngưỡng này, hệ thống sẽ đưa ra cảnh báo." />
                    </div>

                    <div style={{ textAlign: "center" }}>
                      <span>Nhiệt độ trung bình mối nối</span>
                      <Input
                        value={avgDeltaDifferenceTemp}
                        size="small"
                        onChange={handleInputSettingAdjust}
                        inputProps={{
                          step: 1,
                          min: 0,
                          max: 1000,
                          type: "number",
                          "aria-labelledby": "input-slider",
                          name: "avgDeltaDifferenceTemp", // Add a unique name for identification
                        }}
                        style={{ width: "40px", marginLeft: "10px" }}
                      />
                      <MoreInfoPopover content="Giá trị chênh lệch nhiệt độ trung bình giữa mối nối và môi trường. Nếu vượt ngưỡng này, hệ thống sẽ đưa ra cảnh báo." />
                    </div>
                  </div>
                  <div style={{ padding: "20px" }}>
                    <span>
                      <b>Chọn số ngày dữ liệu được lưu: </b>
                    </span>

                    <div style={{ textAlign: "center" }}>
                      <span>
                        Nhập số ngày bạn muốn giữ lại các lịch trình giám sát
                        mới nhất:{" "}
                      </span>
                      <Input
                        value={totalDayKeep}
                        size="small"
                        onChange={handleInputSettingAdjust}
                        inputProps={{
                          step: 1,
                          min: 0,
                          max: 1000,
                          type: "number",
                          "aria-labelledby": "input-slider",
                          name: "totalDayKeep", // Add a unique name for identification
                        }}
                        style={{ width: "40px", marginLeft: "10px" }}
                      />
                      <span>
                        Lưu ý: ngày ở đây là tổng số ngày mà máy trạm nhận
                        phiếu. Nên để{" "}
                      </span>{" "}
                      <br />
                      <span>
                        {"("}5 &le; số ngày &le; 15 {")"}
                      </span>
                    </div>
                  </div>
                </DialogContent>
                <DialogActions
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    disabled={
                      flyMissionStart || Object.keys(userPass).length === 0
                        ? true
                        : false
                    }
                    variant="contained"
                    onClick={handleUpdateTemperature}
                  >
                    Cập nhật cài đặt
                  </Button>
                </DialogActions>
              </Dialog>
              <Dialog open={openUpdateModelDialog} fullWidth maxWidth={"xs"}>
                <DialogTitle
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "#1976d2",
                    color: "white",
                    textTransform: "uppercase",
                    p: 1,
                  }}
                >
                  Cập nhật Model AI
                  <Button
                    className={styles.userAccountSettingCancelBtn}
                    color="error"
                    variant="contained"
                    onClick={() => setOpenUpdateModelDialog(false)}
                  >
                    <CloseIcon fontSize="small" />
                  </Button>
                </DialogTitle>
                <DialogActions
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleClickUpdateModelBtn}
                  >
                    Cập nhật
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>

            <Box>
              <IconButton
                sx={{ p: 1, ml: 3 }}
                onClick={(event) => setAnchorHelpMenu(event.currentTarget)}
                title="Trợ giúp"
              >
                <HelpIcon fontSize="large" style={{ color: "white" }} />
              </IconButton>
              <Menu
                anchorEl={anchorHelpMenu}
                open={openHelpMenu}
                onClose={() => setAnchorHelpMenu(null)}
              >
                <MenuItem onClick={handleClickHelp}>
                  <ContactSupportIcon color="warning" />
                  <Typography sx={{ ml: 1 }}>Hiển thị trợ giúp</Typography>
                </MenuItem>
                <MenuItem onClick={handleClickIntro}>
                  <InfoIcon color="info" />
                  <Typography sx={{ ml: 1 }}>Giới thiệu</Typography>
                </MenuItem>
              </Menu>

              <Dialog
                open={openIntroDialog}
                onClose={() => setOpenIntroDialog(false)}
                fullWidth
                maxWidth="sm"
              >
                <DialogContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h3" fontSize={"35px"}>
                    About Plisystem Workstation
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={logo}
                      srcSet={logo}
                      width={"145px"}
                      height={"145px"}
                      alt="logo"
                    />
                    <Box>
                      <Typography fontSize={"20px"} fontWeight={"bold"}>
                        Tên phần mềm: Plisystem Workstation
                      </Typography>
                      <Typography fontSize={"20px"}>
                        Phiên bản mới nhất: 2.0.4
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    sx={{ mt: 3, display: "flex", alignItems: "center" }}
                  >
                    Copyright <CopyrightIcon /> by EPSMARTTECH
                  </Typography>
                  <Typography sx={{ display: "flex", alignItems: "center" }}>
                    Email: epsmarttech@gmail.com
                  </Typography>
                </DialogContent>
                <DialogActions
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setOpenIntroDialog(false)}
                  >
                    Thoát
                  </Button>
                </DialogActions>
              </Dialog>

              <Dialog
                open={openHelpDialog}
                onClose={() => setOpenHelpDialog(false)}
                fullWidth
                maxWidth="lg"
              >
                <DialogContent>
                  <Grid container>
                    <Grid className={styles.userManualList} item xs={3}>
                      <ul>
                        <li
                          className={
                            selectedUserManualItem === 1 &&
                            styles.userManualItemChoosed
                          }
                          onClick={() => handleUserManualItemClick(1)}
                        >
                          1. Cập nhật phiếu bay mới nhất
                        </li>
                        <li
                          className={
                            selectedUserManualItem === 2 &&
                            styles.userManualItemChoosed
                          }
                          onClick={() => handleUserManualItemClick(2)}
                        >
                          2. Chọn thông tin lộ trình bay
                        </li>
                        <li
                          className={
                            selectedUserManualItem === 3 &&
                            styles.userManualItemChoosed
                          }
                          onClick={() => handleUserManualItemClick(3)}
                        >
                          3. Màn hình hiển thị trong quá trình bay
                        </li>
                        <li
                          className={
                            selectedUserManualItem === 4 &&
                            styles.userManualItemChoosed
                          }
                          onClick={() => handleUserManualItemClick(4)}
                        >
                          4. Các phím chức năng cần nhớ
                        </li>
                        <li
                          className={
                            selectedUserManualItem === 5 &&
                            styles.userManualItemChoosed
                          }
                          onClick={() => handleUserManualItemClick(5)}
                        >
                          5. Kết quả hiển thị sau khi kết thúc một nhiệm vụ bay
                        </li>
                        <li
                          className={
                            selectedUserManualItem === 6 &&
                            styles.userManualItemChoosed
                          }
                          onClick={() => handleUserManualItemClick(6)}
                        >
                          6. Các thành phần trong tab quản lý dữ liệu
                        </li>
                        <li
                          className={
                            selectedUserManualItem === 7 &&
                            styles.userManualItemChoosed
                          }
                          onClick={() => handleUserManualItemClick(7)}
                        >
                          7. Xem kết quả nhiệm vụ bay theo phiếu giao trong tab
                          quản lý dữ liệu
                        </li>
                        <li
                          className={
                            selectedUserManualItem === 8 &&
                            styles.userManualItemChoosed
                          }
                          onClick={() => handleUserManualItemClick(8)}
                        >
                          8. Phiếu kết quả cuối ngày
                        </li>
                        <li
                          className={
                            selectedUserManualItem === 9 &&
                            styles.userManualItemChoosed
                          }
                          onClick={() => handleUserManualItemClick(9)}
                        >
                          9. Các thành phần trong tab quản lý tuyến
                        </li>
                        <li
                          className={
                            selectedUserManualItem === 10 &&
                            styles.userManualItemChoosed
                          }
                          onClick={() => handleUserManualItemClick(10)}
                        >
                          10. Các thành phần trong tab cài đặt
                        </li>
                        <li
                          className={
                            selectedUserManualItem === 11 &&
                            styles.userManualItemChoosed
                          }
                          onClick={() => handleUserManualItemClick(11)}
                        >
                          11. Tạo phiếu bay thủ công
                        </li>
                        <li
                          className={
                            selectedUserManualItem === 12 &&
                            styles.userManualItemChoosed
                          }
                          onClick={() => handleUserManualItemClick(12)}
                        >
                          12. Sửa nhãn cho ảnh
                        </li>
                        <li
                          className={
                            selectedUserManualItem === 13 &&
                            styles.userManualItemChoosed
                          }
                          onClick={() => handleUserManualItemClick(13)}
                        >
                          13. Thêm ảnh vào nhiệm vụ bay
                        </li>
                      </ul>
                    </Grid>
                    <Grid
                      item
                      xs={9}
                      sx={{
                        width: "100%",
                        overflowY: "auto",
                        height: "550px",
                      }}
                    >
                      {renderUserManualContent()}
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setOpenHelpDialog(false)}
                  >
                    Thoát
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>

            <Box>
              <IconButton
                size="large"
                color="inherit"
                sx={{ p: 1, ml: 3 }}
                title="Thông báo"
                onClick={handleClickNotification}
              >
                <Badge badgeContent={hasNewUpdate ? 1 : 0} color="error">
                  <NotificationsIcon
                    fontSize="large"
                    style={{ color: "white" }}
                  />
                </Badge>
              </IconButton>
              <Popover
                open={openNotificationMenu}
                anchorEl={anchorElNotification}
                onClose={handleCloseNotification}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                PaperProps={{ sx: { width: 360, maxHeight: 500 } }}
              >
                <Box p={2}>
                  <Typography variant="h6" fontWeight="bold">
                    Thông báo
                  </Typography>
                </Box>
                <Divider />
                <List sx={{ maxHeight: 400, overflowY: "auto" }}>
                  {hasNewUpdate ? (
                    <NotificationItem
                      key={"noti1"}
                      notiIconColor="warning"
                      title={
                        "Model AI có phiên bản mới, vui lòng cập nhật bằng cách vào ấn vào biểu tượng cài đặt => Cập nhật Model AI => Ấn nút cập nhật"
                      }
                    />
                  ) : (
                    <NotificationItem
                      key={"nonNoti"}
                      notiIconColor="success"
                      title={"Không có thông báo mới"}
                    />
                  )}
                </List>
              </Popover>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {isUpdatingModel && <Loading />}
    </>
  );
};

export default Navbar;
