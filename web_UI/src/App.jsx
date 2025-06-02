import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import { publicRoutes, privateRoutes } from "./routes/routes";
import WSContextProvider from "./components/context/WSContext";
import { createTheme, ThemeProvider } from "@mui/material";

const App = () => {
  const theme = createTheme({
    typography: {
      fontFamily: ["Roboto"],
    },
  });
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
            <Navbar />
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
