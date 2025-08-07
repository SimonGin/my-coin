"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type Transaction = {
  from: string;
  to: string;
  amount: number;
  timestamp: number;
};

type Props = {
  transactions: Transaction[];
  address: string;
};

export default function TransactionStatsChart({
  transactions,
  address,
}: Props) {
  // Group transactions by date
  const dataMap: Record<
    string,
    { date: string; send: number; receive: number }
  > = {};

  transactions.forEach((tx) => {
    const date = new Date(tx.timestamp).toISOString().split("T")[0];

    if (!dataMap[date]) {
      dataMap[date] = { date, send: 0, receive: 0 };
    }

    if (tx.from.toLowerCase() === address.toLowerCase()) {
      dataMap[date].send += tx.amount;
    }
    if (tx.to.toLowerCase() === address.toLowerCase()) {
      dataMap[date].receive += tx.amount;
    }
  });

  const chartData = Object.values(dataMap).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="send" stroke="#ff4d4f" name="Sent" />
        <Line
          type="monotone"
          dataKey="receive"
          stroke="#52c41a"
          name="Received"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
