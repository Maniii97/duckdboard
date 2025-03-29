import { useLottie } from "lottie-react";
import loader from "../lottie/loader.json";

const Loader = () => {
  const options = {
    animationData: loader,
    loop: true,
  };

  const { View } = useLottie(options);

  return (
    <>
      <div className="fixed inset-0 flex flex-col items-center justify-center">
        {View}
      </div>
      <p className="mt-40 fixed inset-0 flex flex-col items-center justify-center text-center text-foreground">
        Fetching Analytics Data...
      </p>
    </>
  );
};

export default Loader;
