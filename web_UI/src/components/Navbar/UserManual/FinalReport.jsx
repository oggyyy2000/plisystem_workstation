import React from "react";
import finalReport1 from "../../../assets/images/UserManualImg/FinalReport_1.png";
import finalReport2 from "../../../assets/images/UserManualImg/FinalReport_2.png";

const FinalReport = () => {
  return (
    <div style={{ width: "100%", height: "100%", padding: 4 }}>
      <div style={{ textAlign: "center" }}>
        <img
          src={finalReport1}
          srcSet={finalReport1}
          width={"820px"}
          height={"460px"}
          alt="finalReport1"
        />
        <img
          src={finalReport2}
          srcSet={finalReport2}
          width={"820px"}
          height={"460px"}
          alt="finalReport2"
        />
      </div>
      <ul style={{ listStyleType: "none" }}>
        <li> 1. Các ảnh và thông tin của ảnh ở trạng thái đã được gửi đi</li>
        <li> 2. Nút mở ra phiếu cuối ngày</li>
        <li>
          3, 4, 5, Các ô đầu mục kiểm tra được điền thông tin tự động dựa vào
          ảnh và thông tin của ảnh mà người dùng đã gửi về trung tâm giám sát
          trước đó. Người dùng có thể sửa và điền thêm thông tin vào tất cả các
          ô đầu mục kiểm tra
        </li>
        <li>
          6. Nút <b>“Gửi thông tin báo cáo”</b> gửi phiếu cuối ngày về trung tâm
          giám sát sau khi người dùng xem và kiểm tra
        </li>
      </ul>
      <p>
        <b>Chức năng: </b>Tổng hợp dữ liệu giám sát mà người dùng đã gửi về
        trung tâm giám sát trước đó để tự động điền vào phiếu nội dung giám sát,
        hỗ trợ quy trình kiểm tra giám sát được thuận tiện hơn
      </p>
    </div>
  );
};

export default FinalReport;
