import React from "react";
import dataManagementMissionDetails from "../../../assets/images/UserManualImg/DataManagementMissionDetails.png";

const DataManagementMissionDetails = () => {
  return (
    <div style={{ width: "100%", height: "100%", padding: 4 }}>
      <div style={{ textAlign: "center" }}>
        <img
          src={dataManagementMissionDetails}
          srcSet={dataManagementMissionDetails}
          width={"820px"}
          height={"460px"}
          alt="dataManagementMissionDetails"
        />
      </div>
      <ul style={{ listStyleType: "none" }}>
        <li>
          1. Thanh thông tin về phiếu đã bay kiểm tra như ngày , tên phiếu, tên
          tuyến được chỉ định bay
        </li>
        <li>
          2. Các kết quả kiểm tra được ghi lại theo mốc thời gian UAV bắt đầu
          gửi thông về máy trạm phân tích đến khi kết thúc gửi thông tin về
        </li>
        <li>
          3. Thông tin các cột đã được kiểm tra tương ứng với mỗi mốc thời gian
          UAV bắt đầu gửi thông tin về cho máy trạm phân tích
        </li>
        <li>
          4. Các bộ lọc chức năng hỗ trợ người dùng thuận tiện gửi kết quả kiểm
          tra về trung tâm giám sát
        </li>
        <li>
          5. Ảnh kèm nhãn đánh giá của ảnh tương ứng với từng cột được chọn xem
          kết quả
        </li>
        <li>
          6. Nút sao chép dữ liệu ảnh theo từng mốc thời gian, khi nhấn nút sao
          chép dữ liệu sẽ được tải xuống thư mục Downloads của máy
        </li>
        <li>
          7. Nút “Gửi ảnh” gửi dữ liệu ảnh kèm nhãn đánh giá tương ứng của ảnh
          mà người dùng đã chọn để gửi về trung tâm giám sát
        </li>
      </ul>
      <p>
        <b>Chức năng: </b>Cho phép người dùng xem lại kết quả mà mình đã bay
        kiểm tra chi tiết theo từng mốc thời gian, từng cột tương ứng. Ngoài
        người dùng có thể chọn và gửi tiếp dữ liệu ảnh kèm thông tin của ảnh về
        trung tâm giám sát, sao chép dữ liệu ảnh ra một thiết bị khác
      </p>
    </div>
  );
};

export default DataManagementMissionDetails;
