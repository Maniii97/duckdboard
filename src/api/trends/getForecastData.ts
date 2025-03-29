import axiosInstance from "../axios.config";

const getForecastData = async () => {
  try {
    const response = await axiosInstance.get("/api/forecast");
    return response.data.data;
  } catch (error) {
    console.error("Error @api/trends/getForecastData.ts " + error);
    return null;
  }
};

export default getForecastData;
