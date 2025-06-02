import React from "react";
import settings from "../../../assets/images/UserManualImg/Settings.png";

const SettingItems = () => {
  return (
    <div style={{ width: "100%", height: "100%", padding: 4 }}>
      <div style={{ textAlign: "center" }}>
        <img
          src={settings}
          srcSet={settings}
          width={"820px"}
          height={"460px"}
          alt="settings"
        />
      </div>
      <ul style={{ listStyleType: "none" }}>
        <li> 1. Biểu tượng của chức năng cài đặt</li>
        <li>
          2. Thông tin về tài khoản máy, thông tin này sẽ được cung cấp cho máy
          chủ quản lý ở trung tâm giám sát để hỗ trợ cho việc lấy phiếu và nộp
          phiếu công việc trên máy trạm
        </li>
        <li>
          3. Cài đặt cảnh báo phát nhiệt mối nối thông qua nhiệt độ chênh lệch
          với môi trường kết hợp với nhiệt độ ở mức bao nhiêu thì bắt đầu cảnh
          báo
        </li>
        <li>
          4. Cài đặt tổng số ngày giao công việc muốn dữ lại dữ liệu kết quả
          kiểm tra trong số các ngày mà lãnh đạo giao phiếu công việc. Trong
          trường hợp dữ liệu kiểm tra của các ngày vượt quá giới hạn tổng số
          ngày dữ lại thì dữ liệu trên sẽ được xóa và chỉ dữ lại dữ liệu của các
          ngày gần nhất
        </li>
      </ul>
      <p>
        <b>VD: </b>Các ngày mà lãnh đạo giao phiếu kiểm tra là : <br />
        <ul style={{ paddingLeft: 28 }}>
          <li>05/01/2024</li>
          <li>05/02/2024</li>
          <li>05/03/2024</li>
          <li>05/04/2024</li>
          <li>05/05/2024</li>
          <li>05/06/2024</li>
          <li>05/07/2024</li>
        </ul>
      </p>
      <p>
        Mà trong cài đặt đang để số ngày muốn dữ lại dữ liệu là 5. Thì dữ liệu
        tính đến ngày 05/07/2024 sẽ là 5 ngày gần nhất
        <ul style={{ paddingLeft: 28 }}>
          <li>05/03/2024</li>
          <li>05/04/2024</li>
          <li>05/05/2024</li>
          <li>05/06/2024</li>
          <li>05/07/2024</li>
        </ul>
      </p>
      <ul style={{ listStyleType: "none" }}>
        <li>
          5. Nút <b>“Cập nhật cài đặt”</b> nhằm phục vụ việc cập nhật các thông
          số trong tab cài đặt khi người dùng muốn thay đổi
        </li>
      </ul>
      <p>
        <b>Chức năng: </b>Giúp người dùng điều chỉnh nhanh các thông số nhiệt độ
        cảnh báo và số ngày dữ lại dữ liệu
      </p>
    </div>
  );
};

export default SettingItems;
