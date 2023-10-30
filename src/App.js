import React from "react";
import { useRoutes } from "react-router-dom";
import MainNavBar from "./components/Navbar/Navbar";
import routes from "./Routes";
import WSContextProvider from "./components/context/WSContext";

function App() {
  const tabs = useRoutes(routes); // them va chinh route o file Routes

  return (
    <>
      <WSContextProvider>
        <MainNavBar />
        {tabs}
      </WSContextProvider>
    </>
  );
}

export default App;
