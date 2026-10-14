"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface BookingTrendsChartProps {
  data: { date: string; count: number }[];
}

export function BookingTrendsChart({ data }: BookingTrendsChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="bookingGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8a5a2b" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#8a5a2b" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#0000000d" />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => value.slice(5)}
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <YAxis allowDecimals={false} fontSize={11} tickLine={false} axisLine={false} width={24} />
        <Tooltip />
        <Area type="monotone" dataKey="count" stroke="#8a5a2b" fill="url(#bookingGradient)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
