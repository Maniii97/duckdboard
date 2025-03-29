import React from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts";
import { AWSServiceData } from "../types";

interface Props {
  data: AWSServiceData[];
}

export const AWSServicesChart: React.FC<Props> = ({ data }) => {
  const totalCosts = data.reduce((acc, curr) => {
    return acc + curr.ec2 + curr.s3 + curr.lambda + curr.rds;
  }, 0);
  const avgUtilization =
    data.reduce((acc, curr) => acc + curr.utilization, 0) / data.length;

  // Find the service with highest cost
  const serviceTotals = {
    EC2: data.reduce((acc, curr) => acc + curr.ec2, 0),
    S3: data.reduce((acc, curr) => acc + curr.s3, 0),
    Lambda: data.reduce((acc, curr) => acc + curr.lambda, 0),
    RDS: data.reduce((acc, curr) => acc + curr.rds, 0),
  };
  const highestService = Object.entries(serviceTotals).sort(
    (a, b) => b[1] - a[1]
  )[0];

  // Calculate total cost for each data point
  const dataWithTotal = data.map((point) => ({
    ...point,
    totalCost: point.ec2 + point.s3 + point.lambda + point.rds,
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">
        AWS Services Cost Breakdown
      </h2>
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>How to interpret this chart:</strong> Compare individual AWS
          service costs (left axis) with overall resource utilization (right
          axis). The stacked areas show the proportion of total cost from each
          service. Watch for high costs paired with low utilization (below 70%).
        </p>
      </div>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={dataWithTotal}>
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
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="ec2"
              stackId="1"
              stroke="#FF9900"
              fill="#FF9900"
              name="EC2"
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="s3"
              stackId="1"
              stroke="#8C4FFF"
              fill="#8C4FFF"
              name="S3"
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="lambda"
              stackId="1"
              stroke="#E93CAC"
              fill="#E93CAC"
              name="Lambda"
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="rds"
              stackId="1"
              stroke="#1A73E8"
              fill="#1A73E8"
              name="RDS"
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
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Analysis</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>
            • Total AWS services cost over the period: $
            {totalCosts.toLocaleString()}
          </li>
          <li>• Average resource utilization: {avgUtilization.toFixed(1)}%</li>
          <li>
            • Highest cost service: {highestService[0]} ($
            {highestService[1].toLocaleString()})
          </li>
          <li className="font-semibold mt-4">Key Indicators:</li>
          <li>• Stacked areas show the total cost breakdown by service</li>
          <li>• Green line shows overall resource utilization</li>
          <li>• Red reference line at 70% marks minimum desired utilization</li>
          {serviceTotals.EC2 > totalCosts * 0.5 && (
            <li className="text-amber-600">
              • Alert: EC2 costs represent over 50% of total AWS spending
            </li>
          )}
          {avgUtilization < 75 && (
            <li className="text-amber-600">
              • Warning: Low resource utilization, consider downsizing instances
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
