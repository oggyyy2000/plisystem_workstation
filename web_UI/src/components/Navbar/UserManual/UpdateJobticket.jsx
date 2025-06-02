import React from "react";
import updateJobticketImg from "../../../assets/images/UserManualImg/Update_Jobticket.png";

const UpdateJobticket = () => {
  return (
    <div style={{ width: "100%", height: "100%", padding: 4 }}>
      <div style={{ textAlign: "center" }}>
        <img
          src={updateJobticketImg}
          srcSet={updateJobticketImg}
          width={"820px"}
          height={"460px"}
          alt="UpdateJobticket"
        />
      </div>
      <ul style={{listStyleType: "none"}}>
        <li>1. Nút cập nhật</li>
      </ul>
      <p>
        <b>Chức năng: </b>Cập nhật phiếu công việc được giao từ máy chủ ở trung
        tâm giám sát
      </p>
    </div>
  );
};

export default UpdateJobticket;
