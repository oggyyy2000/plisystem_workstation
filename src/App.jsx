import React from "react";
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
        <WSContextProvider>
          <HashRouter>
            <Navbar />
            {/* <BrowserRouter> */}
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
            {/* </BrowserRouter> */}
          </HashRouter>
        </WSContextProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
