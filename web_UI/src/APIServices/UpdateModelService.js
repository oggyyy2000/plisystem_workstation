import customAxios from "../utils/customAxios";

export const postData = async () => {
    try {
        const response = await customAxios.post("updatemodel/");
        return response;
    } catch (error) {
        console.log("postUpdateModelError: ", error);
    }
};