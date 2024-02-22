import React from "react";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import Loading from "../LoadingPage/LoadingPage";

const Login = () => {
  const navigate = useNavigate();

  // const [receiveData, setReceiveData] = useState();
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    // TODO
    let key = "status";

    const storedVariable = localStorage.getItem(key);

    if (storedVariable) {
      const parsedVariable = JSON.parse(storedVariable);
      const oneDayInMilliseconds = 86400000;

      if (Date.now() - parsedVariable.timestamp >= oneDayInMilliseconds) {
        // Delete the variable if it's older than 1 day
        localStorage.removeItem(key);
      }
    }
  }, []);

  useEffect(() => {
    let key = "status";
    const storedVariable = localStorage.getItem(key);

    if (storedVariable) {
      alert("Đã cập nhật dữ liệu mới nhất !");
      window.location.href = "/MainFlight";
    }
  }, []);

  const handleClickReceiveData = () => {
    // TODO
    setLoading(true);

    let key = "status";
    let value = "data reveived";

    const storedVariable = localStorage.getItem(key);

    // If it doesn't exist, set it with the current timestamp
    if (!storedVariable) {
      localStorage.setItem(
        key,
        JSON.stringify({ value: value, timestamp: Date.now() })
      );
      setLoading(false);
      navigate("/MainFlight", { replace: true });
    } else {
      alert("Đã cập nhật dữ liệu mới nhất !");
      navigate("/MainFlight", { replace: true });
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Button variant="contained" onClick={() => handleClickReceiveData()}>
        Nhận dữ liệu
      </Button>

      {loading && <Loading />}
    </div>
  );
};

export default Login;
