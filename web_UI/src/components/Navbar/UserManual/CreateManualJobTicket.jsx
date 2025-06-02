import React from "react";
import createManualJobTicket1 from "../../../assets/images/UserManualImg/CreateManualJobTicket_1.png";
import createManualJobTicket2 from "../../../assets/images/UserManualImg/CreateManualJobTicket_2.png";

const CreateManualJobTicket = () => {
  return (
    <div style={{ width: "100%", height: "100%", padding: 4 }}>
      <div style={{ textAlign: "center" }}>
        <img
          src={createManualJobTicket1}
          srcSet={createManualJobTicket1}
          width={"820px"}
          height={"460px"}
          alt="createManualJobTicket1"
        />
        <img
          src={createManualJobTicket2}
          srcSet={createManualJobTicket2}
          width={"820px"}
          height={"460px"}
          alt="createManualJobTicket2"
        />
      </div>
      <ul style={{ listStyleType: "none" }}>
        <li>
          1. Nút <b>“Tạo phiếu mới”</b>
        </li>
        <li>2. Các mục cần nhập để tạo một phiếu bay thủ công</li>
        <li>
          3. Nút <b>“Gửi”</b> để hoàn tất việc tạo phiếu
        </li>
      </ul>
      <p>
        <b>Chức năng: </b>Trong trường hợp người dùng đến nơi không có internet
        việc lấy phiếu được giao đầu ngày không thể hoàn thành. Và máy trạm chỉ
        thực hiện công việc giám sát khi có phiếu được giao. Để giải quyết vấn
        đề không lấy được phiếu phân kiểm tra giám sát để phục vụ cho công tác
        bay kiểm tra thì chức năng tạo phiếu thủ công đã giải quyết vấn đề này
      </p>
    </div>
  );
};

export default CreateManualJobTicket;
