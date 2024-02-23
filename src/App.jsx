import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import ActivateNavbar from "./components/customComponents/ActivateNavbar";
import Navbar from "./components/Navbar/Navbar";
import { publicRoutes, privateRoutes } from "./routes/routes";
import WSContextProvider from "./components/context/WSContext";

const App = () => {
  return (
    <>
      <Router>
        <WSContextProvider>
          {/* <ActivateNavbar> */}
            <Navbar />
          {/* </ActivateNavbar> */}
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
        </WSContextProvider>
      </Router>
    </>
  );
};

export default App;
