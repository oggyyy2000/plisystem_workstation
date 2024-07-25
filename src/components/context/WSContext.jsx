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

  // const sendMessage = (message) => {
  //   if (ws.current && ws.current.readyState === WebSocket.OPEN) {
  //     ws.current.send(message);
  //   } else {
  //     console.error("WebSocket is not open. Unable to send message.");
  //   }
  // };

 // Check for URL changes and disconnect WebSocket if needed
 useEffect(() => {
  const handleLocationChange = () => {
    const currentHashPath = window.location.hash;
    const currentPath = window.location.pathname;
    if (!(currentHashPath === "#/MainFlight" || currentPath === "/")) {
      disconnect();
    }
  };

  window.addEventListener("hashchange", handleLocationChange);
  window.addEventListener("popstate", handleLocationChange);

  // Initial check
  handleLocationChange();

  return () => {
    window.removeEventListener("hashchange", handleLocationChange);
    window.removeEventListener("popstate", handleLocationChange);
  };
}, []);

  // Context data
  const wsContextData = { ws, connect, disconnect };

  // Return provider
  return (
    <WSContext.Provider value={wsContextData}>{children}</WSContext.Provider>
  );
};

export default WSContextProvider;
