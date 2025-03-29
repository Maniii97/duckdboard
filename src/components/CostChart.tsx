import React from "react";
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
import { CostData } from "../types";

interface Props {
  data: CostData[];
  title: string;
}

export const CostChart: React.FC<Props> = ({ data, title }) => {
  // Calculate total costs and average utilization
  const totalCosts = data.reduce((acc, curr) => {
    return acc + curr.aws + curr.gcp + curr.azure;
  }, 0);
  const avgUtilization =
    data.reduce((acc, curr) => acc + curr.utilization, 0) / data.length;

  // Find the cloud provider with highest cost
  const providers = {
    AWS: data.reduce((acc, curr) => acc + curr.aws, 0),
    GCP: data.reduce((acc, curr) => acc + curr.gcp, 0),
    Azure: data.reduce((acc, curr) => acc + curr.azure, 0),
  };
  const highestProvider = Object.entries(providers).sort(
    (a, b) => b[1] - a[1]
  )[0];

  // Find cost anomalies (high cost + low utilization)
  const anomalies = data.filter((point) => {
    const totalCost = point.aws + point.gcp + point.azure;
    return point.utilization < 70 && totalCost > 2000;
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
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
              label={{ value: "Date", position: "insideBottom", offset: -5 }}
            />
            <YAxis
              yAxisId="left"
              label={{
                value: "Cost ($)",
                angle: -90,
                position: "insideLeft",
                dy: 20,
              }}
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
            <Tooltip
              formatter={(value: number, name: string) => {
                return name === "Utilization %" ? `${value}%` : `$${value}`;
              }}
            />
            <Legend />
            <ReferenceLine
              y={70}
              yAxisId="right"
              stroke="#EF4444"
              strokeDasharray="3 3"
              label={{
                value: "Min Utilization (70%)",
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
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Analysis</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>
            • Total cloud costs over the period: ${totalCosts.toLocaleString()}
          </li>
          <li>• Average resource utilization: {avgUtilization.toFixed(1)}%</li>
          <li>
            • Highest cost provider: {highestProvider[0]} ($
            {highestProvider[1].toLocaleString()})
          </li>
          {anomalies.length > 0 && (
            <li className="text-red-600">
              • Alert: Found {anomalies.length} instances where costs exceeded
              $2,000 while utilization was below 70%
            </li>
          )}
          <li className="font-semibold mt-4">Key Indicators:</li>
          <li>
            • Green line above 70% with stable cost lines = Efficient resource
            usage
          </li>
          <li>
            • Green line below 70% with high cost peaks = Potential waste, needs
            investigation
          </li>
          <li>
            • Cost spikes without utilization increase = Possible pricing or
            configuration issues
          </li>
        </ul>
      </div>
    </div>
  );
};
