import React from "react";
import importData1 from "../../../assets/images/UserManualImg/ImportData1.png";
import importData2 from "../../../assets/images/UserManualImg/ImportData2.png";
import importData3 from "../../../assets/images/UserManualImg/ImportData3.png";

const ImportData = () => {
  return (
    <div style={{ width: "100%", height: "100%", padding: 4 }}>
      <div style={{ textAlign: "center" }}>
        <img
          src={importData1}
          srcSet={importData1}
          width={"820px"}
          height={"460px"}
          alt="importData1"
        />
        <img
          src={importData2}
          srcSet={importData2}
          width={"820px"}
          height={"460px"}
          alt="importData2"
        />
        <img
          src={importData3}
          srcSet={importData3}
          width={"820px"}
          height={"460px"}
          alt="importData3"
        />
      </div>
      <ul style={{ listStyleType: "none" }}>
        <li>
          1. Nút chức năng <b>“Thêm dữ liệu”</b> để mở ra tab thêm dữ liệu ảnh
        </li>
        <li>
          2. Nút <b>“Tìm kiếm trong thư mục”</b> để mở các thư mục có trong máy
          trạm hoặc các thiết bị lưu trữ ảnh được cắm vào máy trạm. Để chọn ảnh
          cần tải lên
        </li>
        <li> 3. Ảnh được chọn sau khi được tải lên</li>
        <li>
          4. Ảnh tải lên chưa được đánh nhãn, để đánh nhãn cho ảnh người dùng
          nhấn chọn vào ảnh cần đánh nhãn , tiếp theo chọn thông tin thích hợp ở
          ô thông tin
        </li>
        <li>
          5. Nút <b>“Thêm thông tin”</b> có trức năng thêm thông tin cho từng
          ảnh vừa mới được chọn đánh thông tin và nhãn phù hợp
        </li>
        <li>
          6. Nút <b>“Gửi”</b>, sau khi tất cả các ảnh được tải lên và đánh nhãn
          lần lượt thì người dùng cần nhấn nút gửi để hoàn tất quá trình thêm
          ảnh
        </li>
        <li> 7. Kết quả của bức ảnh sau khi được tải lên và thêm nhãn</li>
        <li>
          8. Tất cả các ảnh được tải lên đều được lưu lại vào đầu mục{" "}
          <b>“Khac”</b>
        </li>
      </ul>
      <p>
        <b>Chức năng: </b>Trong nhiều trường hợp như địa hình kiểm tra phức tạp
        không thể bay UAV tới để giám sát hoặc sự hạn chế của AI máy trạm khiến
        nó không thể phát hiện ra các trường hợp bất thường cần kiểm tra. Việc
        cho người dùng chủ động thêm các ảnh bất thường được chụp bằng các thiết
        bị khác nhau là giải phát khả quan nhất, đản bảo đủ và đúng các đầu mục
        kiểm tra nếu có bất thường
      </p>
    </div>
  );
};

export default ImportData;
