import axiosInstance from "./axios.config";

const getCostData = async () => {
  try {
    const response = await axiosInstance.get("/api/costdata");
    return response.data.data;
  } catch (error) {
    console.error("Error @api/getCostData.ts " + error);
    return null;
  }
};

export default getCostData;
