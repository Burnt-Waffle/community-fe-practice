import { refreshToken } from "../api/authClient.js";

export const performSilentRefresh = async () => {
    try {
        await refreshToken();
    } catch (error) {
        console.log("Silent Refresh failed.")
    }
}