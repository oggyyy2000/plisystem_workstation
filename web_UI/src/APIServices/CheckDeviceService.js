import customAxios from "../utils/customAxios";

export const getData = async ({ errorFromWhere = "" }) => {
  try {
    const response = await customAxios.get("checkdevice/");
    return response.data;
  } catch (error) {
    console.log(errorFromWhere, error);
  }
};
