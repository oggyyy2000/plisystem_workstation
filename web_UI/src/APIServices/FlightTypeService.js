import customAxios from "../utils/customAxios";

export const getData = async () => {
  try {
    const response = await customAxios.get("flighttype/");
    return response.data;
  } catch (error) {
    console.log("getFlightTypeOptionsError: ", error);
  }
};
