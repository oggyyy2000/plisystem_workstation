import React from "react";
import dataManagementItems from "../../../assets/images/UserManualImg/DataManagementItem.png";

const DataManagementItems = () => {
  return (
    <div style={{ width: "100%", height: "100%", padding: 4 }}>
      <div style={{ textAlign: "center" }}>
        <img
          src={dataManagementItems}
          srcSet={dataManagementItems}
          width={"820px"}
          height={"460px"}
          alt="dataManagementItems"
        />
      </div>
      <ul style={{ listStyleType: "none" }}>
        <li>
          1. Thông tin các phiếu giám sát được giao chưa hoàn thành được gom
          theo ngày
        </li>
        <li>
          2. Thông tin các phiếu giám sát được giao đã hoàn thành được gom theo
          ngày
        </li>
        <li>3. Trực quan hóa vị trí bất thường trên nền bản đồ</li>
        <li>
          4. Thông tin các cột ghi nhận có bất thường theo phiếu kiểm tra được
          chọn
        </li>
        <li>5. Thông tin các đầu mục bất thường được ghi nhận theo từng cột</li>
      </ul>
      <p>
        <b>Chức năng: </b>Giúp người dùng có thể quản lý và xem lại kết quả công
        việc giám sát theo phiếu được giao
      </p>
    </div>
  );
};

export default DataManagementItems;
