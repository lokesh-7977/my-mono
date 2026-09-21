import { MAIN_IMAGE_URL } from "./constants";

export const getImageURL = (imageKey) => {
    if (!imageKey) return "";
    return MAIN_IMAGE_URL + imageKey.trim();
}