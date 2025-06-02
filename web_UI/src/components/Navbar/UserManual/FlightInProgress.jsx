import React from "react";
import flightInProgress from "../../../assets/images/UserManualImg/FlightInProgress.png";

const FlightInProgress = () => {
  return (
    <div style={{ width: "100%", height: "100%", padding: 4 }}>
      <div style={{ textAlign: "center" }}>
        <img
          src={flightInProgress}
          srcSet={flightInProgress}
          width={"820px"}
          height={"460px"}
          alt="flightInProgress"
        />
      </div>
      <ul style={{ listStyleType: "none" }}>
        <li>1. Phần ghi nhận lỗi phát hiện từ máy trạm</li>
        <li>2. Trực quan hóa vị trí lỗi phát hiện trên nền bản đồ</li>
        <li>3. Các phím chức năng sử dụng trong quá trình giám sát</li>
        <li>4. Thông tin GIS của UAV</li>
        <li>5. Luồng camera của UAV gửi về</li>
        <li>6. Nút phóng to luồng camera của UAV gửi về</li>
      </ul>
      <p>
        <b>Chức năng: </b>Theo dõi UAV trong quá trình kiểm tra, hiển thị thông
        tin các bất thường mà máy trạm phát hiện được
      </p>
    </div>
  );
};

export default FlightInProgress;
