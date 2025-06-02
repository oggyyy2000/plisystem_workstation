import React from "react";

const HotKey = () => {
  return (
    <div style={{ width: "100%", height: "100%", padding: 4 }}>
      <ul style={{ listStyleType: "none" }}>
        <li>
          1. Phím <b>“ESC”</b> là phím kết thúc nhiệm vụ bay
        </li>
        <li>
          2. Phím <b>“S”</b> chủ động chụp lại khung hình hiện tại của luồng
          camera của UAV
        </li>
      </ul>
      <p>
        <b>Chức năng: </b>Hỗ trợ quá trình kiểm tra được thuận tiện hơn
      </p>
    </div>
  );
};

export default HotKey;
