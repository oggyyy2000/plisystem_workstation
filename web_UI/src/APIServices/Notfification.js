import customAxios from "../utils/customAxios";

export const getData = async () => {
    try {
        const response = await customAxios.get("notification/");
        return response;
    } catch (error) {
        console.log("getNotificationError: ", error);
    }
};

export const postData = async () => {
    try {
        const response = await customAxios.post("notification/");
        return response;
    } catch (error) {
        console.log("postNotificationError: ", error);
    }
};