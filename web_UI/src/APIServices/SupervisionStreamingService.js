import customAxios from "../utils/customAxios";

export const postData = async ({
  data,
  options
}) => {
  try {
    const response = await customAxios.post(
      "supervisionstreaming/",
      data,
      options
    );
    return response;
  } catch (error) {
    console.error("ConfirmedDataFromWSError: ", error);
  }
};

