import customAxios from "../utils/customAxios";

export const postData = async (data) => {
  try {
    const response = await customAxios.post("sentticketdata/", data);
    return response.data;
  } catch (error) {
    console.error("sentTicketDataError: ", error);
  }
};
