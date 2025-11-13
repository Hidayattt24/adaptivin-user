"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ClassOverviewData {
  level: string;
  benar: number;
  salah: number;
}

interface ClassOverviewChartProps {
  data: ClassOverviewData[];
  totalStudents: number;
  totalCorrect: number;
  totalQuestions: number;
  className?: string;
}

const LEVEL_LABELS: Record<string, string> = {
  level1: "level1",
  level2: "level2",
  level3: "level3",
  level4: "level4",
  level5: "level5",
  level6: "level6",
};

const ClassOverviewChart: React.FC<ClassOverviewChartProps> = ({
  data,
  totalStudents,
  totalCorrect,
  totalQuestions,
  className = "",
}) => {
  const accuracy = totalQuestions > 0
    ? ((totalCorrect / totalQuestions) * 100).toFixed(1)
    : "0.0";

  // Transform data for chart
  const chartData = data.map((item) => ({
    name: LEVEL_LABELS[item.level] || item.level,
    Benar: item.benar,
    Salah: item.salah,
  }));

  // Custom tooltip
  interface TooltipPayload {
    payload: { name: string };
    value: number;
  }

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border-2 border-[#336d82] rounded-[10px] p-3 shadow-lg">
          <p className="poppins-semibold text-[#336d82] text-sm mb-1">
            {payload[0].payload.name}
          </p>
          <p className="poppins-medium text-red-600 text-xs">
            Salah: {payload[0].value}
          </p>
          <p className="poppins-medium text-green-600 text-xs">
            Benar: {payload[1].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`${className}`}>
      {/* Chart Container */}
      <div className="bg-gradient-to-br from-[#336d82] via-[#5a96a8] to-[#7bb3c4] rounded-xl sm:rounded-2xl lg:rounded-[20px] shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-white/10 backdrop-blur-sm px-4 sm:px-5 lg:px-6 py-3 sm:py-4 border-b border-white/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-white/80 text-xs poppins-medium mb-1">
                Performa Kelas
              </p>
              <h2 className="text-white text-xl sm:text-2xl lg:text-3xl poppins-bold tracking-tight">
                {totalStudents} Siswa
              </h2>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-[12px] border border-white/30 flex-shrink-0">
              <p className="text-white/90 text-[10px] sm:text-xs poppins-medium mb-0.5">
                Analisis Keseluruhan
              </p>
              <p className="text-white text-sm sm:text-base poppins-semibold">
                Semua Materi
              </p>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-[15px] p-2 sm:p-3 lg:p-4 border border-white/20">
            <ResponsiveContainer width="100%" height={220} className="sm:!h-[280px] lg:!h-[300px]">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 5, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "white", fontSize: 11, fontFamily: "Poppins" }}
                  axisLine={{ stroke: "white" }}
                  tickLine={{ stroke: "white" }}
                />
                <YAxis
                  tick={{ fill: "white", fontSize: 11, fontFamily: "Poppins" }}
                  axisLine={{ stroke: "white" }}
                  tickLine={{ stroke: "white" }}
                  width={30}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{
                    paddingTop: "10px",
                    fontFamily: "Poppins",
                    fontSize: "12px"
                  }}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span className="text-white poppins-semibold text-xs">
                      {value}
                    </span>
                  )}
                />
                <Bar
                  dataKey="Salah"
                  fill="#EF4444"
                  radius={[6, 6, 0, 0]}
                  barSize={30}
                />
                <Bar
                  dataKey="Benar"
                  fill="#22C55E"
                  radius={[6, 6, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Statistics Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-3 sm:mt-4">
            {/* Total Benar */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-[10px] p-2.5 sm:p-3 border border-white/20">
              <p className="text-white/70 text-[10px] sm:text-xs poppins-medium mb-1">Total Benar</p>
              <p className="text-white text-lg sm:text-xl poppins-bold">
                {totalCorrect}
              </p>
            </div>

            {/* Total Salah */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-[10px] p-2.5 sm:p-3 border border-white/20">
              <p className="text-white/70 text-[10px] sm:text-xs poppins-medium mb-1">Total Salah</p>
              <p className="text-white text-lg sm:text-xl poppins-bold">
                {totalQuestions - totalCorrect}
              </p>
            </div>

            {/* Akurasi */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-[10px] p-2.5 sm:p-3 border border-white/20">
              <p className="text-white/70 text-[10px] sm:text-xs poppins-medium mb-1">Akurasi</p>
              <p className="text-white text-lg sm:text-xl poppins-bold">
                {accuracy}%
              </p>
            </div>

            {/* Total Soal */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-[10px] p-2.5 sm:p-3 border border-white/20">
              <p className="text-white/70 text-[10px] sm:text-xs poppins-medium mb-1">Total Soal</p>
              <p className="text-white text-lg sm:text-xl poppins-bold">
                {totalQuestions}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassOverviewChart;
