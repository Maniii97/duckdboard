import { useEffect, useState } from "react";
import { CostChart } from "./components/CostChart";
import { AWSServicesChart } from "./components/AWSServicesChart";
import { APIUsageTable } from "./components/APIUsageTable";
import { Chatbot } from "./components/Chatbot";
import toast from "react-hot-toast";
import getAwsData from "./api/trends/getAwsData";
import getCostData from "./api/trends/getCostData";
import getForecastData from "./api/trends/getForecastData";
import getUsageData from "./api/trends/getUsageData";
import { APIUsage, AWSServiceData, CostData } from "./types";
import Loader from "./components/Loader";

const App = () => {
  const [costData, setCostData] = useState<CostData[]>([]);
  const [forecastData, setForecastData] = useState<CostData[]>([]);
  const [apiUsageData, setApiUsageData] = useState<APIUsage[]>([]);
  const [awsServicesData, setAwsServicesData] = useState<AWSServiceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [costData, forecastData, apiUsageData, awsServicesData] =
          await Promise.all([
            getCostData(),
            getForecastData(),
            getUsageData(),
            getAwsData(),
          ]);

        setCostData(costData);
        setForecastData(forecastData);
        setApiUsageData(apiUsageData);
        setAwsServicesData(awsServicesData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error @App.tsx -> fetchData() " + error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000); // Fetch data every 5 minutes
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (costData.length > 0) {
      const latestData = costData[costData.length - 1];
      if (
        latestData.utilization < 70 &&
        latestData.aws + latestData.gcp + latestData.azure > 2000
      ) {
        toast.error("Cost Anomaly Detected: High costs with low utilization!", {
          duration: 5000,
        });
      }
    }
  }, [costData]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {isLoading && <Loader />}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Cloud Cost & Utilization Dashboard
        </h1>
        <div className="grid grid-cols-1 gap-8">
          <CostChart data={costData} title="Real-Time Cost vs Utilization" />
          <AWSServicesChart data={awsServicesData} />
          <CostChart
            data={forecastData}
            title="Cost Forecast (Next 7 Days)"
            isForecast={true}
            historicalData={costData}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <APIUsageTable data={apiUsageData} />
            <Chatbot />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
