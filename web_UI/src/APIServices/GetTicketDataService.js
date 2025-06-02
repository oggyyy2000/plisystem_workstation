import customAxios from "../utils/customAxios";

export const getData = async (scheduleId, type) => {
  try {
    const response = await customAxios.get(
      "geticketdata/?schedule_id=" + scheduleId
    );
    return response;
  } catch (error) {
    console.log("getTicketDataError: ", error);
  }
};
