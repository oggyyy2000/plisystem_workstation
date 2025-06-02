import customAxios from "../utils/customAxios";

export const getData = async ({ routeID = "" }) => {
  try {
    const response = await customAxios.get(
      "manageroute/" + (routeID ? "?powerline_id=" + routeID : "")
    );
    return response.data;
  } catch (error) {
    console.log("getRouteInfoError: ", error);
  }
};

export const delData = async ({ defaultRouteID = "", routeID = "" }) => {
  try {
    const response = await customAxios.delete(
      "manageroute/" +
        (routeID
          ? "?powerline_id=" + routeID
          : "?powerline_id=" + defaultRouteID)
    );
    return response.data;
  } catch (error) {
    console.log("deleteRouteError: ", error);
  }
};

export const updateData = async ({ defaultRouteID = "", routeID = "" }) => {
  try {
    const response = await customAxios.put(
      "manageroute/" +
        (routeID
          ? "?powerline_id=" + routeID
          : "?powerline_id=" + defaultRouteID)
    );
    return response.data;
  } catch (error) {
    console.log("updateRouteError: ", error); 
  }
};
