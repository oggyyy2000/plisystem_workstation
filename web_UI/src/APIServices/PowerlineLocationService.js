import customAxios from "../utils/customAxios";

export const getData = async (routeID = "") => {
  try {
    const response = await customAxios.get(
      "powerlinelocation/" + (routeID ? "?powerline_id=" + routeID : "")
    );
    return response.data;
  } catch (error) {
    console.log("getRouteInfoError: ", error);
  }
};