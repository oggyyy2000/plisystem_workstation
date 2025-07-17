import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import { publicRoutes, privateRoutes } from "./routes/routes";
import WSContextProvider from "./components/context/WSContext";
import { createTheme, ThemeProvider } from "@mui/material";

import * as NotificationServices from "./APIServices/Notfification";

const App = () => {
  const [hasNewUpdate, setHasNewUpdate] = useState(false);
  const theme = createTheme({
    typography: {
      fontFamily: ["Roboto"],
    },
  });

  useEffect(() => {
    const checkNotification = async () => {
      const postResponseNotiAPI = await NotificationServices.postData();
      console.log("postResponseNotiAPI", postResponseNotiAPI);
      if (
        postResponseNotiAPI?.success &&
        postResponseNotiAPI.success === true
      ) {
        const getResponseNotiAPI = await NotificationServices.getData();
        console.log("getResponseNotiAPI", getResponseNotiAPI);
        if (
          getResponseNotiAPI?.status_model &&
          getResponseNotiAPI.status_model === "true"
        ) {
          toast.warning("Model AI có phiên bản mới, vui lòng cập nhật!");
          setHasNewUpdate(true);
        }
      }
    };
    checkNotification();
  }, []);
  return (
    <>
      <ThemeProvider theme={theme}>
        <ToastContainer
          style={{ zIndex: 99999 }}
          position="top-center"
          autoClose={2000}
          closeOnClick={true}
        />
        <WSContextProvider>
          <HashRouter>
            <Navbar hasNewUpdate={hasNewUpdate} setHasNewUpdate={setHasNewUpdate}/>
            <Routes>
              {publicRoutes.map((publicRoute, index) => {
                return (
                  <Route
                    key={index}
                    path={publicRoute.path}
                    element={publicRoute.component}
                  />
                );
              })}
              {privateRoutes.map((privateRoute, index) => {
                return (
                  <Route
                    key={index}
                    path={privateRoute.path}
                    element={privateRoute.component}
                  />
                );
              })}
            </Routes>
          </HashRouter>
        </WSContextProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
