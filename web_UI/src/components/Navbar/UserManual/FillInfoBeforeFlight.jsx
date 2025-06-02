import React from "react";
import fillInfoBeforeFlight from "../../../assets/images/UserManualImg/FillInfoBeforeFlight.png";

const FillInfoBeforeFlight = () => {
  return (
    <div style={{ width: "100%", height: "100%", padding: 4 }}>
      <div style={{ textAlign: "center" }}>
        <img
          src={fillInfoBeforeFlight}
          srcSet={fillInfoBeforeFlight}
          width={"820px"}
          height={"460px"}
          alt="fillInfoBeforeFlight"
        />
      </div>
      <ul style={{ listStyleType: "none" }}>
        <li>1. Ngày kiểm tra được phân công theo phiếu giao</li>
        <li>2. Tên phiếu kiểm tra được phân kiểm tra</li>
        <li>3. Tên Tuyến kiểm tra</li>
        <li>4. Tên thiết bị UAV kiểm tra</li>
        <li>
          5. Phương thức kiểm tra (3 phương thức Thiết Bị, Nhiệt, Hành Lang)
        </li>
        <li>
          6. Nút <b>“Xác nhận”</b> thông tin vừa chọn để bắt đầu kiểm tra
        </li>
        <li>
          7. Nút <b>“Chọn lại”</b> nếu thông tin vừa chọn không đúng
        </li>
      </ul>
      <p>
        <b>Chức năng: </b>Chọn thông tin cần kiểm tra theo phiếu được phân trước
        khi bắt đầu nột lộ trình bay kiểm tra
      </p>
    </div>
  );
};

export default FillInfoBeforeFlight;
