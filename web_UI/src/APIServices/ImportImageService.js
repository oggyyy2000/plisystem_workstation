import customAxios from "../utils/customAxios";

export const postData = async ({ data, options }) => {
  try {
    const response = await customAxios.post("importimage/", data, options);
    return response.data;
  } catch (error) {
    console.error("postImportImageError: ", error);
  }
};
