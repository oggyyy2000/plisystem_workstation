import React, { useEffect } from "react";

const CheckIfLatestDataReceived = ({ children }) => {
  useEffect(() => {
    // TODO

    let key = "status";
    const storedVariable = localStorage.getItem(key);

    if (!storedVariable) {
      alert("Chưa cập nhật dữ liệu mới nhất !");
      window.location.href = "/";
    }
  }, []);
  return <div>{children}</div>;
};

export default CheckIfLatestDataReceived;
