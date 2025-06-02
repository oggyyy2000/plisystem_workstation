import customAxios from "../utils/customAxios";

export const getData = async (scheduleId) => {
  try {
    const response = await customAxios.get("supervisionschedules/?schedule_id=" + scheduleId);
    return response.data;
  } catch (error) {
    console.log("getSupervisionSchedulesError: ", error);
  }
};