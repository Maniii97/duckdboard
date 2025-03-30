import { useLottie } from "lottie-react";
import loader from "../lottie/chatloader.json";

const ChatLoader = () => {
  const options = {
    animationData: loader,
    loop: true,
  };

  const { View } = useLottie(options);

  return (
    <div className="flex flex-col items-center">
      <div className="w-40 h-40">{View}</div>
      <p className="text-sm text-gray-500">Analyzing Cloud data to answer your query...</p>
    </div>
  );
};

export default ChatLoader;
