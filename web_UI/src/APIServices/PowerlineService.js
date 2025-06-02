import customAxios from "../utils/customAxios";

export const getAllData = async () => {
  try {
    const response = await customAxios.get("powerline/");
    return response.data;
  } catch (error) {
    console.log("getRouteNameOptionsError: ", error);
  }
};


