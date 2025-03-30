import axiosInstance from "../axios.config";

const handleChat = async (question : string) => {
  try {
    const response = await axiosInstance.post("/api/chat", {
        question : question,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error @api/chat/chat.ts : " + error);
    return null;
  }
};

export default handleChat;
