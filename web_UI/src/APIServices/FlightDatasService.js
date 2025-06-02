import { toast } from "react-toastify";
import customAxios from "../utils/customAxios";

export const postData = async ({
  data,
  options,
}) => {
  try {
    const response = await customAxios.post(
      "flightdatas/",
      data,
      options
    );
    return response.message;
  } catch (error) {
    console.error("postFlightDatasError: ", error);
    if (error.response) {
      if (
        error.response.data.status === 500 &&
        error.response.data.error === "Internal Server Error"
      ) {
        toast.error(
          "Lỗi server máy chủ. Không thể gửi ảnh về máy chủ !"
        );
      }
    }
  }
};