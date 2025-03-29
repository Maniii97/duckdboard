import axiosInstance from "./axios.config";

const getAwsData = async () => {
  try {
    const response = await axiosInstance.get("/api/awsdata");
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error @api/getAwsData.ts " + error);
    return null;
  }
};

export default getAwsData;
