import { CostData } from "@/types";
import axiosInstance from "../axios.config";

const getCostAnalysis = async (costData : CostData[]) => {
  try {
    const response = await axiosInstance.post("/api/analysis/cost", {
        costData: costData,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error @api/analysis/cost.ts " + error);
    return null;
  }
};

export default getCostAnalysis;
