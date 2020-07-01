import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const CustomizedAxisTick = ({ x, y, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
        transform="rotate(-35)"
      >
        {payload.value}
      </text>
    </g>
  );
};

const INITIAL_CHART_DATA = [];

const CovidLineChart = ({ chartData = INITIAL_CHART_DATA }) => {
  return !!chartData.length ? (
    <React.Fragment>
      <ResponsiveContainer height="90%">
        <LineChart
          data={chartData}
          margin={{
            top: 30,
            right: 60,
            left: 60,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" height={60} tick={<CustomizedAxisTick />} />{" "}
          <YAxis interval={0} /> <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="cases" stroke="#0000FF" />
          <Line type="monotone" dataKey="deaths" stroke="#FF0000" />
          <Line type="monotone" dataKey="recovered" stroke="#00FF00" />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  ) : (
    <noscript />
  );
};

export default CovidLineChart;
