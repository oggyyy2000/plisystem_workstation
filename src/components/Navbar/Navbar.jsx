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
import { Tooltip, Avatar } from "@mui/material";

import logo from "../../assets/images/logo.png";
import workStationLogo from "../../assets/images/workstation.png";

import styles from "./css/Navbar.module.css";
import axios from "axios";

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
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [userPass, setUserPass] = useState({});
  console.log(userPass);

  useEffect(() => {
    const getUserPass = async () => {
      const urlGetUserPass =
        process.env.REACT_APP_API_URL + "userpassworkstation/";

      const responseData = await axios.get(urlGetUserPass);

      setUserPass(responseData.data);
    };
    getUserPass();
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
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
              href="/MainFlight"
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
                    <Button
                      href={page.url}
                      sx={{
                        color: "black",
                        width: "100%",
                      }}
                    >
                      {page.ten_navbar}
                    </Button>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <img className={styles.logoResponsive} src={logo} alt="logo" />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/MainFlight"
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
                <Button
                  key={page.index}
                  onClick={handleCloseNavMenu}
                  href={page.url}
                  sx={{ ml: 4, color: "white", display: "block" }}
                >
                  {page.ten_navbar}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Xem thông tin tài khoản">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 1 }}>
                  <Avatar alt="Workstation Account" src="" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {Object.keys(userPass).map((account) => (
                  <MenuItem>
                    <Typography textAlign="center">
                      <b>
                        {account === "user_authen" ? "Tài khoản" : "Mật khẩu"}:
                      </b>{" "}
                      {userPass[account]}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Navbar;
