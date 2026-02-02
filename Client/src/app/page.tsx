"use client";

import { motion } from "framer-motion";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Trash2, Recycle, DollarSign, Trees, TrendingUp, Map } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { ModeToggle } from "@/components/mode-toggle";

const data = [
  { name: 'Mon', waste: 400, value: 240 },
  { name: 'Tue', waste: 300, value: 139 },
  { name: 'Wed', waste: 200, value: 980 },
  { name: 'Thu', waste: 278, value: 390 },
  { name: 'Fri', waste: 189, value: 480 },
  { name: 'Sat', waste: 239, value: 380 },
  { name: 'Sun', waste: 349, value: 430 },
];

const compositionData = [
  { name: 'Batteries', value: 400, color: '#0F4C3A' },
  { name: 'Phones', value: 300, color: '#39FF14' },
  { name: 'Cables', value: 300, color: '#10B981' },
  { name: 'Laptops', value: 200, color: '#059669' },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors">Welcome back, Admin. Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex gap-3">
          <ModeToggle />
          <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-200 transition-colors">
            Download Report
          </button>
          <button className="px-4 py-2 bg-forest-green dark:bg-green-700 text-neon-lime rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors shadow-lg shadow-forest-green/20">
            Export Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Waste Collected"
          value="2,543 kg"
          trend="+12.5%"
          trendUp={true}
          icon={Trash2}
        />
        <StatsCard
          title="Recovered Value"
          value="$12,450"
          trend="+8.2%"
          trendUp={true}
          icon={DollarSign}
        />
        <StatsCard
          title="Active Bins"
          value="42/45"
          trend="3 Offline"
          trendUp={false}
          icon={Recycle}
        />
        <StatsCard
          title="CO2 Offset"
          value="850 tons"
          trend="+24%"
          trendUp={true}
          icon={Trees}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-2 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors">Collection Trends</h2>
            <div className="flex gap-2">
              <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-600 dark:text-gray-300 transition-colors">Weekly</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F4C3A" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#0F4C3A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" strokeOpacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#0F4C3A' }}
                  labelStyle={{ color: '#374151' }}
                />
                <Area
                  type="monotone"
                  dataKey="waste"
                  stroke="#0F4C3A"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorWaste)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Breakdown Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 transition-colors">Waste Composition</h2>
          <div className="h-[200px] w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compositionData} layout="vertical" barSize={20}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={70} tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: 'none' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {compositionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {compositionData.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600 dark:text-gray-300 transition-colors">{item.name}</span>
                </div>
                <span className="font-semibold dark:text-gray-200 transition-colors">{item.value} kg</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity & Map Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 transition-colors">Live Bin Status</h2>
          <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gray-200/50 dark:bg-gray-800/50 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
                <Map className="w-5 h-5" /> Interactive Map Component
              </p>
            </div>
            {/* Simulated Pins */}
            <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-forest-green border-2 border-white dark:border-gray-900 shadow-lg animate-pulse" />
            <div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-red-500 border-2 border-white dark:border-gray-900 shadow-lg" />
            <div className="absolute bottom-1/3 right-1/3 w-4 h-4 rounded-full bg-forest-green border-2 border-white dark:border-gray-900 shadow-lg" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 transition-colors">Recent Deposits</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">iPhone 11 Pro</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Bin #24 • 2 mins ago</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-forest-green dark:text-green-400">+$45.00</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
