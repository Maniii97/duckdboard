import { CostData } from "@/types";
import axiosInstance from "../axios.config";

const getForecastAnalysis = async (historicalData : CostData[], costData : CostData[]) => {
  try {
    const payload = {
        historicalData: historicalData,
        costData: costData,
    }
    const response = await axiosInstance.post("/api/analysis/forecast", payload);
    return response.data.data;
  } catch (error) {
    console.error("Error @api/analysis/forecast.ts " + error);
    return null;
  }
};

export default getForecastAnalysis;
