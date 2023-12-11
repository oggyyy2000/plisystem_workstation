import React from "react";
import { createContext, useEffect, useRef } from "react";
export const WSContext = createContext();

const WSContextProvider = ({ children }) => {
  const ws = useRef(null);

  useEffect(() => {
    if (ws.current) {
      ws.current.onopen = () => {
        // alert("Đã kết nối websocket");
      };
      ws.current.onclose = () => {
        /*alert("Đã bị ngắt kết nối websocket")*/
      };
    }

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const connect = async () => {
    disconnect();
    const url = `${process.env.REACT_APP_WS_URL}`;
    ws.current = new WebSocket(url);
    if (ws.current) {
      ws.current.onopen = () => {
        //  alert("Đã kết nối websocket");
      };
    }
  };

  const disconnect = async () => {
    if (ws.current) {
      ws.current.close();
      ws.current.onclose = () => {
        /*alert("Đã bị ngắt kết nối websocket")*/
      };
    }
  };

  // Context data
  const wsContextData = { ws, connect, disconnect };

  // Return provider
  return (
    <WSContext.Provider value={wsContextData}>{children}</WSContext.Provider>
  );
};

export default WSContextProvider;
