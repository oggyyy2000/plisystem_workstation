import { toast } from "react-toastify";
import customAxios from "../utils/customAxios";

export const getData = async ({ jobTicketEndpoint }) => {
  try {
    const response = await customAxios.get(jobTicketEndpoint);
    return response.data;
  } catch (error) {
    console.log("getJobTicketError: ", error);
  }
};

export const postData = async () => {
  try {
    const response = await customAxios.post("jobticket/");
    return response.data;
  } catch (error) {
    console.log("postJobTicketError: ", error);
    if (error.response) {
      if (
        error.response.status === 500 &&
        error.response.data.error === "HTTP Error"
      ) {
        toast.error(
          "Lỗi server máy chủ. Không thể cập nhật nhiệm vụ mới nhất từ máy chủ !"
        );
      }
    }
  }
};
