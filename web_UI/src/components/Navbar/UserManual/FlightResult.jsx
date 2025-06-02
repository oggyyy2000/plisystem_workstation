import React from "react";
import flightResult1 from "../../../assets/images/UserManualImg/FlightResult_1.png";
import flightResult2 from "../../../assets/images/UserManualImg/FlightResult_2.png";

const FlightResult = () => {
  return (
    <div style={{ width: "100%", height: "100%", padding: 4 }}>
      <div style={{ textAlign: "center" }}>
        <img
          src={flightResult1}
          srcSet={flightResult1}
          width={"820px"}
          height={"460px"}
          alt="flightResult1"
        />
        <img
          src={flightResult2}
          srcSet={flightResult2}
          width={"820px"}
          height={"460px"}
          alt="flightResult2"
        />
      </div>
      <ul style={{ listStyleType: "none" }}>
        <li>1. Mã các cột mà UAV vừa bay kiểm tra</li>
        <li>2. Các lựa chọn để lọc ảnh theo ý muốn</li>
        <li>
          3. Thông tin các ảnh đi theo cột mà trong quá trình giám sát máy trạm
          lưu lại
        </li>
        <li>
          4. Nút <b>“Gửi”</b> gửi kết quả ảnh bất thường kèm thông tin mà người
          dùng chọn để gửi về máy chủ trung tâm giám sát
        </li>
        <li>
          5. Kết quả giát sát theo cột sau khi lọc theo tiêu chí chỉ có ảnh bất
          thường
        </li>
        <li>6. Trạng thái các ảnh sau khi được gửi đi</li>
      </ul>
      <p>
        <b>Chức năng: </b>Cho phép người dùng xem thông tin bất thường mà máy
        trạm ghi nhận được khi UAV kết thúc lộ trình bay. Đồng thời người dùng
        có thể chọn và gửi các ảnh kèm thông tin muốn gửi về trung tâm giám sát
      </p>
    </div>
  );
};

export default FlightResult;
