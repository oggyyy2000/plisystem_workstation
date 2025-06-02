import React from "react";
import powerlineRouteManagementItems from "../../../assets/images/UserManualImg/PowerlineRouteManagementItems.png";

const PowerlineRouteManagementItems = () => {
  return (
    <div style={{ width: "100%", height: "100%", padding: 4 }}>
      <div style={{ textAlign: "center" }}>
        <img
          src={powerlineRouteManagementItems}
          srcSet={powerlineRouteManagementItems}
          width={"820px"}
          height={"460px"}
          alt="powerlineRouteManagementItems"
        />
      </div>
      <ul style={{ listStyleType: "none" }}>
        <li>1. Thông tin thống kê tổng số tuyến và cột mà máy trạm hiện có</li>
        <li>
          2. Thông tin tuyến được chọn như : tổng số cột, độ dài tuyến. Ngoài ra
          còn có một số nút chức năng như xóa hoặc cập nhật lại thông tin của
          tuyến
        </li>
        <li>
          3. Trực quan hóa tọa độ các cột trong tuyến được trọn trên nền bản đồ
        </li>
      </ul>
      <p>
        <b>Chức năng: </b>Cho người dùng xem nhanh các thông tin cụ thể của từng
        tuyến mà máy trạm hiện có. Bên cạnh đó người dùng có thể xóa hoặc cập
        nhật lại tuyến mà mình chọn
      </p>
    </div>
  );
};

export default PowerlineRouteManagementItems;
