import customAxios from "../utils/customAxios";

export const getData = async ({ supervisionDetailsEndpoint }) => {
  try {
    const response = await customAxios.get(supervisionDetailsEndpoint);
    return response.data;
  } catch (error) {
    console.log("getSupervisionDetailsError: ", error);
  }
};

export const patchData = async (data) => {
  try {
    const response = await customAxios.patch("supervisiondetails/", data);
    return response.data;
  } catch (error) {
    console.log("patchSupervisionDetailsError: ", error);
  }
};
