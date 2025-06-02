import React from "react";
import { createContext, useEffect, useRef } from "react";
export const WSContext = createContext();

const WSContextProvider = ({ children }) => {
  const ws = useRef(null);

  const connect = () => {
    disconnect();
    const url = `${process.env.REACT_APP_WS_URL}`;
    ws.current = new WebSocket(url);
    ws.current.onopen = handleOpen;
    ws.current.onclose = handleClose;
  };

  const disconnect = () => {
    if (ws.current) {
      ws.current.close();
    }
  };

  const handleOpen = () => {
    // alert("Đã kết nối websocket");
  };

  const handleClose = () => {
    // alert("Đã bị ngắt kết nối websocket");
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  const wsContextData = { ws, connect, disconnect };

  return (
    <WSContext.Provider value={wsContextData}>{children}</WSContext.Provider>
  );
};

export default WSContextProvider;
