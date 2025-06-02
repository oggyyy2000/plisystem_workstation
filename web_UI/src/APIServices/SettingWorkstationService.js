import customAxios from "../utils/customAxios";

export const getAllData = async () => {
  try {
    const response = await customAxios.get(
      process.env.REACT_APP_API_URL + "settingworkstation/"
    );
    
    return response.data;
  } catch (error) {
    console.log("getUserPassError: ", error);
  }
};

export const postData = async ({ formData }) => {
  try {
    const response = await customAxios.post(
      process.env.REACT_APP_API_URL + "settingworkstation/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log("handleUpdateTemperatureError: ", error);
  }
};
