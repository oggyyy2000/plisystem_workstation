import React from "react";
import editImageResultLabel1 from "../../../assets/images/UserManualImg/EditImageResultLabel1.png";
import editImageResultLabel2 from "../../../assets/images/UserManualImg/EditImageResultLabel2.png";
import editImageResultLabel3 from "../../../assets/images/UserManualImg/EditImageResultLabel3.png";

const EditImageResultLabel = () => {
  return (
    <div style={{ width: "100%", height: "100%", padding: 4 }}>
      <div style={{ textAlign: "center" }}>
        <img
          src={editImageResultLabel1}
          srcSet={editImageResultLabel1}
          width={"820px"}
          height={"460px"}
          alt="editImageResultLabel1"
        />
        <img
          src={editImageResultLabel2}
          srcSet={editImageResultLabel2}
          width={"820px"}
          height={"460px"}
          alt="editImageResultLabel2"
        />
        <img
          src={editImageResultLabel3}
          srcSet={editImageResultLabel3}
          width={"820px"}
          height={"460px"}
          alt="editImageResultLabel3"
        />
      </div>
      <ul style={{ listStyleType: "none" }}>
        <li>
          1. Ảnh và nhãn của ảnh trước khi sửa với ảnh được đánh nhãn là bình
          thường
        </li>
        <li>
          2. Ảnh và nhãn của ảnh được sửa lại với ảnh được đánh nhãn là cách
          điện thủy tinh vỡ bát
        </li>
        <li> 3. Kết quả sau khi sửa lại nhãn</li>
      </ul>
      <p>
        <b>Chức năng: </b>Cho người dùng tùy chỉnh lại nhãn nếu nhãn được đánh
        tự động bằng AI chưa được đúng
      </p>
    </div>
  );
};

export default EditImageResultLabel;
