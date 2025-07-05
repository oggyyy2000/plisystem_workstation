import customAxios from "../utils/customAxios";

export const getAllData = async () => {
  try {
    const response = await customAxios.get("settingworkstation/"
    );

    return response.data;
  } catch (error) {
    console.log("getUserPassError: ", error);
  }
};

export const postData = async ({ formData }) => {
  try {
    const response = await customAxios.post("settingworkstation/",
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
