import axiosInstance from "../axios.config";

const getAwsData = async () => {
  try {
    const response = await axiosInstance.get("/api/awsdata");
    return response.data.data;
  } catch (error) {
    console.error("Error @api/trends/getAwsData.ts " + error);
    return null;
  }
};

export default getAwsData;
