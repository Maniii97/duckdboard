import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { CostAnalysis, CostData, ForecastAnalysis } from "../types";
import getForecastAnalysis from "@/api/analysis/forecast";
import getCostAnalysis from "@/api/analysis/cost";

interface Props {
  data: CostData[];
  title: string;
  isForecast?: boolean;
  historicalData?: CostData[];
}

export const CostChart: React.FC<Props> = ({
  data,
  title,
  isForecast = false,
  historicalData,
}) => {
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (isForecast && historicalData) {
        const result = await getForecastAnalysis(historicalData, data);
        console.log("Forecast Analysis:", result);
        setAnalysis(result);
      } else {
        const result = await getCostAnalysis(data);
        console.log("Cost Analysis:", result);
        setAnalysis(result);
      }
    };

    fetchAnalysis();
  }, [data, isForecast, historicalData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;

    const point = data.find((d) => d.timestamp === label);
    const isAnomaly = (point?.aws ?? 0) > 1000 && (point?.utilization ?? 0) < 70;

    console.log("Anomaly:", isAnomaly);
    console.log("Point:", point);

    return (
      <div className="bg-white p-4 shadow-lg rounded-lg border">
        <p className="font-semibold">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} style={{ color: entry.color }}>
            {entry.name}:{" "}
            {entry.name.includes("Utilization")
              ? `${entry.value}%`
              : `$${entry.value}`}
          </p>
        ))}
        {isAnomaly && (
          <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
            ⚠️ Anomaly: High cost with low utilization
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>How to interpret this chart:</strong> Compare the total cloud
          costs (left axis) with resource utilization (right axis). An anomaly
          occurs when costs are high but utilization is low (below 70%). The red
          reference line at 70% utilization helps identify these cases.
        </p>
      </div>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              label={{ value: "Dates", position: "insideBottom", offset: -6 }}
            />
            <YAxis
              yAxisId="left"
              label={{ value: "Cost ($)", angle: -90, position: "insideLeft" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              label={{
                value: "Utilization (%)",
                angle: 90,
                position: "insideRight",
                dy: 60,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine
              y={70}
              yAxisId="right"
              stroke="#EF4444"
              strokeDasharray="3 3"
              label={{
                value: "Bar(70%)",
                position: "right",
                fill: "#EF4444",
              }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="aws"
              stroke="#FF9900"
              name="AWS Cost"
              strokeWidth={2}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="gcp"
              stroke="#4285F4"
              name="GCP Cost"
              strokeWidth={2}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="azure"
              stroke="#00A4EF"
              name="Azure Cost"
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="utilization"
              stroke="#22C55E"
              name="Utilization %"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Analysis</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          {!isForecast ? (
            <>
              <li>
                • Total cloud costs: $
                {(analysis as CostAnalysis)?.totalCosts.toLocaleString()}
              </li>
              <li>
                • Average utilization:{" "}
                {analysis && (analysis as CostAnalysis)?.avgUtilization
                  ? (analysis as CostAnalysis).avgUtilization.toFixed(1) + "%"
                  : "N/A"}
              </li>
              <li>
                • Highest cost provider:{" "}
                {(analysis as CostAnalysis)?.highestProvider[0]} ($
                {(
                  analysis as CostAnalysis
                )?.highestProvider[1].toLocaleString()}
                )
              </li>
              {(analysis as CostAnalysis)?.recommendations.map(
                (
                  rec:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | null
                    | undefined,
                  i: React.Key | null | undefined
                ) => (
                  <li key={i} className="text-amber-600">
                    • {rec}
                  </li>
                )
              )}
              <li className="font-semibold mt-4">Key Indicators:</li>
              <li>
                • Green line above 70% with stable cost lines = Efficient
                resource usage
              </li>
              <li>
                • Green line below 70% with high cost peaks = Potential waste,
                needs investigation
              </li>
              <li>
                • Cost spikes without utilization increase = Possible pricing or
                configuration issues
              </li>
            </>
          ) : (
            <>
              <li>
                • Predicted costs: $
                {(
                  analysis as ForecastAnalysis
                )?.predictedCosts.toLocaleString()}
              </li>
              <li>
                • Utilization trend:{" "}
                {(analysis as ForecastAnalysis)?.utilizationTrend}
              </li>
              <li className="font-semibold mt-2">
                Recommended Reserved Instances:
              </li>
              {(analysis as ForecastAnalysis)?.recommendedInstances.map(
                (
                  rec: {
                    provider:
                      | string
                      | number
                      | boolean
                      | React.ReactElement<
                          any,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | React.ReactPortal
                      | null
                      | undefined;
                    count:
                      | string
                      | number
                      | boolean
                      | React.ReactElement<
                          any,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | React.ReactPortal
                      | null
                      | undefined;
                    duration:
                      | string
                      | number
                      | boolean
                      | React.ReactElement<
                          any,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | React.ReactPortal
                      | null
                      | undefined;
                    potentialSavings: {
                      toLocaleString: () =>
                        | string
                        | number
                        | boolean
                        | React.ReactElement<
                            any,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | null
                        | undefined;
                    };
                  },
                  i: React.Key | null | undefined
                ) => (
                  <li key={i}>
                    • {rec.provider}: {rec.count} instances for {rec.duration}days
                    (Save: ${rec.potentialSavings.toLocaleString()})
                  </li>
                )
              )}
              {(analysis as ForecastAnalysis)?.recommendations.map(
                (
                  rec:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | null
                    | undefined,
                  i: React.Key | null | undefined
                ) => (
                  <li key={i} className="text-blue-600">
                    • {rec}
                  </li>
                )
              )}
            </>
          )}
        </ul>
      </div>
    </div>
  );
};
