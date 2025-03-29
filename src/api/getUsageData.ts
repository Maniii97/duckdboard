import axiosInstance from "./axios.config";

const getUsageData = async () => {
  try {
    const response = await axiosInstance.get("/api/usage");
    return response.data.data;
  } catch (error) {
    console.error("Error @api/getUsageData.ts " + error);
    return null;
  }
};

export default getUsageData;
