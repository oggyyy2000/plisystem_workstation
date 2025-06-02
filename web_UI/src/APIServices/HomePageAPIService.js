import customAxios from "../utils/customAxios";

export const getData = async () => {
  try {
    const response = await customAxios.get("homepageapiview/");
    return response.data;
  } catch (error) {
    console.log("getHomePageAPIError: ", error);
  }
};