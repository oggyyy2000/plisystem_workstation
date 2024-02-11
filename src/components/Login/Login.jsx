import React from "react";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";

const Login = () => {
  const [receiveData, setReceiveData] = useState();

  //   useEffect(() => {
  //     let key = "status";
  //     let value = "data reveived";

  //     const storedVariable = localStorage.getItem(key);

  //     // If it doesn't exist, set it with the current timestamp
  //     if (!storedVariable) {
  //       localStorage.setItem(
  //         key,
  //         JSON.stringify({ value: value, timestamp: Date.now() })
  //       );
  //     }

  //     if (storedVariable) {
  //       const parsedVariable = JSON.parse(storedVariable);
  //       const oneDayInMilliseconds = 86400000;

  //       if (Date.now() - parsedVariable.timestamp >= oneDayInMilliseconds) {
  //         // Delete the variable if it's older than 1 day
  //         localStorage.removeItem(key);
  //       }
  //     }
  //   }, []);

  const handleClickReceiveData = () => {
    // TODO
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Button variant="contained" onClick={handleClickReceiveData}>
        Nhận dữ liệu
      </Button>
    </div>
  );
};

export default Login;
